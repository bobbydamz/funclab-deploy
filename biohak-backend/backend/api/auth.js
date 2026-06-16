// api/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { query } = require('../config/database');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
const generateOrderNumber = () => 'BH' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 100);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const exists = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 12);
    const verify_token = crypto.randomBytes(32).toString('hex');

    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, verify_token)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, first_name, last_name, role`,
      [email.toLowerCase(), password_hash, first_name, last_name, phone, verify_token]
    );
    const user = result.rows[0];

    // Send welcome email
    await sendEmail({
      to: email,
      subject: 'Welcome to BioHAK Wellness!',
      template: 'welcome',
      data: { name: first_name || 'there', verify_token, email }
    });

    const token = generateToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email, first_name: user.first_name, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const result = await query(
      'SELECT id, email, password_hash, first_name, last_name, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (!result.rows.length) return res.status(401).json({ error: 'Invalid email or password' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.role, u.created_at,
       COALESCE(json_agg(a.*) FILTER (WHERE a.id IS NOT NULL), '[]') as addresses
       FROM users u LEFT JOIN addresses a ON a.user_id = u.id
       WHERE u.id = $1 GROUP BY u.id`,
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/auth/me
router.put('/me', auth, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    const result = await query(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, updated_at=NOW()
       WHERE id=$4 RETURNING id, email, first_name, last_name, phone`,
      [first_name, last_name, phone, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await query('SELECT id, first_name FROM users WHERE email = $1', [email?.toLowerCase()]);
    
    // Always return success to prevent email enumeration
    if (!result.rows.length) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const user = result.rows[0];
    const reset_token = crypto.randomBytes(32).toString('hex');
    const reset_token_exp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      'UPDATE users SET reset_token=$1, reset_token_exp=$2 WHERE id=$3',
      [reset_token, reset_token_exp, user.id]
    );

    await sendEmail({
      to: email,
      subject: 'Reset your BioHAK Wellness password',
      template: 'reset-password',
      data: { name: user.first_name || 'there', reset_token, email }
    });

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const result = await query(
      'SELECT id FROM users WHERE reset_token=$1 AND reset_token_exp > NOW()',
      [token]
    );
    if (!result.rows.length) return res.status(400).json({ error: 'Invalid or expired reset token' });

    const password_hash = await bcrypt.hash(password, 12);
    await query(
      'UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_exp=NULL WHERE id=$2',
      [password_hash, result.rows[0].id]
    );

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// POST /api/auth/addresses
router.post('/addresses', auth, async (req, res) => {
  try {
    const { label, full_name, phone, line1, line2, city, state, pincode, is_default } = req.body;
    
    if (is_default) {
      await query('UPDATE addresses SET is_default=false WHERE user_id=$1', [req.user.id]);
    }
    
    const result = await query(
      `INSERT INTO addresses (user_id,label,full_name,phone,line1,line2,city,state,pincode,is_default)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [req.user.id, label, full_name, phone, line1, line2, city, state, pincode, is_default || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add address' });
  }
});

module.exports = router;
