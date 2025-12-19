-- =====================================================
-- Change all price-related fields from INTEGER to DECIMAL
-- This allows prices like 0.2, 10.3, etc.
-- =====================================================

-- Users table - coin field
ALTER TABLE public.users
  ALTER COLUMN coin TYPE DECIMAL(10, 2) USING coin::DECIMAL(10, 2);

-- Animal types table - price fields
ALTER TABLE public.animal_types
  ALTER COLUMN base_price TYPE DECIMAL(10, 2) USING base_price::DECIMAL(10, 2),
  ALTER COLUMN production_value TYPE DECIMAL(10, 2) USING production_value::DECIMAL(10, 2);

-- Building types table - base_price field
ALTER TABLE public.building_types
  ALTER COLUMN base_price TYPE DECIMAL(10, 2) USING base_price::DECIMAL(10, 2);

-- Seed types table - price fields
ALTER TABLE public.seed_types
  ALTER COLUMN base_price TYPE DECIMAL(10, 2) USING base_price::DECIMAL(10, 2),
  ALTER COLUMN sell_price TYPE DECIMAL(10, 2) USING sell_price::DECIMAL(10, 2),
  ALTER COLUMN harvest_value TYPE DECIMAL(10, 2) USING harvest_value::DECIMAL(10, 2);

-- Animal types sell_price (if exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'animal_types'
    AND column_name = 'sell_price'
  ) THEN
    ALTER TABLE public.animal_types
      ALTER COLUMN sell_price TYPE DECIMAL(10, 2) USING sell_price::DECIMAL(10, 2);
  END IF;
END $$;
