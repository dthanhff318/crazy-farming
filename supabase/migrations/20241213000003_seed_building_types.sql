-- =====================================================
-- SEED DATA FOR BUILDING TYPES
-- =====================================================

-- Coops (for chickens)
INSERT INTO public.building_types (code, name, type, description, icon, base_price, unlock_level, level_config)
VALUES
  ('bld_coop', 'Coop', 'coop', 'A cozy coop that can house chickens', '🏠', 100, 1, '{
    "1": {"capacity": 2, "upgrade_price": 0},
    "2": {"capacity": 4, "upgrade_price": 150},
    "3": {"capacity": 6, "upgrade_price": 300}
  }'::jsonb);

-- Barns (for cows, pigs, sheep)
INSERT INTO public.building_types (code, name, type, description, icon, base_price, unlock_level, level_config)
VALUES
  ('bld_barn', 'Barn', 'barn', 'A basic barn for your livestock', '🛖', 250, 2, '{
    "1": {"capacity": 2, "upgrade_price": 0},
    "2": {"capacity": 4, "upgrade_price": 200},
    "3": {"capacity": 6, "upgrade_price": 400}
  }'::jsonb);
