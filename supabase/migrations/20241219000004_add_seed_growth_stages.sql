-- Add growth stage image fields to seed_types table
ALTER TABLE public.seed_types
  ADD COLUMN stage_1_image TEXT, -- Seedling/Sprout stage image URL
  ADD COLUMN stage_2_image TEXT, -- Growing stage image URL
  ADD COLUMN stage_3_image TEXT; -- Mature/Harvest ready stage image URL

-- Add comments to document the fields
COMMENT ON COLUMN public.seed_types.stage_1_image IS 'Image URL for seedling/sprout stage (early growth)';
COMMENT ON COLUMN public.seed_types.stage_2_image IS 'Image URL for growing stage (mid growth)';
COMMENT ON COLUMN public.seed_types.stage_3_image IS 'Image URL for mature stage (ready to harvest)';
