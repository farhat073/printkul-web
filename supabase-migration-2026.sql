-- ============================================
-- PRINTKUL 2026 CATALOG MIGRATION
-- Updates categories & subcategories to match
-- the official 2026 product list
-- Safe to run on existing database
-- ============================================

-- Step 1: Deactivate all existing categories (soft-delete)
UPDATE categories SET is_active = false, updated_at = now();
UPDATE subcategories SET is_active = false, updated_at = now();

-- Step 2: Upsert new categories from 2026 product list
INSERT INTO categories (slug, name, description, sort_order, is_active) VALUES
  ('visiting-cards',        'Visiting Cards',        'Premium business cards in every style and finish',                1,  true),
  ('marketing-materials',   'Marketing Materials',   'Flyers, brochures, booklets, and promotional materials',         2,  true),
  ('medical-stationery',    'Medical Stationery',    'Prescription pads, folders, envelopes for medical professionals', 3,  true),
  ('stamps',                'Stamps',                'Pre-ink stamps, rubber stamps, daters, and batch coders',         4,  true),
  ('stickers-labels',       'Stickers & Labels',     'Custom stickers, product labels, and packaging labels',          5,  true),
  ('signs-banners',         'Signs & Banners',       'Standees, flex banners, sign boards, and display solutions',     6,  true),
  ('bags',                  'Bags',                  'Non-woven bags, jute bags, and premium carry bags',              7,  true),
  ('gifting',               'Gifting',               'Notebooks, mugs, keychains, t-shirts, and personalised gifts',   8,  true),
  ('communication-design',  'Communication Design',  'Print & social media campaigns, annual reports, publications',   9,  true),
  ('startup-kashmir',       'Startup Kashmir Package','Name suggestion, logo design, trademark, packaging design',     10, true),
  ('packaging-solution',    'Packaging Solution',    'Packaging design, barcode printers, sealing machines, jars',     11, true),
  ('wedding-ceremony',      'Wedding Ceremony',      'Wedding cards, nikah nama, welcome boards, and tags',           12, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- Step 3: Upsert subcategories

-- ── Visiting Cards ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('standard-visiting-cards',         'Standard Visiting Cards',         1),
  ('square-visiting-cards',           'Square Visiting Cards',           2),
  ('spot-uv-visiting-cards',          'Spot UV Visiting Cards',          3),
  ('kraft-visiting-cards',            'Kraft Visiting Cards',            4),
  ('nfc-visiting-cards',              'NFC Visiting Cards',              5),
  ('gloss-laminated-visiting-cards',  'Gloss Laminated Visiting Cards',  6),
  ('matt-laminated-visiting-cards',   'Matt Laminated Visiting Cards',   7),
  ('golden-foil-visiting-cards',      'Golden Foil Visiting Cards',      8),
  ('qr-code-visiting-cards',          'QR Code Visiting Cards',          9),
  ('rounded-corner-visiting-cards',   'Rounded Corner Visiting Cards',   10),
  ('transparent-visiting-cards',      'Transparent Visiting Cards',      11),
  ('velvet-touch-visiting-cards',     'Velvet Touch Visiting Cards',     12),
  ('non-tearable-visiting-cards',     'Non-Tearable Visiting Cards',     13),
  ('bulk-visiting-cards',             'Bulk Visiting Cards',             14)
) AS s(slug, name, sort_order)
WHERE c.slug = 'visiting-cards'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Marketing Materials ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('flyers',              'Flyers',              1),
  ('brochures',           'Brochures',           2),
  ('product-catalogue',   'Product Catalogue',   3),
  ('wall-hanging',        'Wall Hanging',        4),
  ('wall-stickers',       'Wall Stickers',       5),
  ('booklets',            'Booklets',            6),
  ('certificates',        'Certificates',        7),
  ('loyalty-cards',       'Loyalty Cards',       8),
  ('thanks-cards',        'Thanks Cards',        9),
  ('custom-bookmarks',    'Custom Bookmarks',    10),
  ('restaurant-menu',     'Restaurant Menu',     11),
  ('garment-tags',        'Garment Tags',        12)
) AS s(slug, name, sort_order)
WHERE c.slug = 'marketing-materials'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Medical Stationery ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('prescription-pads',           'Prescription Pads',           1),
  ('medical-envelopes',           'Envelopes',                   2),
  ('usg-folder',                  'USG Folder',                  3),
  ('dental-clinic-folder',        'Dental Clinic Folder',        4),
  ('doctor-prescription-folder',  'Doctor Prescription Folder',  5),
  ('x-ray-envelopes',             'X-Ray Envelopes',             6),
  ('bill-books',                  'Bill Books',                  7)
) AS s(slug, name, sort_order)
WHERE c.slug = 'medical-stationery'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Stamps ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('rubber-stamp',   'Rubber Stamp',   1),
  ('round-stamp',    'Round Stamp',    2),
  ('pen-stamp',      'Pen Stamp',      3),
  ('pocket-stamp',   'Pocket Stamp',   4),
  ('dater-stamp',    'Dater',          5),
  ('batch-coder',    'Batch Coder',    6)
) AS s(slug, name, sort_order)
WHERE c.slug = 'stamps'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Stickers & Labels ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('custom-stickers',         'Custom Stickers',         1),
  ('cake-labels',             'Cake Labels',             2),
  ('dry-fruit-labels',        'Dry Fruit Labels',        3),
  ('packaging-labels',        'Packaging Labels',        4),
  ('roll-labels',             'Roll Labels',             5),
  ('custom-packaging-boxes',  'Custom Packaging Boxes',  6),
  ('custom-tissue-paper',     'Custom Tissue Paper',     7),
  ('product-labels',          'Product Labels',          8),
  ('transparent-labels',      'Transparent Labels',      9),
  ('qr-code-labels',          'QR Code Labels',          10),
  ('review-stickers',         'Review Stickers',         11),
  ('address-stickers',        'Address Stickers',        12)
) AS s(slug, name, sort_order)
WHERE c.slug = 'stickers-labels'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Signs & Banners ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('standees',                 'Standees',                 1),
  ('flex-banners',             'Flex Banners',             2),
  ('tabletop-signs',           'Tabletop Signs',           3),
  ('led-clip-on-boards',       'LED Clip-on Boards',       4),
  ('vinyl-large-stickers',     'Vinyl Large Stickers',     5),
  ('hanging-display-boards',   'Hanging Display Boards',   6),
  ('name-plate',               'Name Plate',               7),
  ('outdoor-banners',          'Outdoor Banners',          8),
  ('led-sign-boards',          'LED Sign Boards',          9),
  ('acrylic-sign-boards',      'Acrylic Sign Boards',      10),
  ('lollipop-signs',           'Lollipop',                 11)
) AS s(slug, name, sort_order)
WHERE c.slug = 'signs-banners'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Bags ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('non-woven-bags',   'Non-Woven Bags',   1),
  ('jute-bags',        'Jute Bags',        2),
  ('premium-bags',     'Premium Bags',     3)
) AS s(slug, name, sort_order)
WHERE c.slug = 'bags'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Gifting ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('notebooks',           'Notebooks',           1),
  ('diaries',             'Diaries',             2),
  ('photo-frames',        'Photo Frames',        3),
  ('wall-calendars',      'Wall Calendars',      4),
  ('keychains',           'Keychains',           5),
  ('mugs',                'Mugs',                6),
  ('tshirt-printing',     'T-shirt Printing',    7),
  ('cap-printing',        'Cap',                 8),
  ('mousepads',           'Mousepads',           9),
  ('fridge-magnets',      'Fridge Magnets',      10),
  ('canvas-prints',       'Canvas Prints',       11),
  ('drinkware',           'Drinkware',           12),
  ('wall-clocks',         'Wall Clocks',         13),
  ('desk-calendars',      'Desk Calendars',      14),
  ('customised-pen',      'Customised Pen',      15),
  ('flags',               'Flags',               16)
) AS s(slug, name, sort_order)
WHERE c.slug = 'gifting'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Communication Design ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('print-social-campaigns',   'Print & Social Media Campaigns',   1),
  ('design-brochures-flyers',  'Brochures and Flyers',             2),
  ('marketing-collaterals',    'Marketing Collaterals',            3),
  ('annual-reports',           'Annual Reports',                   4),
  ('publications-books',       'Publications and Books',           5),
  ('news-magazines',           'News Magazines',                   6)
) AS s(slug, name, sort_order)
WHERE c.slug = 'communication-design'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Startup Kashmir Package ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('name-suggestion',        'Name Suggestion',        1),
  ('logo-design',            'Logo Design',            2),
  ('trademark-registration', 'Trademark Registration', 3),
  ('packaging-design',       'Packaging Design',       4),
  ('material-availability',  'Material Availability',  5)
) AS s(slug, name, sort_order)
WHERE c.slug = 'startup-kashmir'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Packaging Solution ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('pkg-packaging-design',        'Packaging Design',            1),
  ('bar-code-printer',             'Bar Code Printer',            2),
  ('batch-code-inkjet-printer',    'Batch Code Inkjet Printer',   3),
  ('numex-batch-coder',            'Numex Batch Coder',           4),
  ('induction-sealing-machine',    'Induction Sealing Machine',   5),
  ('jars-and-bottles',             'Jars and Bottles',            6)
) AS s(slug, name, sort_order)
WHERE c.slug = 'packaging-solution'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- ── Wedding Ceremony ──
INSERT INTO subcategories (category_id, slug, name, sort_order, is_active)
SELECT c.id, s.slug, s.name, s.sort_order, true FROM categories c
CROSS JOIN (VALUES
  ('wedding-cards',            'Wedding Cards',            1),
  ('customised-wedding-cards', 'Customised Wedding Cards', 2),
  ('premium-welcome-boards',   'Premium Welcome Boards',   3),
  ('nikah-nama',               'Nikah Nama',               4),
  ('wedding-tags-stickers',    'Tags & Stickers',          5)
) AS s(slug, name, sort_order)
WHERE c.slug = 'wedding-ceremony'
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();
