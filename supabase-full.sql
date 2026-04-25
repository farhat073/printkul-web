-- ============================================
-- PRINTKUL FULL DATABASE SETUP
-- Fully self-contained & idempotent
-- Safe to re-run as many times as needed
-- No reset script required
-- ============================================

create extension if not exists "uuid-ossp";

-- ============================================
-- DROP RLS POLICIES (so CREATE won't fail)
-- ============================================

drop policy if exists "public can read active categories"       on categories;
drop policy if exists "admin can do everything on categories"   on categories;
drop policy if exists "public can read active subcategories"    on subcategories;
drop policy if exists "admin can do everything on subcategories" on subcategories;
drop policy if exists "public can read active products"         on products;
drop policy if exists "admin can do everything on products"     on products;
drop policy if exists "public can read active variants"         on product_variants;
drop policy if exists "admin can do everything on variants"     on product_variants;
drop policy if exists "users can view own profile"              on profiles;
drop policy if exists "users can update own profile"            on profiles;
drop policy if exists "admin can view all profiles"             on profiles;
drop policy if exists "admin can update all profiles"           on profiles;
drop policy if exists "public can read site_content"            on site_content;
drop policy if exists "admin can do everything on site_content" on site_content;
drop policy if exists "public can read active banners"          on banners;
drop policy if exists "admin can do everything on banners"      on banners;
drop policy if exists "public can read active deals"            on deals;
drop policy if exists "admin can do everything on deals"        on deals;
drop policy if exists "public can read active faqs"             on faqs;
drop policy if exists "admin can do everything on faqs"         on faqs;
drop policy if exists "users can insert own enquiry"            on enquiries;
drop policy if exists "users can view own enquiries"            on enquiries;
drop policy if exists "admin can view all enquiries"            on enquiries;
drop policy if exists "public can read product images"          on storage.objects;
drop policy if exists "public can read category banners"        on storage.objects;
drop policy if exists "public can read site assets"             on storage.objects;
drop policy if exists "admin can upload to admin-uploads"       on storage.objects;

-- ============================================
-- DROP TRIGGER & FUNCTION
-- ============================================

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.is_admin();

-- ============================================
-- TABLES
-- ============================================

create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  banner_url  text,
  icon_url    text,
  sort_order  int default 0,
  is_active   boolean default true,
  seo_title   text,
  seo_desc    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists subcategories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  slug        text unique not null,
  name        text not null,
  description text,
  banner_url  text,
  sort_order  int default 0,
  is_active   boolean default true,
  seo_title   text,
  seo_desc    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  subcategory_id uuid references subcategories(id) on delete cascade,
  slug           text unique not null,
  name           text not null,
  description    text,
  short_desc     text,
  base_price     numeric(10,2) not null,
  price_note     text,
  images         text[],
  thumbnail_url  text,
  specifications jsonb,
  is_active      boolean default true,
  is_featured    boolean default false,
  sort_order     int default 0,
  seo_title      text,
  seo_desc       text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table if not exists product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  name       text not null,
  finish     text,
  size       text,
  quantity   int,
  price      numeric(10,2) not null,
  is_active  boolean default true,
  sort_order int default 0
);

create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  role       text default 'customer',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists site_content (
  key        text primary key,
  value      text,
  value_type text default 'text',
  label      text,
  section    text,
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists banners (
  id         uuid primary key default gen_random_uuid(),
  title      text,
  subtitle   text,
  image_url  text not null,
  cta_text   text,
  cta_url    text,
  position   text default 'home_hero',
  sort_order int default 0,
  is_active  boolean default true,
  starts_at  timestamptz,
  ends_at    timestamptz
);

create table if not exists deals (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  badge_text  text,
  product_id  uuid references products(id),
  image_url   text,
  is_active   boolean default true,
  starts_at   timestamptz,
  ends_at     timestamptz,
  sort_order  int default 0
);

create table if not exists faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  category   text default 'general',
  sort_order int default 0,
  is_active  boolean default true
);

