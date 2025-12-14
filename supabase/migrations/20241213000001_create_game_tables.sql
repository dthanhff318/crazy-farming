-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  coin INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- ANIMAL TYPES TABLE (Master data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.animal_types (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g., 'anl_chicken', 'anl_cow'
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'barn', 'coop', 'stable', etc.
  description TEXT,
  icon TEXT, -- emoji or image URL
  base_price INTEGER NOT NULL DEFAULT 0,
  production_time INTEGER NOT NULL DEFAULT 0, -- in hours
  production_item TEXT, -- 'milk', 'egg', 'wool', etc.
  production_value INTEGER NOT NULL DEFAULT 0, -- coins per production
  unlock_level INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- BUILDING TYPES TABLE (Master data)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.building_types (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL, -- e.g., 'bld_coop', 'bld_barn'
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'barn', 'coop', 'stable', etc.
  description TEXT,
  icon TEXT, -- emoji or image URL
  base_price INTEGER NOT NULL DEFAULT 0,
  unlock_level INTEGER NOT NULL DEFAULT 1,
  level_config JSONB NOT NULL DEFAULT '{"1":{"capacity":2,"upgrade_price":0}}'::jsonb, -- {"1":{"capacity":2,"upgrade_price":0},"2":{"capacity":4,"upgrade_price":150}}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- USER BUILDINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_buildings (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  building_code TEXT NOT NULL REFERENCES public.building_types(code) ON DELETE CASCADE,
  current_level INTEGER NOT NULL DEFAULT 1,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, building_code) -- User can only own one of each building type
);

-- =====================================================
-- USER ANIMALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_animals (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  animal_code TEXT NOT NULL REFERENCES public.animal_types(code) ON DELETE CASCADE,
  user_building_id UUID REFERENCES public.user_buildings(id) ON DELETE SET NULL, -- Can be NULL if not assigned to a building
  name TEXT, -- Custom name for the animal (optional)
  health INTEGER NOT NULL DEFAULT 100, -- Health percentage (0-100)
  last_fed_at TIMESTAMP WITH TIME ZONE,
  last_produced_at TIMESTAMP WITH TIME ZONE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_buildings_user_id ON public.user_buildings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_buildings_building_code ON public.user_buildings(building_code);
CREATE INDEX IF NOT EXISTS idx_user_animals_user_id ON public.user_animals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_animals_building_id ON public.user_animals(user_building_id);
CREATE INDEX IF NOT EXISTS idx_user_animals_animal_code ON public.user_animals(animal_code);
