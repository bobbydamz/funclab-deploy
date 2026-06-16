// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY }
});

const templates = {
  welcome: ({ name, verify_token, email }) => ({
    subject: 'Welcome to BioHAK Wellness! 🌿',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">BioHAK <span style="color:#4bb4b4">Wellness</span></h1>
        </div>
        <div style="padding:40px 32px;background:#fff;">
          <h2 style="color:#1a1a1a;">Welcome, ${name}! 👋</h2>
          <p style="color:#555;line-height:1.8;">Thanks for joining BioHAK Wellness. We're excited to be part of your health journey.</p>
          <p style="color:#555;line-height:1.8;">Start exploring our clean, science-backed supplements designed for real results.</p>
          <a href="${process.env.FRONTEND_URL}/all-products.html" 
             style="display:inline-block;background:#4bb4b4;color:#fff;padding:14px 32px;text-decoration:none;font-weight:700;margin-top:16px;">
            Shop Now
          </a>
          <hr style="margin:32px 0;border:none;border-top:1px solid #e8e4de;">
          <p style="color:#999;font-size:12px;">Use code <strong>WELCOME10</strong> for 10% off your first order.</p>
        </div>
        <div style="background:#f9f8f6;padding:20px 32px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">© 2026 BioHAK Wellness. All rights reserved.<br>
          <a href="mailto:hello@biohakwellness.com" style="color:#4bb4b4;">hello@biohakwellness.com</a></p>
        </div>
      </div>`
  }),

  'reset-password': ({ name, reset_token }) => ({
    subject: 'Reset Your BioHAK Wellness Password',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">BioHAK <span style="color:#4bb4b4">Wellness</span></h1>
        </div>
        <div style="padding:40px 32px;background:#fff;">
          <h2 style="color:#1a1a1a;">Reset your password</h2>
          <p style="color:#555;">Hi ${name}, we received a request to reset your password.</p>
          <a href="${process.env.FRONTEND_URL}/forgot-password.html?token=${reset_token}" 
             style="display:inline-block;background:#1a1a1a;color:#fff;padding:14px 32px;text-decoration:none;font-weight:700;margin-top:16px;">
            Reset Password
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      </div>`
  }),

  'order-confirmation': ({ order, items }) => ({
    subject: `Order Confirmed — #${order.order_number}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">BioHAK <span style="color:#4bb4b4">Wellness</span></h1>
        </div>
        <div style="padding:40px 32px;background:#fff;">
          <h2 style="color:#1a1a1a;">Order Confirmed! 🎉</h2>
          <p style="color:#555;">Your order <strong>#${order.order_number}</strong> has been placed successfully.</p>
          <div style="background:#f9f8f6;padding:20px;margin:20px 0;">
            <p style="margin:0 0 8px;font-weight:700;color:#1a1a1a;">Order Summary</p>
            ${items.map(i => `<p style="margin:4px 0;color:#555;">${i.product_name} × ${i.quantity} — ₹${(i.price * i.quantity).toFixed(2)}</p>`).join('')}
            <hr style="border:none;border-top:1px solid #e8e4de;margin:12px 0;">
            <p style="margin:4px 0;font-weight:700;color:#1a1a1a;">Total: ₹${order.total}</p>
          </div>
          <p style="color:#555;">Delivery to: <strong>${typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address).city : order.shipping_address?.city}</strong></p>
          <p style="color:#999;font-size:13px;">We'll send you a shipping confirmation with tracking details once your order is dispatched.</p>
        </div>
        <div style="background:#f9f8f6;padding:20px 32px;text-align:center;">
          <p style="color:#999;font-size:12px;margin:0;">Questions? Email us at <a href="mailto:hello@biohakwellness.com" style="color:#4bb4b4;">hello@biohakwellness.com</a></p>
        </div>
      </div>`
  }),

  'payment-confirmed': ({ order }) => ({
    subject: `Payment Received — Order #${order.order_number}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1a1a1a;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">BioHAK <span style="color:#4bb4b4">Wellness</span></h1>
        </div>
        <div style="padding:40px 32px;background:#fff;">
          <h2 style="color:#1a1a1a;">Payment Confirmed ✓</h2>
          <p style="color:#555;">Payment of <strong>₹${order.total}</strong> received for order <strong>#${order.order_number}</strong>.</p>
          <div style="background:#f0faf5;border-left:4px solid #4bb4b4;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#1a1a1a;font-weight:700;">What happens next?</p>
            <p style="margin:8px 0 0;color:#555;font-size:14px;">Your order is being prepared. You'll receive a shipping notification with tracking details within 1-2 business days.</p>
          </div>
        </div>
      </div>`
  })
};

const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const t = templates[template]?.(data);
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject: t?.subject || subject,
      html: t?.html || `<p>${JSON.stringify(data)}</p>`
    });
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — email failure shouldn't break the request
  }
};

module.exports = { sendEmail };
