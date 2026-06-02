-- ============================================
-- ADD MOQ & PRICING TIERS TO PRODUCTS TABLE
-- Run in Supabase SQL Editor
-- ============================================

-- Add MOQ column (default 1000)
ALTER TABLE products ADD COLUMN IF NOT EXISTS moq int DEFAULT 1000;

-- Add pricing_tiers JSONB column
-- Format: [{"qty": 2000, "discount": 6}, {"qty": 5000, "discount": 18}, ...]
ALTER TABLE products ADD COLUMN IF NOT EXISTS pricing_tiers jsonb DEFAULT '[
  {"qty": 2000, "discount": 6},
  {"qty": 3000, "discount": 12},
  {"qty": 5000, "discount": 18},
  {"qty": 10000, "discount": 25}
]'::jsonb;
