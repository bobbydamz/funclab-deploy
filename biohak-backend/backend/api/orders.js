// api/orders.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const generateOrderNumber = () => 'BH' + Date.now().toString().slice(-8);

// POST /api/orders — Create order
router.post('/', auth, async (req, res) => {
  const client = await require('../config/database').pool.connect();
  try {
    await client.query('BEGIN');
    const { shipping_address, notes, coupon_code } = req.body;
    if (!shipping_address) return res.status(400).json({ error: 'Shipping address required' });

    // Get user's cart
    const cartResult = await client.query(
      `SELECT ci.*, p.name as product_name, p.image_url, p.stock, pv.name as variant_name
       FROM cart c
       JOIN cart_items ci ON ci.cart_id = c.id
       JOIN products p ON p.id = ci.product_id
       LEFT JOIN product_variants pv ON pv.id = ci.variant_id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    if (!cartResult.rows.length) return res.status(400).json({ error: 'Cart is empty' });

    // Verify stock
    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${item.product_name}` });
      }
    }

    const subtotal = cartResult.rows.reduce((s, i) => s + (i.price * i.quantity), 0);
    const threshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || 1000);
    const shipping = subtotal >= threshold ? 0 : parseFloat(process.env.SHIPPING_CHARGE || 99);

    let discount = 0;
    if (coupon_code) {
      const coupon = await client.query(
        'SELECT * FROM coupons WHERE code=$1 AND is_active=true AND (expires_at IS NULL OR expires_at>NOW())',
        [coupon_code]
      );
      if (coupon.rows.length) {
        const c = coupon.rows[0];
        discount = c.type === 'percentage' ? (subtotal * c.value / 100) : c.value;
        if (c.max_discount) discount = Math.min(discount, c.max_discount);
        await client.query('UPDATE coupons SET used_count=used_count+1 WHERE code=$1', [coupon_code]);
      }
    }

    const total = subtotal + shipping - discount;
    const order_number = generateOrderNumber();

    const order = await client.query(
      `INSERT INTO orders (order_number,user_id,email,subtotal,shipping_amount,discount_amount,total,
        shipping_address,coupon_code,notes,status,payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending','pending') RETURNING *`,
      [order_number, req.user.id, req.user.email, subtotal, shipping, discount, total,
       JSON.stringify(shipping_address), coupon_code || null, notes || null]
    );

    // Insert order items & decrement stock
    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items (order_id,product_id,product_name,product_image,variant_id,variant_name,quantity,unit_price,total_price)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [order.rows[0].id, item.product_id, item.product_name, item.image_url,
         item.variant_id || null, item.variant_name || null, item.quantity, item.price, item.price * item.quantity]
      );
      await client.query('UPDATE products SET stock=stock-$1 WHERE id=$2', [item.quantity, item.product_id]);
    }

    // Clear cart
    await client.query('DELETE FROM cart WHERE user_id=$1', [req.user.id]);
    await client.query('COMMIT');

    // Send confirmation email
    await sendEmail({
      to: req.user.email,
      subject: `Order Confirmed — #${order_number}`,
      template: 'order-confirmation',
      data: { order: order.rows[0], items: cartResult.rows }
    });

    res.status(201).json(order.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// GET /api/orders — User's orders
router.get('/', auth, async (req, res) => {
  try {
    const result = await query(
      `SELECT o.*,
        COALESCE(json_agg(json_build_object(
          'id', oi.id, 'product_name', oi.product_name, 'product_image', oi.product_image,
          'quantity', oi.quantity, 'unit_price', oi.unit_price, 'total_price', oi.total_price
        )), '[]') as items
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = $1
       GROUP BY o.id ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:orderNumber
router.get('/:orderNumber', auth, async (req, res) => {
  try {
    const order = await query(
      `SELECT o.*,
        json_agg(json_build_object(
          'id', oi.id, 'product_id', oi.product_id, 'product_name', oi.product_name,
          'product_image', oi.product_image, 'quantity', oi.quantity,
          'unit_price', oi.unit_price, 'total_price', oi.total_price
        )) as items
       FROM orders o JOIN order_items oi ON oi.order_id = o.id
       WHERE o.order_number=$1 AND o.user_id=$2
       GROUP BY o.id`,
      [req.params.orderNumber, req.user.id]
    );
    if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(order.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;
