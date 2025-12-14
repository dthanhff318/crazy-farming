-- =====================================================
-- SEED DATA FOR ANIMAL TYPES
-- =====================================================

-- Chickens (Coop animals)
INSERT INTO public.animal_types (code, name, type, description, icon, base_price, production_time, production_item, production_value, unlock_level)
VALUES
  ('anl_chicken', 'Chicken', 'coop', 'A friendly chicken that lays eggs daily', '🐔', 50, 24, 'egg', 10, 1);

-- Cows (Barn animals)
INSERT INTO public.animal_types (code, name, type, description, icon, base_price, production_time, production_item, production_value, unlock_level)
VALUES
  ('anl_cow', 'Cow', 'barn', 'A gentle cow that produces fresh milk', '🐄', 200, 36, 'milk', 25, 2);

-- Pigs (Barn animals)
INSERT INTO public.animal_types (code, name, type, description, icon, base_price, production_time, production_item, production_value, unlock_level)
VALUES
  ('anl_pig', 'Pig', 'barn', 'A cheerful pig that finds truffles', '🐷', 150, 48, 'truffle', 30, 3);

-- Sheep (Barn animals)
INSERT INTO public.animal_types (code, name, type, description, icon, base_price, production_time, production_item, production_value, unlock_level)
VALUES
  ('anl_sheep', 'Sheep', 'barn', 'A fluffy sheep that produces wool', '🐑', 180, 48, 'wool', 35, 4);
