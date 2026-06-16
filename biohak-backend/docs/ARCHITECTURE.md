# BioHAK Wellness — System Architecture

## Overview
Production-ready e-commerce MVP for BioHAK Wellness supplements.
Built as a static-first frontend with a Node.js/Express REST API backend,
PostgreSQL database, and Razorpay payment integration.

---

## Tech Stack

| Layer        | Technology                        | Reason                                      |
|--------------|-----------------------------------|---------------------------------------------|
| Frontend     | HTML5, CSS3, Vanilla JS           | Zero build step, fast, Vercel-deployable    |
| Backend      | Node.js + Express                 | Lightweight, fast, great ecosystem          |
| Database     | PostgreSQL (Supabase)             | Relational, free tier, scalable             |
| Auth         | JWT + bcrypt                      | Stateless, secure                           |
| Payments     | Razorpay                          | India-first, UPI + cards + netbanking       |
| Email        | Nodemailer + SendGrid             | Transactional emails                        |
| Storage      | Cloudinary                        | Product images CDN                          |
| Hosting FE   | Vercel                            | Already deployed, free, auto-deploy         |
| Hosting BE   | Render.com                        | Free tier, Node.js support                  |
| Cache        | In-memory (upgrade to Redis)      | Cart sessions, rate limiting                |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│     Browser (Desktop)    Mobile Browser    Mobile App        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│                      VERCEL CDN                              │
│              Static HTML/CSS/JS Frontend                     │
│    index.html, all-products.html, product pages, etc.        │
└──────────────────────────┬──────────────────────────────────┘
                           │ API calls (fetch)
┌──────────────────────────▼──────────────────────────────────┐
│                   RENDER.COM / BACKEND                       │
│                  Node.js + Express API                        │
│  ┌─────────────┬──────────────┬────────────────────────────┐ │
│  │  Auth API   │ Products API │  Orders API   │  Admin API │ │
│  │  /api/auth  │ /api/products│  /api/orders  │ /api/admin │ │
│  └──────┬──────┴──────┬───────┴───────┬───────┴─────┬──────┘ │
│         │             │               │             │         │
│  ┌──────▼─────────────▼───────────────▼─────────────▼──────┐ │
│  │              Middleware Layer                             │ │
│  │  JWT Auth | Rate Limiter | CORS | Logger | Validator     │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼───────┐
│  PostgreSQL  │  │   Razorpay     │  │  SendGrid    │
│  (Supabase)  │  │   Payments     │  │  Email       │
│              │  │                │  │              │
│ users        │  │ create_order   │  │ order conf.  │
│ products     │  │ verify_payment │  │ password rst │
│ orders       │  │ webhooks       │  │ newsletter   │
│ cart         │  │                │  │              │
│ reviews      │  └────────────────┘  └──────────────┘
│ blogs        │
└──────────────┘
```

---

## File Structure

```
biohak-wellness/
│
├── frontend/                          # Static site (Vercel)
│   ├── index.html                     # Homepage
│   ├── all-products.html              # Shop page
│   ├── [product].html                 # 9 product pages
│   ├── cart.html                      # Cart page
│   ├── account.html                   # User account
│   ├── checkout.html                  # Checkout (NEW)
│   ├── order-success.html             # Order success (NEW)
│   ├── order-tracking.html            # Order tracking (NEW)
│   ├── pages/                         # About, legal, info pages
│   │   ├── origin-story.html
│   │   ├── func-manifesto.html
│   │   ├── meet-the-founders.html
│   │   ├── why-these-formulas.html
│   │   ├── ingredients.html
│   │   ├── certified.html
│   │   ├── faqs.html
│   │   ├── contact.html
│   │   ├── privacy-policy.html
│   │   ├── terms-conditions.html
│   │   ├── shipping-policy.html
│   │   └── refunds-cancellation.html
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css               # Global styles
│   │   │   ├── components.css         # Nav, footer, splash
│   │   │   └── pages/                 # Page-specific CSS
│   │   ├── js/
│   │   │   ├── main.js                # Global JS (cart, auth)
│   │   │   ├── api.js                 # API client
│   │   │   ├── cart.js                # Cart logic
│   │   │   ├── auth.js                # Auth logic
│   │   │   ├── checkout.js            # Checkout flow
│   │   │   └── product.js             # Product page logic
│   │   └── images/
│   │       ├── logo.png
│   │       ├── logo-white.png
│   │       └── product-*.png
│   └── vercel.json
│
├── backend/                           # Node.js API (Render)
│   ├── server.js                      # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   ├── database.js                # PostgreSQL connection
│   │   ├── razorpay.js                # Razorpay config
│   │   └── email.js                   # SendGrid config
│   ├── middleware/
│   │   ├── auth.js                    # JWT verification
│   │   ├── rateLimiter.js             # Rate limiting
│   │   ├── validate.js                # Request validation
│   │   └── logger.js                  # Request logging
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   └── Review.js
│   ├── api/
│   │   ├── auth.js                    # /api/auth/*
│   │   ├── products.js                # /api/products/*
│   │   ├── orders.js                  # /api/orders/*
│   │   ├── cart.js                    # /api/cart/*
│   │   ├── payments.js                # /api/payments/*
│   │   ├── reviews.js                 # /api/reviews/*
│   │   └── admin.js                   # /api/admin/*
│   └── utils/
│       ├── email.js                   # Email templates
│       ├── helpers.js                 # Utilities
│       └── constants.js               # App constants
│
├── database/
│   ├── schema.sql                     # Full DB schema
│   ├── seed.sql                       # Initial product data
│   └── migrations/                    # Schema migrations
│
└── docs/
    ├── ARCHITECTURE.md                # This file
    ├── API.md                         # API documentation
    └── DEPLOYMENT.md                  # Deployment guide
