// api/cart.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

const getOrCreateCart = async (userId, sessionId) => {
  const filter = userId ? 'user_id = $1' : 'session_id = $1';
  const val = userId || sessionId;
  let result = await query(`SELECT id FROM cart WHERE ${filter}`, [val]);
  if (result.rows.length) return result.rows[0].id;
  const newCart = await query(
    'INSERT INTO cart (user_id, session_id) VALUES ($1,$2) RETURNING id',
    [userId || null, userId ? null : sessionId]
  );
  return newCart.rows[0].id;
};

const getCartData = async (cartId) => {
  const items = await query(
    `SELECT ci.id, ci.quantity, ci.price,
            p.id as product_id, p.name, p.slug, p.image_url, p.stock,
            pv.id as variant_id, pv.name as variant_name
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     LEFT JOIN product_variants pv ON pv.id = ci.variant_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );
  const cart = await query('SELECT coupon_code FROM cart WHERE id = $1', [cartId]);
  
  const subtotal = items.rows.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const threshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD || 1000);
  const shipping = subtotal >= threshold ? 0 : parseFloat(process.env.SHIPPING_CHARGE || 99);
  
  return {
    items: items.rows,
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    total: (subtotal + shipping).toFixed(2),
    coupon_code: cart.rows[0]?.coupon_code || null,
    free_shipping_remaining: subtotal >= threshold ? 0 : (threshold - subtotal).toFixed(2)
  };
};

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    const cartId = await getOrCreateCart(req.user?.id, sessionId);
    res.json(await getCartData(cartId));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart/add
router.post('/add', async (req, res) => {
  try {
    const { product_id, variant_id, quantity = 1 } = req.body;
    if (!product_id) return res.status(400).json({ error: 'Product ID required' });

    const product = await query('SELECT id, price, stock FROM products WHERE id = $1 AND is_active = true', [product_id]);
    if (!product.rows.length) return res.status(404).json({ error: 'Product not found' });
    if (product.rows[0].stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const sessionId = req.headers['x-session-id'];
    const cartId = await getOrCreateCart(req.user?.id, sessionId);

    // Check if item already in cart
    const existing = await query(
      'SELECT id, quantity FROM cart_items WHERE cart_id=$1 AND product_id=$2 AND (variant_id=$3 OR (variant_id IS NULL AND $3 IS NULL))',
      [cartId, product_id, variant_id || null]
    );

    if (existing.rows.length) {
      const newQty = existing.rows[0].quantity + quantity;
      await query('UPDATE cart_items SET quantity=$1 WHERE id=$2', [newQty, existing.rows[0].id]);
    } else {
      const price = variant_id
        ? (await query('SELECT price FROM product_variants WHERE id=$1', [variant_id])).rows[0]?.price
        : product.rows[0].price;
      await query(
        'INSERT INTO cart_items (cart_id,product_id,variant_id,quantity,price) VALUES ($1,$2,$3,$4,$5)',
        [cartId, product_id, variant_id || null, quantity, price]
      );
    }

    res.json(await getCartData(cartId));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// PUT /api/cart/update
router.put('/update', async (req, res) => {
  try {
    const { item_id, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

    const sessionId = req.headers['x-session-id'];
    const cartId = await getOrCreateCart(req.user?.id, sessionId);

    await query('UPDATE cart_items SET quantity=$1 WHERE id=$2 AND cart_id=$3', [quantity, item_id, cartId]);
    res.json(await getCartData(cartId));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart/remove/:itemId
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'];
    const cartId = await getOrCreateCart(req.user?.id, sessionId);
    await query('DELETE FROM cart_items WHERE id=$1 AND cart_id=$2', [req.params.itemId, cartId]);
    res.json(await getCartData(cartId));
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// POST /api/cart/apply-coupon
router.post('/apply-coupon', async (req, res) => {
  try {
    const { code } = req.body;
    const sessionId = req.headers['x-session-id'];
    const cartId = await getOrCreateCart(req.user?.id, sessionId);
    const cartData = await getCartData(cartId);

    const coupon = await query(
      `SELECT * FROM coupons WHERE code = $1 AND is_active = true 
       AND (expires_at IS NULL OR expires_at > NOW())
       AND (max_uses IS NULL OR used_count < max_uses)`,
      [code.toUpperCase()]
    );
    if (!coupon.rows.length) return res.status(400).json({ error: 'Invalid or expired coupon code' });

    const c = coupon.rows[0];
    if (parseFloat(cartData.subtotal) < c.min_order) {
      return res.status(400).json({ error: `Minimum order of ₹${c.min_order} required for this coupon` });
    }

    let discount = c.type === 'percentage'
      ? (parseFloat(cartData.subtotal) * c.value / 100)
      : c.value;
    if (c.max_discount) discount = Math.min(discount, c.max_discount);

    await query('UPDATE cart SET coupon_code=$1 WHERE id=$2', [code.toUpperCase(), cartId]);

    res.json({
      ...cartData,
      coupon_code: code.toUpperCase(),
      coupon_discount: discount.toFixed(2),
      total: (parseFloat(cartData.total) - discount).toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
});

module.exports = router;