create table if not exists enquiries (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id),
  product_id     uuid references products(id),
  variant_id     uuid references product_variants(id),
  quantity       int,
  customer_name  text,
  customer_phone text,
  message        text,
  status         text default 'initiated',
  created_at     timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY & FUNCTIONS
-- ============================================

create or replace function public.is_admin()
returns boolean as $$
declare
  _role text;
begin
  select role into _role from public.profiles where id = auth.uid();
  return coalesce(_role = 'admin', false);
end;
$$ language plpgsql security definer set search_path = public;

alter table categories       enable row level security;
alter table subcategories    enable row level security;
alter table products         enable row level security;
alter table product_variants enable row level security;
alter table profiles         enable row level security;
alter table site_content     enable row level security;
alter table banners          enable row level security;
alter table deals            enable row level security;
alter table faqs             enable row level security;
alter table enquiries        enable row level security;

-- Categories
create policy "public can read active categories" on categories for select using (is_active = true);
create policy "admin can do everything on categories" on categories for all using (public.is_admin());

-- Subcategories
create policy "public can read active subcategories" on subcategories for select using (is_active = true);
create policy "admin can do everything on subcategories" on subcategories for all using (public.is_admin());

-- Products
create policy "public can read active products" on products for select using (is_active = true);
create policy "admin can do everything on products" on products for all using (public.is_admin());

-- Product Variants
create policy "public can read active variants" on product_variants for select using (is_active = true);
create policy "admin can do everything on variants" on product_variants for all using (public.is_admin());

-- Profiles
create policy "users can view own profile"    on profiles for select using (id = auth.uid());
create policy "users can update own profile"  on profiles for update using (id = auth.uid());
create policy "admin can view all profiles"   on profiles for select using (public.is_admin());
create policy "admin can update all profiles" on profiles for update using (public.is_admin());

-- Site Content
create policy "public can read site_content" on site_content for select using (true);
create policy "admin can do everything on site_content" on site_content for all using (public.is_admin());

-- Banners
create policy "public can read active banners" on banners for select using (is_active = true);
create policy "admin can do everything on banners" on banners for all using (public.is_admin());

-- Deals
create policy "public can read active deals" on deals for select using (is_active = true);
create policy "admin can do everything on deals" on deals for all using (public.is_admin());

-- FAQs
create policy "public can read active faqs" on faqs for select using (is_active = true);
create policy "admin can do everything on faqs" on faqs for all using (public.is_admin());

-- Enquiries
create policy "users can insert own enquiry" on enquiries for insert with check (user_id = auth.uid() or user_id is null);
create policy "users can view own enquiries" on enquiries for select using (user_id = auth.uid());
create policy "admin can view all enquiries" on enquiries for all using (public.is_admin());

-- ============================================
-- TRIGGER: auto-create profile on signup
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- STORAGE BUCKETS
-- ============================================

