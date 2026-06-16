// api/reviews.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/reviews?product_id=xxx
router.get('/', async (req, res) => {
  try {
    const { product_id } = req.query;
    const result = await query(
      `SELECT r.id, r.rating, r.title, r.body, r.is_verified, r.created_at,
              COALESCE(r.reviewer_name, u.first_name || ' ' || LEFT(u.last_name,1) || '.') as reviewer_name
       FROM reviews r LEFT JOIN users u ON u.id=r.user_id
       WHERE r.is_approved=true ${product_id ? 'AND r.product_id=$1' : ''}
       ORDER BY r.created_at DESC LIMIT 50`,
      product_id ? [product_id] : []
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;
