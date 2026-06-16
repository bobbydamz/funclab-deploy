// api/payments.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { query } = require('../config/database');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { order_id } = req.body;
    const order = await query(
      'SELECT * FROM orders WHERE id=$1 AND user_id=$2',
      [order_id, req.user.id]
    );
    if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });

    const o = order.rows[0];
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(parseFloat(o.total) * 100), // paise
      currency: 'INR',
      receipt: o.order_number,
      notes: { order_id: o.id, user_id: req.user.id }
    });

    await query(
      'UPDATE orders SET razorpay_order_id=$1 WHERE id=$2',
      [razorpayOrder.id, o.id]
    );

    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      order_number: o.order_number,
      user_email: req.user.email
    });
  } catch (err) {
    console.error('Payment order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// POST /api/payments/verify
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const order = await query(
      `UPDATE orders SET 
        payment_status='paid', status='confirmed',
        razorpay_payment_id=$1, razorpay_signature=$2, updated_at=NOW()
       WHERE razorpay_order_id=$3 AND user_id=$4
       RETURNING *`,
      [razorpay_payment_id, razorpay_signature, razorpay_order_id, req.user.id]
    );

    if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });

    const o = order.rows[0];

    // Log status history
    await query(
      'INSERT INTO order_status_history (order_id, status, note) VALUES ($1,$2,$3)',
      [o.id, 'confirmed', `Payment confirmed via Razorpay: ${razorpay_payment_id}`]
    );

    // Send payment confirmation email
    await sendEmail({
      to: o.email,
      subject: `Payment Confirmed — Order #${o.order_number}`,
      template: 'payment-confirmed',
      data: { order: o }
    });

    res.json({ success: true, order_number: o.order_number });
  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// POST /api/payments/webhook — Razorpay webhooks
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body.toString();

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expected) return res.status(400).json({ error: 'Invalid webhook signature' });

    const event = JSON.parse(body);
    const { event: eventType, payload } = event;

    if (eventType === 'payment.captured') {
      const { order_id } = payload.payment.entity;
      await query(
        `UPDATE orders SET payment_status='paid', status='confirmed' 
         WHERE razorpay_order_id=$1 AND payment_status='pending'`,
        [order_id]
      );
    }

    if (eventType === 'payment.failed') {
      const { order_id } = payload.payment.entity;
      await query(
        `UPDATE orders SET payment_status='failed' WHERE razorpay_order_id=$1`,
        [order_id]
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