insert into storage.buckets (id, name, public) values ('product-images',   'product-images',   true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('category-banners', 'category-banners', true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-assets',      'site-assets',      true)  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('admin-uploads',    'admin-uploads',    false) on conflict (id) do nothing;

-- Narrow storage policies: allow fetching objects but NOT listing bucket contents
create policy "public can read product images"
  on storage.objects for select
  using (bucket_id = 'product-images' and auth.role() = 'anon');

create policy "public can read category banners"
  on storage.objects for select
  using (bucket_id = 'category-banners' and auth.role() = 'anon');

create policy "public can read site assets"
  on storage.objects for select
  using (bucket_id = 'site-assets' and auth.role() = 'anon');

create policy "admin can upload to admin-uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'admin-uploads' and
    public.is_admin()
  );

-- ============================================
-- SEED: CATEGORIES
-- ============================================

insert into categories (slug, name, description, banner_url, sort_order, is_active) values
  ('visiting-cards',       'Visiting Cards',         'Premium visiting cards for every business',           'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', 1,  true),
  ('marketing-materials',  'Marketing Materials',    'Flyers, brochures, booklets, and postcards',          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', 2,  true),
  ('stationery',           'Stationery',             'Letterheads, notebooks, and office stationery',       'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80', 3,  true),
  ('labels-stickers',      'Labels & Stickers',      'Custom stickers, product labels, and packaging',      'https://images.unsplash.com/photo-1618786053697-21c4f5d8b63e?w=800&q=80', 4,  true),
  ('signs-banners',        'Signs & Banners',        'Standees, vinyl banners, and outdoor signs',          'https://images.unsplash.com/photo-1864587248277-de9dc87c4b9b?w=800&q=80', 5,  true),
  ('stamps-ink',           'Stamps & Ink',           'Rubber stamps, self-inking stamps, and ink pads',     'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=800&q=80', 6,  true),
  ('bags-caps',            'Bags & Caps',            'Custom tote bags, laptop bags, and caps',             'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80', 7,  true),
  ('gifts-photo-products', 'Gifts & Photo Products', 'Mugs, photo albums, and personalised gifts',          'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80', 8,  true),
  ('personalised-pens',    'Pens',                   'Value, executive, and branded custom pens',           'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=800&q=80', 9,  true),
  ('office-supplies',      'Office Supplies',        'ID cards, lanyards, name badges, and whiteboards',    'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80', 10, true),
  ('design-services',      'Design Services',        'Online design studio, logo maker, and pro designers', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', 11, true)
on conflict (slug) do nothing;

-- ============================================
-- SEED: SUBCATEGORIES
-- ============================================

-- Visiting Cards
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('standard',       'Standard Visiting Cards',       1),
  ('classic',        'Classic Visiting Cards',        2),
  ('rounded-corner', 'Rounded Corner Visiting Cards', 3),
  ('square',         'Square Visiting Cards',         4),
  ('circle',         'Circle Visiting Cards',         5),
  ('oval',           'Oval Visiting Cards',           6),
  ('leaf',           'Leaf Visiting Cards',           7),
  ('glossy',         'Glossy Visiting Cards',         8),
  ('matte',          'Matte Visiting Cards',          9),
  ('spot-uv',        'Spot UV Visiting Cards',        10),
  ('raised-foil',    'Raised Foil Visiting Cards',    11),
  ('transparent',    'Transparent Visiting Cards',    12),
  ('magnetic',       'Magnetic Visiting Cards',       13),
  ('pearl',          'Pearl Visiting Cards',          14),
  ('velvet-touch',   'Velvet Touch Visiting Cards',   15),
  ('kraft',          'Kraft Visiting Cards',          16),
  ('premium-plus',   'Premium Plus Visiting Cards',   17),
  ('non-tearable',   'Non-Tearable Visiting Cards',   18),
  ('nfc',            'NFC Visiting Cards',            19),
  ('qr-code-vc',     'QR Code Visiting Cards',        20),
  ('bulk-vc',        'Bulk Visiting Cards',           21),
  ('reorder-vc',     'Reorder Visiting Cards',        22)
) as s(slug, name, sort_order)
where c.slug = 'visiting-cards'
on conflict (slug) do nothing;

-- Marketing Materials
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('flyers',                 'Flyers',                         1),
  ('brochures',              'Brochures',                      2),
  ('booklets',               'Booklets',                       3),
  ('postcards',              'Postcards',                      4),
  ('rack-cards',             'Rack Cards',                     5),
  ('door-hangers',           'Door Hangers',                   6),
  ('menus',                  'Menus',                          7),
  ('custom-tickets',         'Custom Tickets',                 8),
  ('folders',                'Folders / Presentation Folders', 9),
  ('gift-certificates',      'Gift Certificates',              10),
  ('loyalty-cards',          'Loyalty Cards',                  11),
  ('appointment-cards',      'Appointment Cards',              12),
  ('packaging-insert-cards', 'Packaging Insert Cards',         13)
) as s(slug, name, sort_order)
where c.slug = 'marketing-materials'
on conflict (slug) do nothing;

-- Stationery
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('letterheads',          'Letterheads',                  1),
  ('envelopes',            'Envelopes',                    2),
  ('notepads',             'Notepads',                     3),
  ('notebooks',            'Notebooks & Diaries',          4),
  ('sticky-notes',         'Sticky Notes',                 5),
  ('business-invitations', 'Business Invitations',         6),
  ('greeting-cards',       'Greeting Cards',               7),
  ('notecards',            'Notecards',                    8),
  ('bookmarks',            'Custom Bookmarks',             9),
  ('passport-photos',      'Passport Size Photographs',    10),
  ('custom-checks',        'Custom Checks',                11),
  ('shipping-mailers',     'Shipping Mailers & Envelopes', 12)
) as s(slug, name, sort_order)
where c.slug = 'stationery'
on conflict (slug) do nothing;

