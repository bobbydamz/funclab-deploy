// api/admin.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { auth, adminOnly } = require('../middleware/auth');

router.use(auth, adminOnly);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const [orders, revenue, customers, products, pendingReviews, recentOrders] = await Promise.all([
      query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status='pending') as pending FROM orders"),
      query("SELECT COALESCE(SUM(total),0) as total, COALESCE(SUM(total) FILTER (WHERE created_at > NOW()-INTERVAL '30 days'),0) as this_month FROM orders WHERE payment_status='paid'"),
      query("SELECT COUNT(*) as total FROM users WHERE role='customer'"),
      query("SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE stock <= low_stock_alert) as low_stock FROM products WHERE is_active=true"),
      query("SELECT COUNT(*) as total FROM reviews WHERE is_approved=false"),
      query(`SELECT o.id, o.order_number, o.email, o.total, o.status, o.payment_status, o.created_at,
              COUNT(oi.id) as item_count
             FROM orders o LEFT JOIN order_items oi ON oi.order_id=o.id
             GROUP BY o.id ORDER BY o.created_at DESC LIMIT 10`)
    ]);

    res.json({
      stats: {
        total_orders: parseInt(orders.rows[0].total),
        pending_orders: parseInt(orders.rows[0].pending),
        total_revenue: parseFloat(revenue.rows[0].total),
        monthly_revenue: parseFloat(revenue.rows[0].this_month),
        total_customers: parseInt(customers.rows[0].total),
        total_products: parseInt(products.rows[0].total),
        low_stock_products: parseInt(products.rows[0].low_stock),
        pending_reviews: parseInt(pendingReviews.rows[0].total)
      },
      recent_orders: recentOrders.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let sql = `SELECT o.*, COUNT(oi.id) as item_count FROM orders o
               LEFT JOIN order_items oi ON oi.order_id=o.id`;
    const params = [];
    if (status) { params.push(status); sql += ` WHERE o.status=$${params.length}`; }
    sql += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
    params.push(limit, offset);
    const result = await query(sql, params);
    const count = await query('SELECT COUNT(*) FROM orders' + (status ? ` WHERE status='${status}'` : ''));
    res.json({ orders: result.rows, total: parseInt(count.rows[0].count), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/admin/orders/:id/status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status, note, tracking_number, courier_name } = req.body;
    const valid = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
    if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const result = await query(
      `UPDATE orders SET status=$1, tracking_number=COALESCE($2,tracking_number),
       courier_name=COALESCE($3,courier_name), updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [status, tracking_number || null, courier_name || null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Order not found' });

    await query(
      'INSERT INTO order_status_history (order_id,status,note,created_by) VALUES ($1,$2,$3,$4)',
      [req.params.id, status, note || null, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, COUNT(oi.id) as total_sold
       FROM products p LEFT JOIN order_items oi ON oi.product_id=p.id
       GROUP BY p.id ORDER BY p.sort_order`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const { name, price, mrp, stock, is_active, is_featured, tagline, short_desc } = req.body;
    const result = await query(
      `UPDATE products SET name=COALESCE($1,name), price=COALESCE($2,price), mrp=COALESCE($3,mrp),
       stock=COALESCE($4,stock), is_active=COALESCE($5,is_active), is_featured=COALESCE($6,is_featured),
       tagline=COALESCE($7,tagline), short_desc=COALESCE($8,short_desc), updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [name, price, mrp, stock, is_active, is_featured, tagline, short_desc, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// GET /api/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at,
        COUNT(DISTINCT o.id) as order_count, COALESCE(SUM(o.total),0) as lifetime_value
       FROM users u LEFT JOIN orders o ON o.user_id=u.id
       WHERE u.role='customer' GROUP BY u.id ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/admin/reviews
router.get('/reviews', async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, p.name as product_name
       FROM reviews r JOIN products p ON p.id=r.product_id
       WHERE r.is_approved=false ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// PUT /api/admin/reviews/:id/approve
router.put('/reviews/:id/approve', async (req, res) => {
  try {
    const { approve } = req.body;
    if (approve === false) {
      await query('DELETE FROM reviews WHERE id=$1', [req.params.id]);
      return res.json({ message: 'Review rejected and deleted' });
    }
    const result = await query(
      'UPDATE reviews SET is_approved=true WHERE id=$1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process review' });
  }
});

module.exports = router;
