// api/contact.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { sendEmail } = require('../utils/email');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });

    await query(
      'INSERT INTO contact_messages (name,email,phone,subject,message) VALUES ($1,$2,$3,$4,$5)',
      [name, email, phone || null, subject || null, message]
    );

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Message: ${subject || 'General Enquiry'}`,
      template: 'welcome', // reuse template structure
      data: { name: 'Admin', verify_token: '', email: process.env.ADMIN_EMAIL }
    });

    res.json({ message: 'Message received. We\'ll get back to you within 24 hours.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// POST /api/contact/newsletter
router.post('/newsletter', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    await query(
      `INSERT INTO newsletter (email, name) VALUES ($1,$2) 
       ON CONFLICT (email) DO UPDATE SET subscribed=true`,
      [email, name || null]
    );

    res.json({ message: 'Subscribed successfully! Welcome to the BioHAK Wellness community.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

module.exports = router;