-- Labels & Stickers
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('custom-stickers',       'Custom Stickers',        1),
  ('mailing-labels',        'Mailing Labels',         2),
  ('product-labels',        'Product Labels',         3),
  ('packaging-labels',      'Packaging Labels',       4),
  ('return-address-labels', 'Return Address Labels',  5),
  ('transparent-labels',    'Transparent Labels',     6),
  ('roll-labels',           'Roll Labels',            7),
  ('sheet-labels',          'Sheet Labels',           8),
  ('qr-code-labels',        'QR Code Labels',         9),
  ('packaging-boxes',       'Custom Packaging Boxes', 10),
  ('tissue-paper',          'Custom Tissue Paper',    11),
  ('poly-mailers',          'Poly Mailers',           12)
) as s(slug, name, sort_order)
where c.slug = 'labels-stickers'
on conflict (slug) do nothing;

-- Signs & Banners
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('roll-up-banners',    'Roll-Up Banners / Standees', 1),
  ('vinyl-banners',      'Vinyl Banners',              2),
  ('fabric-banners',     'Fabric Banners',             3),
  ('retractable-banners','Retractable Banners',        4),
  ('outdoor-banners',    'Outdoor Banners',            5),
  ('board-signs',        'Board Signs',                6),
  ('magnetic-signs',     'Magnetic Signs',             7),
  ('metal-signs',        'Metal Signs',                8),
  ('plastic-signs',      'Plastic Signs',              9),
  ('tabletop-signs',     'Tabletop Signs / Displays',  10),
  ('led-translite',      'LED Translite Sign Boards',  11),
  ('foam-board',         'Foam Board Signs',           12),
  ('yard-signs',         'Yard Signs',                 13),
  ('pull-up-banners',    'Pull-Up Banners',            14),
  ('window-clings',      'Window Clings',              15)
) as s(slug, name, sort_order)
where c.slug = 'signs-banners'
on conflict (slug) do nothing;

-- Stamps & Ink
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('basic-rubber-stamps',  'Basic Rubber Stamps',  1),
  ('self-inking-stamps',   'Self-Inking Stamps',   2),
  ('pre-inked-stamps',     'Pre-Inked Stamps',     3),
  ('address-stamps',       'Address Stamps',       4),
  ('date-stamps',          'Date Stamps',          5),
  ('custom-logo-stamps',   'Custom Logo Stamps',   6),
  ('replacement-ink-pads', 'Replacement Ink Pads', 7)
) as s(slug, name, sort_order)
where c.slug = 'stamps-ink'
on conflict (slug) do nothing;

-- Bags & Caps
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('laptop-bags',    'Laptop Bags',        1),
  ('duffel-bags',    'Duffel Bags',        2),
  ('tote-bags',      'Tote Bags',          3),
  ('drawstring-bags','Drawstring Bags',    4),
  ('jute-bags',      'Jute Bags',          5),
  ('non-woven-bags', 'Non-Woven Bags',     6),
  ('custom-caps',    'Custom Caps / Hats', 7)
) as s(slug, name, sort_order)
where c.slug = 'bags-caps'
on conflict (slug) do nothing;

