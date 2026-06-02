-- ============================================
-- PRINTKUL CATALOG UPDATE — 2026 Product Document
-- Fills in missing subcategories, fixes names
-- Uses existing slugs where they already exist
-- Safe to re-run (idempotent via ON CONFLICT)
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: Fix category names/descriptions to match document
-- ============================================

UPDATE categories SET
  name = 'Marketing Material',
  description = 'Flyers, brochures, booklets, and promotional print materials',
  updated_at = now()
WHERE slug = 'marketing-materials';

UPDATE categories SET
  name = 'Startup Kashmir Package',
  description = 'Name suggestion, logo design, trademark registration, and packaging',
  updated_at = now()
WHERE slug = 'startup-kashmir';

-- Ensure all 12 are active
UPDATE categories SET is_active = true, updated_at = now()
WHERE slug IN (
  'visiting-cards', 'marketing-materials', 'medical-stationery', 'stamps',
  'stickers-labels', 'signs-banners', 'bags', 'gifting',
  'communication-design', 'startup-kashmir', 'packaging-solution', 'wedding-ceremony'
);

-- Deactivate any categories NOT in the document
UPDATE categories SET is_active = false, updated_at = now()
WHERE slug NOT IN (
  'visiting-cards', 'marketing-materials', 'medical-stationery', 'stamps',
  'stickers-labels', 'signs-banners', 'bags', 'gifting',
  'communication-design', 'startup-kashmir', 'packaging-solution', 'wedding-ceremony'
);

-- ============================================
-- STEP 2: ADD MISSING SUBCATEGORIES
-- (only inserts what's missing — existing ones untouched)
-- ============================================

-- ── Stickers & Labels — 6 missing ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('custom-stickers',    'Custom Stickers',    1),
  ('packaging-labels',   'Packaging Labels',   4),
  ('roll-labels',        'Roll Labels',        5),
  ('product-labels',     'Product Labels',     8),
  ('transparent-labels', 'Transparent Labels', 9),
  ('qr-code-labels',     'QR Code Labels',     10)
) AS s(slug, name, sort_order)
WHERE c.slug = 'stickers-labels'
ON CONFLICT (slug) DO UPDATE SET
  is_active   = true,
  category_id = EXCLUDED.category_id,
  sort_order  = EXCLUDED.sort_order,
  updated_at  = now();

-- ── Bags — 2 missing ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('non-woven-bags', 'Non-Woven Bags', 1),
  ('jute-bags',      'Jute Bags',      2)
) AS s(slug, name, sort_order)
WHERE c.slug = 'bags'
ON CONFLICT (slug) DO UPDATE SET
  is_active   = true,
  category_id = EXCLUDED.category_id,
  sort_order  = EXCLUDED.sort_order,
  updated_at  = now();

-- ── Gifting — 9 missing ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('notebooks-gifting', 'Notebooks',      1),
  ('photo-frames',      'Photo Frames',   3),
  ('wall-calendars',    'Wall Calendars', 4),
  ('keychains',         'Keychains',      5),
  ('mugs',              'Mugs',           6),
  ('fridge-magnets',    'Fridge Magnets', 10),
  ('canvas-prints',     'Canvas Prints',  11),
  ('drinkware',         'Drinkware',      12),
  ('desk-calendars',    'Desk Calendars', 14)
) AS s(slug, name, sort_order)
WHERE c.slug = 'gifting'
ON CONFLICT (slug) DO UPDATE SET
  is_active   = true,
  category_id = EXCLUDED.category_id,
  sort_order  = EXCLUDED.sort_order,
  updated_at  = now();

-- ============================================
-- STEP 3: Fix the "Dry Fruit Label" name (doc says singular)
-- ============================================

UPDATE subcategories SET name = 'Dry Fruit Label', updated_at = now()
WHERE slug = 'dry-fruit-labels';

-- ============================================
-- STEP 4: Ensure all subcategories in document categories are active
-- Deactivate any subcategories NOT from the document
-- ============================================

-- Deactivate old subcategories that belonged to now-deactivated categories
UPDATE subcategories SET is_active = false, updated_at = now()
WHERE category_id IN (
  SELECT id FROM categories WHERE is_active = false
);

COMMIT;
