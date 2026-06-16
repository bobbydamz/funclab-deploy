-- ============================================================
-- BioHAK Wellness — PostgreSQL Database Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  first_name        VARCHAR(100),
  last_name         VARCHAR(100),
  phone             VARCHAR(20),
  role              VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  is_verified       BOOLEAN DEFAULT false,
  verify_token      VARCHAR(255),
  reset_token       VARCHAR(255),
  reset_token_exp   TIMESTAMP,
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

-- ── ADDRESSES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(50) DEFAULT 'Home',
  full_name   VARCHAR(200) NOT NULL,
  phone       VARCHAR(20),
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  pincode     VARCHAR(10) NOT NULL,
  country     VARCHAR(100) DEFAULT 'India',
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── PRODUCTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  tagline         VARCHAR(500),
  description     TEXT,
  short_desc      TEXT,
  price           DECIMAL(10,2) NOT NULL,
  mrp             DECIMAL(10,2),
  stock           INTEGER DEFAULT 0,
  low_stock_alert INTEGER DEFAULT 10,
  image_url       TEXT,
  images          TEXT[],
  category        VARCHAR(100),
  tags            TEXT[],
  benefits        TEXT[],
  ingredients     TEXT,
  how_to_use      TEXT,
  weight_grams    INTEGER,
  servings        INTEGER,
  serving_size    VARCHAR(50),
  is_active       BOOLEAN DEFAULT true,
  is_featured     BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0,
  meta_title      VARCHAR(255),
  meta_desc       TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ── PRODUCT VARIANTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  sku         VARCHAR(100) UNIQUE NOT NULL,
  price       DECIMAL(10,2),
  mrp         DECIMAL(10,2),
  stock       INTEGER DEFAULT 0,
  image_url   TEXT,
  is_active   BOOLEAN DEFAULT true
);

-- ── CART ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id  VARCHAR(255),
  coupon_code VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id     UUID REFERENCES cart(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price       DECIMAL(10,2) NOT NULL,
  added_at    TIMESTAMP DEFAULT NOW()
);

-- ── COUPONS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  description     VARCHAR(255),
  type            VARCHAR(20) NOT NULL CHECK (type IN ('percentage','fixed')),
  value           DECIMAL(10,2) NOT NULL,
  min_order       DECIMAL(10,2) DEFAULT 0,
  max_discount    DECIMAL(10,2),
  max_uses        INTEGER,
  used_count      INTEGER DEFAULT 0,
  user_id         UUID REFERENCES users(id),
  expires_at      TIMESTAMP,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number          VARCHAR(50) UNIQUE NOT NULL,
  user_id               UUID REFERENCES users(id) ON DELETE SET NULL,
  email                 VARCHAR(255) NOT NULL,
  phone                 VARCHAR(20),
  status                VARCHAR(50) DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  subtotal              DECIMAL(10,2) NOT NULL,
  shipping_amount       DECIMAL(10,2) DEFAULT 0,
  discount_amount       DECIMAL(10,2) DEFAULT 0,
  total                 DECIMAL(10,2) NOT NULL,
  coupon_code           VARCHAR(50),
  shipping_address      JSONB NOT NULL,
  billing_address       JSONB,
  payment_method        VARCHAR(50),
  payment_status        VARCHAR(50) DEFAULT 'pending'
                          CHECK (payment_status IN ('pending','paid','failed','refunded')),
  razorpay_order_id     VARCHAR(255),
  razorpay_payment_id   VARCHAR(255),
  razorpay_signature    VARCHAR(255),
  tracking_number       VARCHAR(255),
  courier_name          VARCHAR(100),
  estimated_delivery    DATE,
  notes                 TEXT,
  admin_notes           TEXT,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name    VARCHAR(255) NOT NULL,
  product_image   TEXT,
  variant_id      UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_name    VARCHAR(100),
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price      DECIMAL(10,2) NOT NULL,
  total_price     DECIMAL(10,2) NOT NULL
);

-- ── ORDER STATUS HISTORY ───────────────────────────────────
CREATE TABLE IF NOT EXISTS order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  status      VARCHAR(50) NOT NULL,
  note        TEXT,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── REVIEWS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,
  reviewer_name   VARCHAR(200),
  reviewer_email  VARCHAR(255),
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title           VARCHAR(255),
  body            TEXT,
  is_verified     BOOLEAN DEFAULT false,
  is_approved     BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ── NEWSLETTER ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(200),
  subscribed  BOOLEAN DEFAULT true,
  source      VARCHAR(100),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── CONTACT MESSAGES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  subject     VARCHAR(255),
  message     TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── INDEXES ────────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ── UPDATED_AT TRIGGER ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cart_updated_at BEFORE UPDATE ON cart FOR EACH ROW EXECUTE FUNCTION update_updated_at();