-- Gifts & Photo Products
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('mugs',            'Mugs',               1),
  ('photo-albums',    'Photo Albums',       2),
  ('canvas-prints',   'Canvas Prints',      3),
  ('photo-frames',    'Photo Frames',       4),
  ('photo-magnets',   'Photo Magnets',      5),
  ('drinkware',       'Drinkware',          6),
  ('gift-hampers',    'Gift Hampers',       7),
  ('keychains',       'Keychains',          8),
  ('phone-cases',     'Phone Cases',        9),
  ('cushions',        'Cushions / Pillows', 10),
  ('mousepads-gifts', 'Mousepads',          11),
  ('desk-calendars',  'Desk Calendars',     12),
  ('wall-calendars',  'Wall Calendars',     13),
  ('fridge-magnets',  'Fridge Magnets',     14)
) as s(slug, name, sort_order)
where c.slug = 'gifts-photo-products'
on conflict (slug) do nothing;

-- Pens
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('value-pens',     'Value Pens',           1),
  ('executive-pens', 'Executive Pens',       2),
  ('premium-pens',   'Premium Pens',         3),
  ('luxury-pens',    'Luxury Pens',          4),
  ('parker-pens',    'Parker Pens',          5),
  ('submarine-pens', 'Submarine Pens',       6),
  ('stylus-pens',    'Stylus Pens',          7),
  ('multipack-pens', 'Multi-pack/Bulk Pens', 8)
) as s(slug, name, sort_order)
where c.slug = 'personalised-pens'
on conflict (slug) do nothing;

-- Office Supplies
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('mousepads-office', 'Mousepads',                      1),
  ('id-cards',         'ID Cards',                       2),
  ('lanyards',         'Lanyards',                       3),
  ('name-badges',      'Name Badges',                    4),
  ('desk-nameplates',  'Desk Nameplates',                5),
  ('whiteboards',      'Whiteboards / Dry-Erase Boards', 6)
) as s(slug, name, sort_order)
where c.slug = 'office-supplies'
on conflict (slug) do nothing;

-- Design Services
insert into subcategories (category_id, slug, name, sort_order, is_active)
select c.id, s.slug, s.name, s.sort_order, true from categories c
cross join (values
  ('online-studio', 'Online Design Studio',         1),
  ('logo-maker',    'Logo Maker',                   2),
  ('qr-generator',  'QR Code Generator',            3),
  ('upload-design', 'Upload Your Own Design',       4),
  ('pro-services',  'Professional Design Services', 5)
) as s(slug, name, sort_order)
where c.slug = 'design-services'
on conflict (slug) do nothing;

-- ============================================
-- SEED: PRODUCTS
-- ============================================

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'standard-matte-visiting-cards', 'Standard Matte Visiting Cards',
  'Classic matte finish perfect for everyday business use',
  'Premium quality matte finish visiting cards. Made from 350gsm art paper with a soft-touch matte coating. Perfect for everyday business use.',
  350, 'per 100 pcs', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', true, true, 1
from subcategories s where s.slug = 'standard'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'premium-flyers', 'Premium Flyers',
  'High-quality flyers for your marketing campaigns',
  'Promote your business with our vibrant, full-color flyers printed on 130gsm gloss art paper.',
  1500, 'per 1000 pcs', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80', true, true, 2
from subcategories s where s.slug = 'flyers'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'custom-coffee-mugs', 'Custom Coffee Mugs',
  'Personalised photo mugs for gifting or corporate use',
  'High-quality ceramic mugs with vibrant full-color wraparound printing. Perfect for corporate gifting.',
  250, 'per piece', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80', true, true, 3
from subcategories s where s.slug = 'mugs'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'custom-stickers-product', 'Custom Stickers',
  'Die-cut or kiss-cut stickers for your packaging',
  'Durable, waterproof custom stickers available in any shape. Ideal for product packaging and branding.',
  300, 'per 100 pcs', 'https://images.unsplash.com/photo-1618786053697-21c4f5d8b63e?w=600&q=80', true, true, 4
from subcategories s where s.slug = 'custom-stickers'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'corporate-notebooks', 'Corporate Notebooks',
  'Branded notebooks with your company logo',
  'Premium quality notebooks with custom cover printing. Available in A5 and A4 sizes.',
  150, 'per piece', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&q=80', true, true, 5