```

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  phone         VARCHAR(20),
  role          VARCHAR(20) DEFAULT 'customer',
  is_verified   BOOLEAN DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- Addresses
CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(50),
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  pincode     VARCHAR(10) NOT NULL,
  is_default  BOOLEAN DEFAULT false
);

-- Products
CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(255) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  tagline       VARCHAR(500),
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  mrp           DECIMAL(10,2),
  stock         INTEGER DEFAULT 0,
  image_url     TEXT,
  category      VARCHAR(100),
  tags          TEXT[],
  is_active     BOOLEAN DEFAULT true,
  is_featured   BOOLEAN DEFAULT false,
  weight_grams  INTEGER,
  servings      INTEGER,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Product Variants (flavours, sizes)
CREATE TABLE product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  sku         VARCHAR(100) UNIQUE NOT NULL,
  price       DECIMAL(10,2),
  stock       INTEGER DEFAULT 0
);

-- Cart
CREATE TABLE cart (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id    VARCHAR(255),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     UUID REFERENCES cart(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  variant_id  UUID REFERENCES product_variants(id),
  quantity    INTEGER NOT NULL DEFAULT 1,
  price       DECIMAL(10,2) NOT NULL
);

-- Orders
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number      VARCHAR(50) UNIQUE NOT NULL,
  user_id           UUID REFERENCES users(id),
  email             VARCHAR(255) NOT NULL,
  status            VARCHAR(50) DEFAULT 'pending',
  subtotal          DECIMAL(10,2) NOT NULL,
  shipping_amount   DECIMAL(10,2) DEFAULT 0,
  discount_amount   DECIMAL(10,2) DEFAULT 0,
  total             DECIMAL(10,2) NOT NULL,
  shipping_address  JSONB NOT NULL,
  payment_method    VARCHAR(50),
  payment_status    VARCHAR(50) DEFAULT 'pending',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  notes             TEXT,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  variant_name VARCHAR(100),
  quantity    INTEGER NOT NULL,
  unit_price  DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- Reviews
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255),
  body        TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Coupons
CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  type            VARCHAR(20) NOT NULL, -- 'percentage' | 'fixed'
  value           DECIMAL(10,2) NOT NULL,
  min_order       DECIMAL(10,2) DEFAULT 0,
  max_uses        INTEGER,
  used_count      INTEGER DEFAULT 0,
  expires_at      TIMESTAMP,
  is_active       BOOLEAN DEFAULT true
);

-- Newsletter
CREATE TABLE newsletter (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  subscribed  BOOLEAN DEFAULT true,
  created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## API Endpoints

### Auth — /api/auth
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | /register             | Register new user        | —    |
| POST   | /login                | Login, returns JWT       | —    |
| POST   | /logout               | Invalidate token         | JWT  |
| POST   | /forgot-password      | Send reset email         | —    |
| POST   | /reset-password       | Reset with token         | —    |
| GET    | /me                   | Get current user         | JWT  |
| PUT    | /me                   | Update profile           | JWT  |

### Products — /api/products
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| GET    | /                     | List all products        | —    |
| GET    | /:slug                | Get product by slug      | —    |
| GET    | /featured             | Featured products        | —    |
| GET    | /:id/reviews          | Product reviews          | —    |
| POST   | /:id/reviews          | Submit review            | JWT  |

### Cart — /api/cart
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| GET    | /                     | Get cart                 | —    |
| POST   | /add                  | Add item                 | —    |
| PUT    | /update               | Update quantity          | —    |
| DELETE | /remove/:itemId       | Remove item              | —    |
| DELETE | /clear                | Clear cart               | —    |
| POST   | /apply-coupon         | Apply coupon code        | —    |

### Orders — /api/orders
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | /                     | Create order             | JWT  |
| GET    | /                     | User's orders            | JWT  |
| GET    | /:orderNumber         | Order details            | JWT  |
| GET    | /:orderNumber/track   | Track order              | JWT  |

### Payments — /api/payments
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| POST   | /create-order         | Create Razorpay order    | JWT  |
| POST   | /verify               | Verify payment           | JWT  |
| POST   | /webhook              | Razorpay webhooks        | —    |

### Admin — /api/admin
| Method | Endpoint              | Description              | Auth       |
|--------|-----------------------|--------------------------|------------|
| GET    | /dashboard            | Stats & metrics          | JWT+Admin  |
| GET    | /orders               | All orders               | JWT+Admin  |
| PUT    | /orders/:id/status    | Update order status      | JWT+Admin  |
| GET    | /products             | All products             | JWT+Admin  |
| POST   | /products             | Create product           | JWT+Admin  |
| PUT    | /products/:id         | Update product           | JWT+Admin  |
| GET    | /customers            | All customers            | JWT+Admin  |
| GET    | /reviews              | Pending reviews          | JWT+Admin  |
| PUT    | /reviews/:id/approve  | Approve review           | JWT+Admin  |

---

## Security Measures
- JWT tokens (15min access, 7d refresh)
- bcrypt password hashing (rounds: 12)
- Rate limiting (100 req/15min general, 5/15min auth)
- CORS whitelist
- Helmet.js security headers
- Input validation (express-validator)
- SQL injection protection (parameterized queries)
- Razorpay signature verification on all payments
- HTTPS enforced via Vercel + Render

## Scalability Path
- Phase 1 (MVP): Static HTML + Node API + PostgreSQL
- Phase 2: Add Redis cache, CDN for images
- Phase 3: Convert to Next.js SSR for SEO
- Phase 4: Microservices (separate order, notification services)
- Phase 5: Mobile app (React Native)
