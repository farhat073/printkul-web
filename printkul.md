markdown

# Printkul — Full Site Planner
**Version 1.0 · April 2026**

> Printkul is a custom print e-commerce platform in the mould of VistaPrint India, stripped down to its commercial core: browse → configure → order via WhatsApp. No design studio. No custom artwork uploads. No payment gateway. Orders are initiated through a WhatsApp redirect with a pre-filled message. Content is managed by an admin panel that writes directly to Supabase — no separate backend process required.

---

## Table of Contents

1. [Product Definition](#1-product-definition)
2. [Architecture Overview](#2-architecture-overview)
3. [Supabase Schema](#3-supabase-schema)
4. [Information Architecture & Site Map](#4-information-architecture--site-map)
5. [Page Inventory](#5-page-inventory)
6. [User Flows](#6-user-flows)
7. [WhatsApp Order Flow](#7-whatsapp-order-flow)
8. [Product & Catalogue System](#8-product--catalogue-system)
9. [UI Component System](#9-ui-component-system)
10. [Admin Panel Specification](#10-admin-panel-specification)
11. [Auth System (Supabase)](#11-auth-system-supabase)
12. [SEO & Content Strategy](#12-seo--content-strategy)
13. [Operational Constraints & Policies](#13-operational-constraints--policies)
14. [Build Checklist](#14-build-checklist)
15. [Appendix](#15-appendix)

---

## 1. Product Definition

### 1.1 What Printkul Is

| Dimension | Detail |
|---|---|
| Type | Print product e-commerce catalogue + WhatsApp order gateway |
| Design tool | **None** — customers browse fixed templates/product images only |
| Custom orders | **None** — pre-defined product variants only |
| Payment | **None on-site** — order intent sent to WhatsApp; payment handled offline |
| Auth | Supabase Auth (email/password + optional Google OAuth) |
| Database | Supabase PostgreSQL |
| Admin panel | React-based frontend admin; reads/writes directly to Supabase via RLS-protected client |
| Backend process | **None** — no Express/Go/etc. server; all logic is client-side + Supabase |
| Hosting | Static/SSR frontend (Vercel / Netlify / Oracle Cloud) |

### 1.2 What Printkul Is NOT

- Not a design studio (no canvas editor, no template customisation tool)
- Not a payment processor (no Razorpay, no COD, no card gateway)
- Not a custom print shop (no artwork uploads, no bespoke orders)
- Not a fulfilment platform (delivery handled entirely offline / manually)

### 1.3 Core Value Proposition

> Browse print products with clear specs and pricing. Pick your variant and quantity. One tap sends your full order to WhatsApp where the team closes it.

---

## 2. Architecture Overview

### 2.1 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  Customer    │    │  Admin Panel │    │  Auth Pages   │  │
│  │  Site (SSG/  │    │  /admin/*    │    │  /login       │  │
│  │  SSR React)  │    │  (React SPA) │    │  /register    │  │
│  └──────┬───────┘    └──────┬───────┘    └───────┬───────┘  │
│         │                   │                    │           │
└─────────┼───────────────────┼────────────────────┼───────────┘
          │                   │                    │
          ▼                   ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE                               │
│                                                             │
│   Auth  │  PostgreSQL DB  │  Storage (product images)       │
│         │                 │                                 │
│   RLS policies separate customer vs admin access            │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
   WhatsApp Web API (wa.me deep link — no API key needed)
```

### 2.2 Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js (App Router) | SSG for product/category pages (SEO); client-side for admin |
| Styling | Tailwind CSS | Utility-first; custom design tokens for Printkul brand |
| Component library | shadcn/ui | Headless, accessible, Tailwind-native |
| Database | Supabase PostgreSQL | Managed; free tier sufficient to start |
| Auth | Supabase Auth | Email/password + Google OAuth |
| File storage | Supabase Storage | Product images, category banners, admin uploads |
| Admin state | React Query + Supabase JS client | Direct DB read/write from browser with RLS |
| Deployment | Vercel (recommended) or any static host | Next.js optimised; ISR for catalogue pages |
| WhatsApp link | `wa.me` deep link | No API key; pre-filled message built client-side |
| Analytics | Plausible or Umami (self-hosted) | Privacy-first; no Google dependency required |

### 2.3 No Backend Process — Invariant

There is **no** Express / Go / FastAPI / Lambda server. All data operations go directly through the Supabase JS client (`@supabase/supabase-js`). Row Level Security (RLS) on Supabase enforces what customers vs. admins can read and write.

**Admin writes** are protected by Supabase RLS policies that check `auth.role() = 'admin'` (implemented via a `profiles.role` column checked in policy).

---

## 3. Supabase Schema

### 3.1 Tables

#### `categories`
```sql
create table categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,           -- e.g. "visiting-cards"
  name        text not null,                  -- e.g. "Visiting Cards"
  description text,
  banner_url  text,                           -- Supabase Storage URL
  icon_url    text,
  sort_order  int default 0,
  is_active   boolean default true,
  seo_title   text,
  seo_desc    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
```

#### `subcategories`
```sql
create table subcategories (
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
```

#### `products`
```sql
create table products (
  id              uuid primary key default gen_random_uuid(),
  subcategory_id  uuid references subcategories(id) on delete cascade,
  slug            text unique not null,
  name            text not null,
  description     text,
  short_desc      text,                        -- shown on product card
  base_price      numeric(10,2) not null,      -- starting price (₹)
  price_note      text,                        -- e.g. "per 100 pcs"
  images          text[],                      -- array of Supabase Storage URLs
  thumbnail_url   text,                        -- primary card image
  specifications  jsonb,                       -- key-value pairs: paper, finish, size etc.
  is_active       boolean default true,
  is_featured     boolean default false,
  sort_order      int default 0,
  seo_title       text,
  seo_desc        text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
```

#### `product_variants`
```sql
create table product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  name        text not null,                   -- e.g. "Glossy · 100 pcs"
  finish      text,                            -- Glossy, Matte, Spot UV, etc.
  size        text,                            -- A4, Standard (90x54mm), etc.
  quantity    int,                             -- e.g. 100, 250, 500, 1000
  price       numeric(10,2) not null,
  is_active   boolean default true,
  sort_order  int default 0
);
```

#### `enquiries`
```sql
-- Stores a record of every WhatsApp order intent initiated
create table enquiries (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id),    -- null if guest
  product_id     uuid references products(id),
  variant_id     uuid references product_variants(id),
  quantity       int,
  customer_name  text,
  customer_phone text,
  message        text,                              -- the pre-filled WA message
  status         text default 'initiated',          -- initiated | contacted | converted | closed
  created_at     timestamptz default now()
);
```

#### `profiles`
```sql
-- Extends auth.users
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  role       text default 'customer',   -- 'customer' | 'admin'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `site_content`
```sql
-- Flexible key-value store for admin-editable site copy
create table site_content (
  key        text primary key,    -- e.g. "home_hero_title", "about_body", "whatsapp_number"
  value      text,
  value_type text default 'text', -- 'text' | 'html' | 'json' | 'url'
  label      text,                -- human-readable label shown in admin panel
  section    text,                -- grouping key for admin UI: 'home', 'footer', 'contact' etc.
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);
```

#### `banners`
```sql
create table banners (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  subtitle    text,
  image_url   text not null,
  cta_text    text,
  cta_url     text,
  position    text default 'home_hero',  -- 'home_hero' | 'home_mid' | 'category_top'
  sort_order  int default 0,
  is_active   boolean default true,
  starts_at   timestamptz,
  ends_at     timestamptz
);
```

#### `deals`
```sql
create table deals (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  badge_text  text,               -- e.g. "20% OFF"
  product_id  uuid references products(id),
  image_url   text,
  is_active   boolean default true,
  starts_at   timestamptz,
  ends_at     timestamptz,
  sort_order  int default 0
);
```

#### `faqs`
```sql
create table faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  category   text default 'general',   -- 'general' | 'ordering' | 'delivery' | 'products'
  sort_order int default 0,
  is_active  boolean default true
);
```

### 3.2 Row Level Security Policies

```sql
-- ── Categories (public read, admin write) ──────────────────────────
alter table categories enable row level security;

create policy "public can read active categories"
  on categories for select
  using (is_active = true);

create policy "admin can do everything"
  on categories for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Apply same pattern to: subcategories, products, product_variants,
-- banners, deals, faqs, site_content

-- ── Enquiries ──────────────────────────────────────────────────────
alter table enquiries enable row level security;

create policy "user can insert their own enquiry"
  on enquiries for insert
  with check (user_id = auth.uid() or user_id is null);

create policy "user can view their own enquiries"
  on enquiries for select
  using (user_id = auth.uid());

create policy "admin can view all enquiries"
  on enquiries for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ── Profiles ───────────────────────────────────────────────────────
alter table profiles enable row level security;

create policy "user can view and update own profile"
  on profiles for all
  using (id = auth.uid());

create policy "admin can view all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p2
      where p2.id = auth.uid()
      and p2.role = 'admin'
    )
  );
```

### 3.3 Storage Buckets

| Bucket | Public | Purpose |
|---|---|---|
| `product-images` | Yes | Product photography, variant images |
| `category-banners` | Yes | Category hero and sub-category banners |
| `site-assets` | Yes | Logo, favicon, home banners, static assets |
| `admin-uploads` | No (signed URL) | Temp upload staging before moving to public buckets |

---

## 4. Information Architecture & Site Map

### 4.1 Primary Navigation

```
Printkul
├── Visiting Cards            ← mega-menu or dropdown
│   ├── Standard / Classic
│   ├── Rounded Corner
│   ├── Square
│   ├── Glossy
│   ├── Matte
│   ├── Spot UV
│   ├── Raised Foil
│   ├── QR Code Visiting Cards
│   ├── Magnetic
│   ├── Transparent
│   ├── Non-Tearable
│   ├── Velvet Touch
│   └── Bulk Visiting Cards
│
├── Signs & Marketing         ← mega-menu
│   ├── Flyers
│   ├── Brochures
│   ├── Banners & Posters
│   ├── Booklets
│   ├── Postcards
│   └── Menus
│
├── Stationery                ← mega-menu
│   ├── Letterheads
│   ├── Stamps
│   ├── Notebooks & Diaries
│   ├── Mousepads
│   └── ID Cards & Lanyards
│
├── Labels & Stickers         ← mega-menu
│   ├── Product Labels
│   ├── Custom Stickers
│   ├── Waterproof Stickers
│   ├── Floor Stickers
│   └── Packaging Labels
│
├── Clothing & Bags           ← mega-menu
│   ├── Printed T-Shirts
│   ├── Polo T-Shirts
│   ├── Caps
│   ├── Tote Bags
│   └── Laptop Bags
│
├── Photo Gifts               ← mega-menu
│   ├── Mugs
│   ├── Photo Albums
│   ├── Canvas Prints
│   └── Calendars
│
├── Deals
├── About
└── Contact
```

### 4.2 Utility / Account Navigation

```
[Header Right]
├── Search (product search)
├── Account
│   ├── Login / Register       ← guest
│   ├── My Orders (enquiries)  ← logged-in customer
│   └── Admin Panel            ← admin role only
└── WhatsApp (floating CTA)    ← always visible
```

---

## 5. Page Inventory

| # | Page | Route | Purpose | Primary CTA |
|---|---|---|---|---|
| 1 | Home | `/` | Hero banner, featured products, category tiles, deals, trust signals | Shop Now / Browse Categories |
| 2 | Category Landing | `/[category-slug]` | Category hero, sub-category tiles, featured products in category, SEO copy | Browse Sub-category |
| 3 | Sub-category Listing | `/[category-slug]/[subcategory-slug]` | Product grid with filter (finish, size, price) | View Product |
| 4 | Product Detail Page | `/[category-slug]/[subcategory-slug]/[product-slug]` | Product images, specs, variants, quantity selector, pricing table, WhatsApp CTA | Order via WhatsApp |
| 5 | All Products | `/products` | Full catalogue grid; filterable by category, finish, price | View Product |
| 6 | Deals | `/deals` | Active promotions and featured deals | View Deal / Order |
| 7 | About | `/about` | Brand story, facility, trust credentials | Contact Us |
| 8 | Contact | `/contact` | WhatsApp link, phone, email, address, FAQ summary | Message on WhatsApp |
| 9 | FAQ | `/faq` | Accordion FAQ by section | — |
| 10 | Login | `/login` | Supabase Auth email/password + Google OAuth | Sign In |
| 11 | Register | `/register` | Account creation | Create Account |
| 12 | My Account | `/account` | Profile, order history (enquiries log) | — |
| 13 | My Orders | `/account/orders` | List of initiated WhatsApp enquiries with status | — |
| 14 | Search Results | `/search?q=` | Product search results grid | View Product |
| 15 | Admin — Dashboard | `/admin` | Stats: total products, recent enquiries, active banners | — |
| 16 | Admin — Products | `/admin/products` | CRUD for products + variants | Add / Edit / Delete |
| 17 | Admin — Categories | `/admin/categories` | CRUD for categories and sub-categories | Add / Edit / Delete |
| 18 | Admin — Banners | `/admin/banners` | CRUD for home/category banners | Add / Edit / Delete |
| 19 | Admin — Deals | `/admin/deals` | CRUD for promotions | Add / Edit / Delete |
| 20 | Admin — Enquiries | `/admin/enquiries` | View all WhatsApp order intents with status management | Update Status |
| 21 | Admin — Site Content | `/admin/content` | Edit all site copy (hero text, WhatsApp number, footer, about, etc.) | Save |
| 22 | Admin — FAQs | `/admin/faqs` | CRUD for FAQ entries | Add / Edit / Delete |
| 23 | Admin — Users | `/admin/users` | View customers; promote to admin | Edit Role |
| 24 | Admin — Media | `/admin/media` | Upload images to Supabase Storage; get URLs | Upload |
| 25 | 404 | `/404` | Not found with search and category tiles | Browse Products |

---

## 6. User Flows

### 6.1 Guest Browse → WhatsApp Order (Primary Flow)

```
Step 1 — Land on Home
  User arrives via search / direct / referral
  Sees: Hero banner, featured products, category tiles, trust badges
  Actions: Clicks category tile or featured product card

Step 2 — Category Page
  Sees: Category hero, sub-category tiles, featured products in grid
  Actions: Clicks sub-category or product card

Step 3 — Sub-category Listing
  Sees: Product grid (thumbnail, name, price-from, finish badges)
  Actions: Filters by finish/size; clicks product

Step 4 — Product Detail Page (PDP)
  Sees:
    - Image gallery (multiple product photos)
    - Product name, short description
    - Specifications table (paper, finish, size, sides)
    - Variant selector (finish dropdown / tabs)
    - Quantity selector (preset tiers: 100 / 250 / 500 / 1000)
    - Pricing table (qty → price per unit → total)
    - Full description + product details accordion
    - "Order via WhatsApp" CTA button (primary, prominent)
    - FAQ section (product-specific)
  Actions: Selects variant + quantity → clicks "Order via WhatsApp"

Step 5 — Name & Phone Modal (pre-WhatsApp)
  Sees: Lightweight modal overlay
    - Name field
    - Phone number field (pre-filled if logged in)
    - Order summary: product, variant, quantity, indicative price
    - "Send WhatsApp Message" button
  Actions: Fills name + phone → clicks Send

Step 6 — WhatsApp Redirect
  System: Builds wa.me URL with pre-filled message (see §7)
  User: Taken to WhatsApp Web / WhatsApp app
  Enquiry record written to Supabase `enquiries` table (status: initiated)

Step 7 — Offline Closure
  Printkul team receives WhatsApp message
  Team confirms stock, shares artwork approval (if needed), collects payment offline
  Team updates enquiry status in admin panel
```

### 6.2 Logged-In Customer Flow

```
Step 1 — Login
  Customer has account; logs in via /login
  Supabase session cookie set; redirected to previous page or /account

Step 2 — Browse & Order
  Same as Guest Flow Steps 2–5
  Phone pre-filled in modal from profile
  Enquiry stored with user_id linked to account

Step 3 — My Orders
  Customer views /account/orders
  Sees list of past WhatsApp enquiries with status badges
  (Status set by admin: initiated / contacted / converted / closed)
```

### 6.3 Admin Content Update Flow

```
Step 1 — Admin Login
  Admin navigates to /login; logs in with admin-role account
  Supabase returns session; profiles.role = 'admin' checked client-side
  Redirected to /admin

Step 2 — Edit Product
  Admin → /admin/products → click Edit
  Form populated from Supabase query
  Admin edits fields (name, price, specs, images, active toggle)
  Clicks Save → supabase.from('products').update() called directly from browser
  RLS policy allows write because profiles.role = 'admin'
  Product page revalidates on next user visit (ISR)

Step 3 — Edit Site Copy
  Admin → /admin/content
  Sees grouped fields by section (Home, Footer, Contact, etc.)
  Edits "WhatsApp Number" key → saves → all WhatsApp links on site updated
  Changes reflected immediately (content fetched at render time via Supabase)
```

---

## 7. WhatsApp Order Flow

### 7.1 wa.me URL Construction

No WhatsApp Business API is used. The order CTA generates a standard `wa.me` deep link with a pre-filled message. No API key required.

```javascript
// lib/whatsapp.ts

export function buildWhatsAppURL({
  waNumber,        // from site_content.key = 'whatsapp_number'
  customerName,
  customerPhone,
  productName,
  variantName,
  quantity,
  price,
  productUrl,
}: WhatsAppOrderParams): string {
  const message = [
    `Hi Printkul! I'd like to place an order.`,
    ``,
    `*Product:* ${productName}`,
    `*Variant:* ${variantName}`,
    `*Quantity:* ${quantity} pcs`,
    `*Indicative Price:* ₹${price}`,
    ``,
    `*Name:* ${customerName}`,
    `*Phone:* ${customerPhone}`,
    ``,
    `*Product Link:* ${productUrl}`,
    ``,
    `Please confirm availability and share payment details.`,
  ].join('\n');

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${waNumber}?text=${encoded}`;
}
```

### 7.2 Pre-WhatsApp Modal Spec

**Trigger:** User clicks "Order via WhatsApp" on PDP after selecting variant + quantity.

**Modal contents:**
- Heading: "Almost there — confirm your details"
- Order summary card: product thumbnail, name, variant, qty, indicative total
- Name input (required; pre-filled from `profiles.full_name` if logged in)
- Phone input (required; pre-filled from `profiles.phone` if logged in)
- Privacy note: "Your number is only used for this order"
- Primary button: "Open WhatsApp →"
- Secondary link: "Cancel"

**On submit:**
1. Validate name + phone (client-side)
2. Write enquiry row to Supabase
3. Open WhatsApp URL in new tab (`window.open(waUrl, '_blank')`)
4. Show success state in modal: "WhatsApp opened! Our team will reply within a few hours."

### 7.3 Floating WhatsApp Button

A persistent floating button appears on every page (bottom-right, above mobile nav). Links to a generic WhatsApp message:

```
wa.me/{number}?text=Hi Printkul! I have a question about your products.
```

This is separate from the product order flow — it's for general enquiries.

### 7.4 WhatsApp Number Management

The WhatsApp number is stored in `site_content` with key `whatsapp_number`. Admin can update it from `/admin/content` without a code deploy. The number is fetched at build time for SSG pages (baked in) or fetched client-side on the modal open. Recommended: fetch on modal open (client-side) so a number change takes effect immediately without redeploy.

---

## 8. Product & Catalogue System

### 8.1 Product Detail Page — Component Breakdown

| Section | Content | Data Source |
|---|---|---|
| Image Gallery | 3–8 product photos; zoom on hover; mobile swipe | `products.images[]` |
| Product Title | Full product name | `products.name` |
| Short Description | 1–2 line summary | `products.short_desc` |
| Price Display | "From ₹[base_price] / [price_note]" | `products.base_price`, `products.price_note` |
| Variant Selector | Tabs or dropdown per finish; updates price | `product_variants` |
| Quantity Selector | Preset buttons: 100 / 250 / 500 / 1000 (custom input optional) | `product_variants.quantity` |
| Pricing Table | qty → unit price → total; highlights best value tier | `product_variants` |
| Specifications | Accordion or table: paper, finish, size, sides, turnaround | `products.specifications` (jsonb) |
| Full Description | Rich text / markdown | `products.description` |
| Order CTA | "Order via WhatsApp" — primary button; sticky on mobile | — |
| FAQ Section | Product-relevant FAQs | `faqs` filtered by category |
| Related Products | Other products in same sub-category | query by `subcategory_id` |

### 8.2 Pricing Table Pattern

```
| Quantity | Price per unit | Total     |
|----------|---------------|-----------|
| 100 pcs  | ₹2.50         | ₹250      |
| 250 pcs  | ₹1.80         | ₹450 ✦    |  ← "Best Value" badge
| 500 pcs  | ₹1.40         | ₹700      |
| 1000 pcs | ₹1.10         | ₹1,100    |
```

All rows are pre-defined `product_variants`. Clicking a row selects that variant and updates the "Order via WhatsApp" button.

### 8.3 Product Variant Axes

Variants can vary on one or more axes. Each combination is a single `product_variants` row.

| Axis | Examples |
|---|---|
| Finish | Glossy, Matte, Spot UV, Velvet Touch, Uncoated |
| Size | Standard (90×54mm), Square (55×55mm), A5, A4, DL |
| Quantity | 100, 250, 500, 1000, 2500, 5000 |
| Sides | Single-sided, Double-sided |
| Material | Paper, PVC, Synthetic, Kraft |

### 8.4 Product Listing Filters

Available on `/[category]/[subcategory]` and `/products`:

| Filter | Type | Data source |
|---|---|---|
| Finish | Multi-select checkbox | Derived from `product_variants.finish` |
| Size | Multi-select checkbox | Derived from `product_variants.size` |
| Price range | Range slider | `products.base_price` |
| Sort by | Dropdown | Featured / Price: Low–High / Price: High–Low / Newest |

All filtering is client-side on the fetched product set. No backend query for each filter change.

### 8.5 Featured & Deals Logic

- `products.is_featured = true` → shown in "Featured Products" section on home page and category page
- `deals` table → shown on `/deals` page and in home "Deals" section
- `banners.position` controls which banners appear on home vs. category pages
- All controlled from admin panel with no code deploy

---

## 9. UI Component System

### 9.1 Global Components

| Component | Notes |
|---|---|
| `<Navbar>` | Sticky; logo + mega-menu (desktop) / hamburger drawer (mobile); Account icon; Search icon |
| `<MegaMenu>` | Full-width dropdown; category columns with sub-category links; promotional tile slot |
| `<MobileDrawer>` | Slide-in from left; accordion-expanded category tree |
| `<SearchBar>` | Debounced query against Supabase `products` (name full-text search); result popover |
| `<Footer>` | Category links, contact info, WhatsApp CTA, social links; copy editable via `site_content` |
| `<FloatingWhatsApp>` | Fixed bottom-right; always visible; links to general enquiry |
| `<WhatsAppOrderModal>` | Overlay triggered from PDP CTA; name/phone form; builds and opens wa.me URL |
| `<AuthGuard>` | HOC/wrapper that redirects to /login if session not present; used on /account/* and /admin/* |
| `<AdminGuard>` | Checks `profiles.role = 'admin'`; redirects non-admins away from /admin/* |

### 9.2 Home Page Components

| Component | Data source |
|---|---|
| `<HeroBannerSlider>` | `banners` where `position = 'home_hero' AND is_active = true` |
| `<CategoryTileGrid>` | `categories` where `is_active = true` ORDER BY `sort_order` |
| `<FeaturedProducts>` | `products` where `is_featured = true` LIMIT 8 |
| `<DealsSection>` | `deals` where `is_active = true AND now() BETWEEN starts_at AND ends_at` |
| `<TrustBadges>` | Static: "Pan-India Delivery", "Quality Guarantee", "WhatsApp Support", "1 pc minimum" |
| `<MidBanner>` | `banners` where `position = 'home_mid'` |
| `<TestimonialsSection>` | Hardcoded or from `site_content` JSON value |

### 9.3 PDP Components

| Component | Notes |
|---|---|
| `<ProductImageGallery>` | Main image + thumbnails; click to enlarge; swipe on mobile |
| `<FinishSelector>` | Tab buttons or visual swatches; updates active variant set |
| `<QuantityTierSelector>` | Grid of quantity option buttons; selected = highlighted |
| `<PricingTable>` | Full variant × quantity matrix; "Best Value" badge on optimal tier |
| `<SpecsAccordion>` | Specifications key-value pairs from `products.specifications` jsonb |
| `<OrderCTABar>` | Sticky bottom bar on mobile: selected variant summary + "Order via WhatsApp" |
| `<ProductFAQ>` | FAQ items filtered by `products` category |
| `<RelatedProducts>` | Horizontal scroll of product cards from same sub-category |
| `<Breadcrumbs>` | Home > Category > Sub-category > Product; schema-marked |

### 9.4 Admin Components

| Component | Notes |
|---|---|
| `<AdminSidebar>` | Fixed left nav; links to all admin sections; role-gated |
| `<DataTable>` | Reusable sortable/filterable table; used in Products, Enquiries, Users |
| `<ProductForm>` | Create/Edit product; image upload to Supabase Storage; variant builder |
| `<VariantBuilder>` | Add/remove/edit variant rows inline within ProductForm |
| `<ImageUploader>` | Drag-drop or file picker; uploads to Supabase Storage; returns public URL |
| `<ContentEditor>` | Per-key edit fields grouped by section; auto-detects value_type (text/html/url) |
| `<BannerForm>` | Create/Edit banner; image upload; position selector; schedule date pickers |
| `<EnquiryCard>` | Expandable card showing full enquiry details + status dropdown |
| `<StatusBadge>` | Colour-coded: initiated (yellow), contacted (blue), converted (green), closed (grey) |
| `<ConfirmDialog>` | Reusable "Are you sure?" modal for delete actions |
| `<ToastNotification>` | Success/error toasts after Supabase write operations |

---

## 10. Admin Panel Specification

### 10.1 Dashboard `/admin`

**Stat cards (queried live from Supabase):**
- Total active products
- Total enquiries (this month)
- Enquiries by status breakdown (pie or bar)
- New enquiries today
- Active banners count
- Active deals count

**Quick actions:**
- Add Product
- Upload Image
- View New Enquiries

### 10.2 Products `/admin/products`

**List view:**
- Table: Thumbnail | Name | Category | Base Price | Variants Count | Featured | Active | Actions
- Filters: Category dropdown, Active toggle, Featured toggle
- Search: by product name
- Bulk actions: Activate / Deactivate selected

**Create / Edit form:**
- Basic Info: Name, Slug (auto-generated, editable), Short Description
- Category: Category → Sub-category cascading dropdowns
- Pricing: Base price, Price note
- Description: Markdown / rich text editor
- Specifications: Dynamic key-value pair builder (Add Row / Delete Row)
- Images: Drag-drop multi-image upload → Supabase Storage; reorder by drag; set primary thumbnail
- Variants: Inline table builder — each row: Finish, Size, Quantity, Price, Active toggle
- SEO: Title, Meta Description
- Settings: Featured toggle, Active toggle, Sort order
- Save button → `supabase.from('products').upsert()`

### 10.3 Categories `/admin/categories`

**Category list:** Name | Slug | Sub-category count | Active | Sort order | Actions

**Create / Edit category:**
- Name, Slug, Description
- Banner image upload
- Icon image upload
- SEO Title + Description
- Active toggle, Sort order

**Sub-category management:** Inline below each category or separate `/admin/categories/[id]/subcategories`

### 10.4 Banners `/admin/banners`

**List view:** Preview thumbnail | Title | Position | Schedule | Active | Actions

**Create / Edit:**
- Title, Subtitle
- Image upload (recommended dimensions shown per position)
- CTA Text, CTA URL
- Position: `home_hero` / `home_mid` / `category_top`
- Schedule: optional start/end date-time pickers
- Active toggle, Sort order

### 10.5 Enquiries `/admin/enquiries`

**List view:**
- Table: Date | Customer | Phone | Product | Variant | Qty | Status | Actions
- Filters: Status, Date range
- Search: by customer name or phone

**Enquiry detail:**
- Full product + variant info
- Customer name + phone (click-to-call on mobile; click-to-WhatsApp)
- Status dropdown: initiated → contacted → converted → closed
- Internal notes text field (not shown to customer)

**Export:** CSV export of filtered enquiries for offline CRM use

### 10.6 Site Content `/admin/content`

All editable copy in `site_content` table, grouped by section:

**Home section:**
- `home_hero_title` — Hero headline
- `home_hero_subtitle` — Hero sub-text
- `home_featured_heading` — Section heading for featured products

**Contact & WhatsApp:**
- `whatsapp_number` — The wa.me number (without +; e.g. `919876543210`)
- `contact_phone` — Display phone number
- `contact_email` — Support email
- `contact_address` — Physical address (shown in footer + contact page)

**Footer:**
- `footer_tagline`
- `footer_about_blurb`

**About:**
- `about_hero_title`
- `about_body` (HTML/Markdown)

**Delivery:**
- `delivery_info` — Shown on PDP and FAQ; e.g. "7–14 business days, pan-India"
- `gst_note` — GST disclaimer text

Each field renders an appropriate input: single-line text, textarea, or rich text based on `value_type`.

### 10.7 Admin Access Control

```
Admin role check flow:
  1. User visits /admin/*
  2. AdminGuard component fetches session via supabase.auth.getSession()
  3. If no session → redirect to /login?redirect=/admin
  4. If session exists → query profiles table for role
  5. If role !== 'admin' → redirect to / with toast "Access denied"
  6. If role === 'admin' → render admin layout

Promoting a user to admin:
  Admin visits /admin/users → finds user → sets role = 'admin'
  This is a direct UPDATE on profiles table (admin RLS allows this)
  No server process needed
```

---

## 11. Auth System (Supabase)

### 11.1 Auth Methods

| Method | Notes |
|---|---|
| Email + Password | Default; Supabase handles hashing and sessions |
| Google OAuth | Optional; configured in Supabase Auth dashboard; one click setup |
| Magic Link | Optional; can enable in Supabase with no code changes |

### 11.2 Session Management

- Supabase JS client handles JWT storage (httpOnly cookie via `@supabase/ssr` package for Next.js)
- Session persists across browser refreshes automatically
- `supabase.auth.onAuthStateChange()` used for reactive auth state in React context

### 11.3 Post-Registration Profile Creation

```sql
-- Trigger: auto-create profile row on new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

### 11.4 Auth Pages

**`/login`:**
- Email + password form
- Google OAuth button (if enabled)
- "Forgot password?" link → Supabase password reset email
- "Don't have an account? Register" link
- Redirect to `?redirect` param after login (preserves intent)

**`/register`:**
- Full name, email, password, confirm password, phone (optional)
- On submit: `supabase.auth.signUp()` → triggers DB function to create profile
- Auto-login after registration; redirect to account

**`/account`:**
- Protected by `AuthGuard`
- Shows profile edit form (name, phone)
- Links to My Orders

---

## 12. SEO & Content Strategy

### 12.1 URL Structure

| Pattern | Example | Page type |
|---|---|---|
| `/` | — | Home |
| `/[category]` | `/visiting-cards` | Category landing |
| `/[category]/[subcategory]` | `/visiting-cards/glossy-visiting-cards` | Sub-category listing |
| `/[category]/[subcategory]/[product]` | `/visiting-cards/glossy-visiting-cards/standard-glossy-100` | PDP |
| `/products` | — | All products |
| `/deals` | — | Deals |
| `/about` | — | About |
| `/contact` | — | Contact |
| `/faq` | — | FAQ |
| `/search` | `/search?q=mug` | Search results |
| `/admin/*` | — | Admin (noindex) |
| `/account/*` | — | Account (noindex) |

### 12.2 Next.js Rendering Strategy

| Page | Strategy | Rationale |
|---|---|---|
| Home | ISR (60s revalidate) | Banner/deals change often; SSG for speed |
| Category Landing | ISR (300s) | Semi-static; SEO critical |
| Sub-category Listing | ISR (300s) | Product lists change with admin edits |
| PDP | ISR (300s) | Price/spec changes need to propagate |
| All Products | ISR (300s) | — |
| Deals | ISR (60s) | Frequent changes |
| FAQ, About, Contact | SSG at build | Rarely changes; pulled from site_content |
| Search Results | Client-side render | Dynamic per query |
| Admin pages | Client-side render | No SSR; auth-gated; noindex |
| Account pages | Client-side render | No SSR; auth-gated; noindex |

**ISR trigger on admin save:** When admin saves a product, optionally call Next.js revalidate API to flush that product's ISR cache immediately.

### 12.3 On-Page SEO Elements

| Element | Pattern |
|---|---|
| `<title>` | `{Product Name} - {Finish} Printing in India \| Printkul` |
| `<meta description>` | `Order {product} from Printkul. {short_desc}. Starting ₹{base_price}. Order via WhatsApp — fast delivery across India.` |
| `<h1>` | Product name |
| Breadcrumbs | JSON-LD BreadcrumbList schema |
| Product schema | JSON-LD Product with `offers`, `image`, `description` |
| FAQ schema | JSON-LD FAQPage on `/faq` and PDP FAQ sections |
| Canonical | Self-referencing canonical on all pages |
| robots meta | `noindex, nofollow` on `/admin/*` and `/account/*` |

SEO title and description are editable per category, sub-category, and product via the admin panel (stored in `seo_title`, `seo_desc` columns).

### 12.4 Content Strategy

| Content type | Location | Admin-editable? |
|---|---|---|
| Hero banner copy | Home hero banners | Yes — banners table |
| Category SEO copy | Category landing page | Yes — categories.description |
| Product description | PDP | Yes — products.description |
| About page body | /about | Yes — site_content |
| FAQ content | /faq | Yes — faqs table |
| Trust badges text | Footer / home | Yes — site_content |
| Delivery info | PDP + FAQ | Yes — site_content |
| WhatsApp number | All order CTAs | Yes — site_content |

---

## 13. Operational Constraints & Policies

| Policy | Detail |
|---|---|
| No payment on-site | All payment handled offline after WhatsApp contact |
| No design tool | Customers cannot customise artwork; only select from pre-defined variants |
| No custom orders | No bespoke sizes, finishes, or quantities outside what admin has defined in variants |
| No order guarantee | WhatsApp redirect is intent only; stock, pricing, and availability confirmed by team offline |
| Indicative pricing | Prices shown on site are indicative starting prices; final confirmed by team |
| GST note | Show GST disclaimer on PDP and checkout modal; actual GST applied offline |
| Minimum quantity | Set per product via variants; no site-wide MOQ rule |
| Delivery info | Shown as site_content value; updated by admin; "7–14 business days, pan-India" default |
| Image rights | Admin uploads product photography; no customer-generated content |
| No refund flow on-site | Refund/reprint policy stated on FAQ; handled entirely via WhatsApp offline |
| Enquiry record | Every WhatsApp redirect writes an enquiry row for admin tracking; guest enquiries allowed (null user_id) |
| Content changes | All content (prices, products, banners, copy) updated via admin panel; no code deploy required |
| WhatsApp number change | Via `/admin/content`; takes effect immediately; no redeploy |

---

## 14. Build Checklist

### 14.1 Supabase Setup
- [ ] Create Supabase project
- [ ] Run all table creation SQL
- [ ] Set up RLS policies per table (public read, admin write)
- [ ] Create `handle_new_user` trigger for auto-profile creation
- [ ] Create storage buckets: `product-images`, `category-banners`, `site-assets`
- [ ] Set bucket policies (product-images public; admin-uploads private)
- [ ] Enable Google OAuth in Supabase Auth dashboard (if using)
- [ ] Seed `site_content` table with all keys and default values
- [ ] Create first admin user; manually set `profiles.role = 'admin'` in Supabase dashboard

### 14.2 Next.js Project
- [ ] `npx create-next-app@latest` with App Router + TypeScript + Tailwind
- [ ] Install `@supabase/ssr`, `@supabase/supabase-js`
- [ ] Configure Supabase client (server + browser clients per `@supabase/ssr` docs)
- [ ] Set up middleware for auth session refresh on every request
- [ ] Install shadcn/ui; configure components
- [ ] Set up environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 14.3 Customer-Facing Site
- [ ] `<Navbar>` with mega-menu driven from `categories` + `subcategories` Supabase query
- [ ] `<MobileDrawer>` with same data
- [ ] `<FloatingWhatsApp>` button (all pages)
- [ ] Home page: Hero slider, Category tiles, Featured products, Deals, Trust badges, Mid-banner
- [ ] Category landing page (SSG + ISR)
- [ ] Sub-category listing page with client-side filters
- [ ] PDP: Image gallery, Variant selector, Quantity tier selector, Pricing table, Specs accordion, Order CTA
- [ ] `<WhatsAppOrderModal>`: Name/phone form, order summary, wa.me URL builder
- [ ] Enquiry write to Supabase on modal submit
- [ ] `/products` all-products grid with filters
- [ ] `/deals` page
- [ ] `/about`, `/contact`, `/faq` pages pulling from `site_content` and `faqs`
- [ ] `/search` client-side search via Supabase full-text search on `products.name`
- [ ] `<Breadcrumbs>` with JSON-LD schema on category + PDP pages
- [ ] Product JSON-LD schema on PDP
- [ ] FAQ JSON-LD schema on `/faq`
- [ ] `robots.txt`: noindex admin + account routes
- [ ] `sitemap.xml`: auto-generated from products + categories Supabase query

### 14.4 Auth
- [ ] `/login` page with Supabase email/password + Google OAuth
- [ ] `/register` page
- [ ] Password reset flow (Supabase handles email)
- [ ] `<AuthGuard>` HOC for `/account/*`
- [ ] `/account` profile edit (name, phone)
- [ ] `/account/orders` enquiry history list

### 14.5 Admin Panel
- [ ] `<AdminGuard>` — role check before rendering any admin page
- [ ] `/admin` dashboard with stat cards
- [ ] `/admin/products` — list, create, edit, delete, toggle active/featured
- [ ] `/admin/products/[id]/variants` — inline variant builder
- [ ] `/admin/categories` — list, create, edit, delete, sort order
- [ ] `/admin/categories/[id]/subcategories` — sub-category CRUD
- [ ] `/admin/banners` — list, create, edit, schedule, delete
- [ ] `/admin/deals` — list, create, edit, delete
- [ ] `/admin/enquiries` — list, filter, status update, notes, CSV export
- [ ] `/admin/content` — all `site_content` keys grouped by section
- [ ] `/admin/faqs` — CRUD, category grouping, sort order
- [ ] `/admin/users` — list customers, promote to admin
- [ ] `/admin/media` — image upload to Supabase Storage, URL copy
- [ ] `<ImageUploader>` component (used across Products, Banners, Categories forms)
- [ ] `<DataTable>` reusable component with sort + filter + pagination
- [ ] Toast notifications on save/delete success/error
- [ ] `<ConfirmDialog>` for all delete actions
- [ ] ISR revalidation call after product/category admin saves (optional but recommended)

### 14.6 SEO & Performance
- [ ] Dynamic `<title>` and `<meta description>` per page (from `seo_title`, `seo_desc` or defaults)
- [ ] Canonical tags on all public pages
- [ ] Open Graph tags (og:title, og:description, og:image) on home, category, PDP
- [ ] Next.js Image component for all product images (automatic optimisation)
- [ ] ISR revalidation configured per page type
- [ ] `next/font` for web fonts (no external font request latency)
- [ ] Core Web Vitals: LCP < 2.5s target; no layout shift from image loading (explicit width/height)

---

## 15. Appendix

### 15.1 Key Configuration Values (seed in `site_content`)

| Key | Default Value | Section |
|---|---|---|
| `whatsapp_number` | `91XXXXXXXXXX` | contact |
| `contact_phone` | `+91 XXXXX XXXXX` | contact |
| `contact_email` | `hello@printkul.in` | contact |
| `contact_address` | Your address | contact |
| `home_hero_title` | `Print Products for Every Business` | home |
| `home_hero_subtitle` | `Order via WhatsApp — fast, simple, no hassle` | home |
| `home_featured_heading` | `Our Most Popular Products` | home |
| `footer_tagline` | `Quality print products. One WhatsApp away.` | footer |
| `delivery_info` | `7–14 business days, pan-India delivery` | delivery |
| `gst_note` | `Prices shown are indicative and exclude GST. Final price confirmed on WhatsApp.` | delivery |
| `min_order_note` | `No minimum quantity — order as few as 1 piece` | general |

### 15.2 wa.me URL Format Reference

```
https://wa.me/{phone}?text={encoded_message}

Phone format: Country code + number, no spaces/symbols
Example:      919876543210  (for +91 98765 43210)

URL encoding: Use encodeURIComponent() in JavaScript
Newlines:     %0A in the encoded string
Bold (WA):    *text* renders bold in WhatsApp
```

### 15.3 Supabase Free Tier Limits (as of 2026)

| Resource | Free Tier Limit |
|---|---|
| Database | 500 MB |
| Storage | 1 GB |
| Auth users | Unlimited |
| Edge Function invocations | 500K/month |
| Bandwidth | 5 GB/month |
| API requests | Unlimited (rate-limited) |

Printkul's initial scale comfortably fits within the free tier. Upgrade to Pro ($25/month) when database approaches 500 MB or bandwidth exceeds 5 GB/month.

### 15.4 Recommended npm Packages

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Supabase client |
| `@supabase/ssr` | Next.js server-side Supabase auth |
| `shadcn/ui` | Component library |
| `@tanstack/react-query` | Data fetching + caching for admin panel |
| `react-hook-form` | Form state management |
| `zod` | Schema validation for forms |
| `react-dropzone` | Image upload component |
| `@radix-ui/react-*` | Headless UI primitives (shadcn dependency) |
| `lucide-react` | Icons |
| `next-themes` | Dark mode (optional) |
| `react-hot-toast` | Toast notifications |
| `date-fns` | Date formatting for scheduling |
| `react-image-gallery` or `embla-carousel` | PDP image carousel |

---

*Printkul Site Planner v1.0 — All content and schema designed for a zero-backend, Supabase-native architecture. The WhatsApp number and all site copy are runtime-configurable via the admin panel with no code deploy.*