from subcategories s where s.slug = 'notebooks'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'acrylic-standees', 'Acrylic Standees',
  'Clear acrylic standees for tabletops and counters',
  'Premium clear acrylic tabletop standees. Perfect for QR code displays, menus, or promotional counters.',
  450, 'per piece', 'https://images.unsplash.com/photo-1864587248277-de9dc87c4b9b?w=600&q=80', true, true, 6
from subcategories s where s.slug = 'tabletop-signs'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'executive-metal-pens', 'Executive Metal Pens',
  'Engraved metal pens for gifting and corporate use',
  'Smooth writing executive metal pens with laser engraving option. Elegant packaging included.',
  120, 'per piece', 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80', true, true, 7
from subcategories s where s.slug = 'executive-pens'
on conflict (slug) do nothing;

insert into products (subcategory_id, slug, name, short_desc, description, base_price, price_note, thumbnail_url, is_active, is_featured, sort_order)
select s.id, 'custom-tote-bags', 'Custom Tote Bags',
  'Eco-friendly canvas tote bags with your branding',
  'Reusable natural canvas tote bags with custom screen or digital printing. Great for retail and events.',
  180, 'per piece', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80', true, true, 8
from subcategories s where s.slug = 'tote-bags'
on conflict (slug) do nothing;

-- ============================================
-- SEED: BANNERS
-- ============================================

insert into banners (title, subtitle, image_url, cta_text, cta_url, position, sort_order, is_active, starts_at, ends_at) values
  ('Your Brand, Perfectly Printed',
   '2000+ products. 2 lakh+ designs. Delivered to your door.',
   'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1600&q=80',
   'Browse Products', '/products', 'home_hero', 1, true, '2026-01-01', '2026-12-31')
on conflict do nothing;

-- ============================================
-- SEED: SITE CONTENT
-- ============================================

insert into site_content (key, value, value_type, label, section) values
  ('whatsapp_number',       '919876543210',                                                                    'text', 'WhatsApp Number',        'contact'),
  ('contact_phone',         '+91 XXXXX XXXXX',                                                                 'text', 'Phone Number',           'contact'),
  ('contact_email',         'hello@printkul.in',                                                               'text', 'Email',                  'contact'),
  ('contact_address',       'Your address here',                                                               'text', 'Address',                'contact'),
  ('home_hero_title',       'Print Products for Every Business',                                               'text', 'Hero Title',             'home'),
  ('home_hero_subtitle',    'Order via WhatsApp — fast, simple, no hassle',                                    'text', 'Hero Subtitle',          'home'),
  ('home_featured_heading', 'Our Most Popular Products',                                                       'text', 'Featured Heading',       'home'),
  ('home_trust_title',      'Why Choose Printkul?',                                                            'text', 'Trust Section Title',    'home'),
  ('home_trust_subtitle',   'Trusted by 10,000+ businesses across India',                                     'text', 'Trust Section Subtitle', 'home'),
  ('footer_tagline',        'Quality print products. One WhatsApp away.',                                     'text', 'Footer Tagline',         'footer'),
  ('footer_about_blurb',    'Printkul is your trusted partner for custom print products in India.',            'text', 'About Blurb',            'footer'),
  ('about_hero_title',      'About Printkul',                                                                  'text', 'Hero Title',             'about'),
  ('about_body',            '<p>Printkul is your trusted partner for custom print products in India. We specialize in visiting cards, marketing materials, stationery, and more.</p>', 'html', 'Body Content', 'about'),
  ('delivery_info',         '7–14 business days, pan-India delivery',                                         'text', 'Delivery Info',          'delivery'),
  ('gst_note',              'Prices shown are indicative and exclude GST. Final price confirmed on WhatsApp.', 'text', 'GST Note',               'delivery')
on conflict (key) do nothing;

-- ============================================
-- MAKE YOURSELF ADMIN
-- After registering at /register, run:
-- update profiles set role = 'admin' where id = 'YOUR_USER_UUID';
-- ============================================