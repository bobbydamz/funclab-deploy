# BioHAK Wellness — Deployment Guide

## Frontend (Vercel) — Already Live
https://biohakwellness.vercel.app

### Deploy Steps:
1. Extract zip to funclab-deploy folder
2. `git add -A && git commit -m "message" && git push`
3. Vercel auto-deploys on push

---

## Backend (Render.com) — New

### 1. Create PostgreSQL Database (Supabase - Free)
1. Go to https://supabase.com → New Project
2. Copy the PostgreSQL connection string
3. Run `database/schema.sql` in the SQL editor
4. Run `database/seed.sql` for initial data

### 2. Deploy Backend to Render
1. Push the `backend/` folder to a new GitHub repo
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Settings:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: Node
5. Add environment variables (copy from .env.example):
   - DATABASE_URL
   - JWT_SECRET (generate: `openssl rand -hex 32`)
   - JWT_REFRESH_SECRET
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - RAZORPAY_WEBHOOK_SECRET
   - SENDGRID_API_KEY
   - EMAIL_FROM
   - FRONTEND_URL = https://biohakwellness.vercel.app

### 3. Update Frontend API URL
In `assets/js/api.js`, update:
```js
const API_BASE = 'https://YOUR-APP.onrender.com/api';
```

### 4. Configure Razorpay Webhooks
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://YOUR-APP.onrender.com/api/payments/webhook`
3. Events: payment.captured, payment.failed
4. Copy webhook secret to RAZORPAY_WEBHOOK_SECRET env var

---

## Razorpay Setup (Test Mode)
1. Go to https://dashboard.razorpay.com
2. Settings → API Keys → Generate Test Key
3. Copy Key ID and Key Secret to env vars
4. Test with card: 4111 1111 1111 1111, CVV: 123, Expiry: any future date

---

## Environment Variables Reference
| Variable                 | Where to get it                          |
|--------------------------|------------------------------------------|
| DATABASE_URL             | Supabase Project Settings → Database     |
| JWT_SECRET               | `openssl rand -hex 32`                   |
| RAZORPAY_KEY_ID          | Razorpay Dashboard → API Keys            |
| RAZORPAY_KEY_SECRET      | Razorpay Dashboard → API Keys            |
| SENDGRID_API_KEY         | SendGrid Dashboard → API Keys            |

---

## Estimated Costs (MVP)
| Service    | Plan  | Cost        |
|------------|-------|-------------|
| Vercel     | Free  | ₹0/month    |
| Render     | Free  | ₹0/month    |
| Supabase   | Free  | ₹0/month    |
| SendGrid   | Free  | ₹0/month    |
| Razorpay   | —     | 2% per txn  |
| **Total**  |       | **₹0 + txn fees** |
