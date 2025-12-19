-- =====================================================
-- Drop harvest_value column from seed_types table
-- =====================================================

ALTER TABLE public.seed_types
  DROP COLUMN IF EXISTS harvest_value;
