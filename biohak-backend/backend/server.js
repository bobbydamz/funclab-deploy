// ============================================================
// BioHAK Wellness API — server.js
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ──────────────────────────────────────────────
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:5500'
  ],
  credentials: true
}));

// Raw body for Razorpay webhooks BEFORE json parser
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── RATE LIMITING ───────────────────────────────────────────
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
}));
app.use('/api/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many auth attempts, please try again in 15 minutes.' }
}));

// ── ROUTES ──────────────────────────────────────────────────
app.use('/api/auth',     require('./api/auth'));
app.use('/api/products', require('./api/products'));
app.use('/api/cart',     require('./api/cart'));
app.use('/api/orders',   require('./api/orders'));
app.use('/api/payments', require('./api/payments'));
app.use('/api/reviews',  require('./api/reviews'));
app.use('/api/admin',    require('./api/admin'));
app.use('/api/contact',  require('./api/contact'));

// ── HEALTH CHECK ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ── 404 HANDLER ─────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── GLOBAL ERROR HANDLER ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message, err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ── START ───────────────────────────────────────────────────
async function start() {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`✅ BioHAK API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
}
start();
