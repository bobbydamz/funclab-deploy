-- ============================================================
-- BioHAK Wellness — Seed Data
-- ============================================================

-- Admin user (password: Admin@123!)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) VALUES
('admin@biohakwellness.com', '$2b$12$placeholder_hash_replace_on_first_run', 'BioHAK', 'Admin', 'admin', true);

-- ── PRODUCTS ───────────────────────────────────────────────
INSERT INTO products (slug, name, tagline, short_desc, price, mrp, stock, image_url, category, tags, benefits, is_active, is_featured, sort_order) VALUES

('whey-protein', 'Whey Protein', 'For Muscle Growth & Repair', 
 '29–30g of fast-absorbing protein per scoop. No gums, no artificial sweeteners, enhanced with digestive enzymes.',
 2499.00, 2999.00, 100, '/product-whey-protein.png', 'protein',
 ARRAY['protein','muscle','recovery','whey'],
 ARRAY['Builds and repairs muscle', 'Fast absorption', 'Gut-friendly formula', 'No artificial sweeteners'],
 true, true, 1),

('plant-protein', 'Plant Protein', 'Vegan. Clean. Complete.',
 '27–28g of protein from 98% pea protein and 2% rice protein. Complete amino acid profile, fully vegan.',
 2499.00, 2999.00, 80, '/product-plant-protein.png', 'protein',
 ARRAY['protein','vegan','plant','muscle'],
 ARRAY['Complete amino acid profile', 'Vegan & dairy-free', 'High protein per scoop', 'Easy on digestion'],
 true, true, 2),

('algal-omega-3', 'Algal Omega-3', 'with Vitamin E',
 'Plant-sourced DHA and EPA omega-3 from algae. Vegan, sustainable, one capsule a day.',
 999.00, 1299.00, 120, '/product-omega-3-algal.png', 'vitamins',
 ARRAY['omega3','vegan','heart','brain'],
 ARRAY['Heart health', 'Brain function', 'Eye health', 'Fully vegan'],
 true, true, 3),

('daily-multivitamin', 'Daily MultiVitamin', 'With 100% RDA core vitamins + Zinc, Copper & Selenium',
 '60 tablets covering all your daily vitamin needs. 100% RDA for core vitamins plus essential minerals.',
 799.00, 999.00, 150, '/product-multivitamins.png', 'vitamins',
 ARRAY['multivitamin','daily','immunity','zinc'],
 ARRAY['100% RDA core vitamins', 'Boosts immunity', 'Covers nutritional gaps', 'For men and women'],
 true, true, 4),

('vitamin-d3-k2', 'Vitamin D3 + K2 (MK-7)', 'for Bone health & Heart health',
 '2000 IU Vitamin D3 with 100mcg K2 (MK-7). Supports bone density, immunity, and cardiovascular health.',
 849.00, 1099.00, 130, '/product-vitamin-d3-k2.png', 'vitamins',
 ARRAY['vitamind3','k2','bone','heart'],
 ARRAY['Strengthens bones', 'Supports heart health', 'Boosts immunity', 'Most bioavailable form'],
 true, false, 5),

('vitamin-b-complex', 'Vitamin B-Complex', 'Complete B Vitamin Formula',
 'Full spectrum B1–B12 in one tablet. Supports energy, nervous system, and red blood cell formation. 120 tablets.',
 699.00, 899.00, 160, '/product-b-complex.png', 'vitamins',
 ARRAY['bcomplex','energy','nervous','vitamins'],
 ARRAY['Boosts energy metabolism', 'Nervous system support', 'Reduces fatigue', '4-month supply'],
 true, false, 6),

('biotin-5000', 'Biotin 5,000 mcg', 'Hair, Skin and Nail Support',
 'High-potency 5,000 mcg biotin per capsule. Clinically effective dose for visible hair and nail results.',
 749.00, 999.00, 140, '/product-biotin.png', 'vitamins',
 ARRAY['biotin','hair','skin','nails'],
 ARRAY['Stronger hair growth', 'Healthier nails', 'Radiant skin', 'Clinically effective dose'],
 true, false, 7),

('iron-vitamin-c', 'Iron + Vitamin C', '+100 mg for Improved Absorption',
 'Iron with 100mg Vitamin C for dramatically improved absorption. Addresses one of India''s most prevalent deficiencies.',
 699.00, 899.00, 110, '/product-iron-vitamin-c.png', 'vitamins',
 ARRAY['iron','vitaminc','deficiency','women'],
 ARRAY['Treats iron deficiency', '100mg Vitamin C for absorption', 'Ideal for women', 'Reduces fatigue'],
 true, false, 8),

('moringa-mushroom', 'Lions Mane Moringa + Mushroom', 'for Vitality and Longevity',
 'Lion''s Mane mushroom and Moringa blend for cognitive support, vitality, and longevity. Rich in adaptogens.',
 1099.00, 1399.00, 90, '/product-moringa-mushroom.png', 'supplements',
 ARRAY['mushroom','moringa','brain','adaptogen'],
 ARRAY['Cognitive support', 'Sustained energy', 'Rich in antioxidants', 'Adaptogenic formula'],
 true, false, 9);

-- ── COUPONS ────────────────────────────────────────────────
INSERT INTO coupons (code, description, type, value, min_order, max_uses, is_active) VALUES
('WELCOME10', '10% off your first order', 'percentage', 10.00, 500.00, 1000, true),
('BIOHAK20', '20% off orders above ₹2000', 'percentage', 20.00, 2000.00, 500, true),
('FLAT200', 'Flat ₹200 off on orders above ₹1500', 'fixed', 200.00, 1500.00, 200, true);

-- ── SAMPLE REVIEWS ─────────────────────────────────────────
INSERT INTO reviews (product_id, reviewer_name, reviewer_email, rating, title, body, is_verified, is_approved)
SELECT 
  p.id,
  r.name,
  r.email,
  r.rating,
  r.title,
  r.body,
  true,
  true
FROM products p
CROSS JOIN (VALUES
  ('Priya M.', 'priya@example.com', 5, 'Game changer!', 'Been using this for 3 months and the difference is incredible. No bloating, mixes well, and tastes great.'),
  ('Rahul S.', 'rahul@example.com', 5, 'Finally a clean protein', 'Love that there are no artificial sweeteners. My digestion has improved so much.'),
  ('Ananya K.', 'ananya@example.com', 4, 'Great quality', 'Really good product. Slightly expensive but worth it for the clean ingredients.')
) AS r(name, email, rating, title, body)
WHERE p.slug = 'whey-protein';
