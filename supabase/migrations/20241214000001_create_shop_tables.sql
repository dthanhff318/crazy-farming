-- =====================================================
-- SEED TYPES TABLE (Master data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.seed_types (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g., 'seed_wheat', 'seed_carrot'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or image URL
  base_price INTEGER NOT NULL DEFAULT 0, -- Price to buy
  sell_price INTEGER NOT NULL DEFAULT 0, -- Price to sell back (60% of base_price)
  growth_time INTEGER NOT NULL DEFAULT 0, -- in hours
  harvest_value INTEGER NOT NULL DEFAULT 0, -- coins earned when harvested
  unlock_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- USER INVENTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'seed', 'animal', 'resource', etc.
  item_code TEXT NOT NULL, -- references seed_types.code or animal_types.code, etc.
  quantity INTEGER NOT NULL DEFAULT 1,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, item_type, item_code) -- User can have multiple quantities but one row per item
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON public.user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_item_type ON public.user_inventory(item_type);
CREATE INDEX IF NOT EXISTS idx_user_inventory_item_code ON public.user_inventory(item_code);

-- =====================================================
-- SEED DATA - Seed Types
-- =====================================================
INSERT INTO public.seed_types (code, name, description, icon, base_price, sell_price, growth_time, harvest_value, unlock_level) VALUES
  ('seed_wheat', 'Wheat Seeds', 'Basic crop that grows quickly', '🌾', 10, 6, 2, 20, 1),
  ('seed_carrot', 'Carrot Seeds', 'Healthy orange vegetable', '🥕', 15, 9, 3, 30, 1),
  ('seed_corn', 'Corn Seeds', 'Sweet and tall crop', '🌽', 20, 12, 4, 40, 2),
  ('seed_tomato', 'Tomato Seeds', 'Juicy red fruit', '🍅', 25, 15, 5, 50, 3),
  ('seed_potato', 'Potato Seeds', 'Versatile underground crop', '🥔', 30, 18, 6, 60, 4),
  ('seed_pumpkin', 'Pumpkin Seeds', 'Large orange harvest', '🎃', 50, 30, 8, 100, 5)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SEED DATA - Update Animal Types with sell_price
-- =====================================================
-- Add sell_price column to animal_types if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'animal_types'
    AND column_name = 'sell_price'
  ) THEN
    ALTER TABLE public.animal_types ADD COLUMN sell_price INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Update existing animals with sell_price (60% of base_price)
UPDATE public.animal_types
SET sell_price = FLOOR(base_price * 0.6)
WHERE sell_price = 0;
