// api/products.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { auth } = require('../middleware/auth');

// GET /api/products — list all active products
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'sort_order', featured } = req.query;
    let sql = `
      SELECT p.*,
        COALESCE(AVG(r.rating), 0)::NUMERIC(3,1) as avg_rating,
        COUNT(r.id) as review_count
      FROM products p
      LEFT JOIN reviews r ON r.product_id = p.id AND r.is_approved = true
      WHERE p.is_active = true
    `;
    const params = [];
    
    if (category) { params.push(category); sql += ` AND p.category = $${params.length}`; }
    if (featured === 'true') sql += ` AND p.is_featured = true`;
    if (search) { params.push(`%${search}%`); sql += ` AND (p.name ILIKE $${params.length} OR p.tagline ILIKE $${params.length})`; }
    
    const validSorts = { sort_order: 'p.sort_order', price_asc: 'p.price ASC', price_desc: 'p.price DESC', name: 'p.name' };
    sql += ` GROUP BY p.id ORDER BY ${validSorts[sort] || 'p.sort_order'}`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/featured
router.get('/featured', async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, COALESCE(AVG(r.rating), 0)::NUMERIC(3,1) as avg_rating, COUNT(r.id) as review_count
       FROM products p LEFT JOIN reviews r ON r.product_id = p.id AND r.is_approved = true
       WHERE p.is_active = true AND p.is_featured = true
       GROUP BY p.id ORDER BY p.sort_order LIMIT 6`,
      []
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*,
        COALESCE(AVG(r.rating), 0)::NUMERIC(3,1) as avg_rating,
        COUNT(r.id) as review_count,
        COALESCE(json_agg(v.*) FILTER (WHERE v.id IS NOT NULL), '[]') as variants
       FROM products p
       LEFT JOIN reviews r ON r.product_id = p.id AND r.is_approved = true
       LEFT JOIN product_variants v ON v.product_id = p.id AND v.is_active = true
       WHERE p.slug = $1 AND p.is_active = true
       GROUP BY p.id`,
      [req.params.slug]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/products/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const result = await query(
      `SELECT r.id, r.rating, r.title, r.body, r.is_verified, r.created_at,
              COALESCE(r.reviewer_name, u.first_name || ' ' || LEFT(u.last_name,1) || '.') as reviewer_name
       FROM reviews r
       LEFT JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1 AND r.is_approved = true
       ORDER BY r.created_at DESC LIMIT 20`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, title, body } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    // Check if user has bought this product
    const purchased = await query(
      `SELECT o.id FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1 AND oi.product_id = $2 AND o.status = 'delivered'`,
      [req.user.id, req.params.id]
    );

    await query(
      `INSERT INTO reviews (product_id, user_id, rating, title, body, is_verified)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [req.params.id, req.user.id, rating, title, body, purchased.rows.length > 0]
    );

    res.status(201).json({ message: 'Review submitted for approval. Thank you!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
