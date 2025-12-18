-- =====================================================
-- FARM PLOTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.farm_plots (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_number INTEGER NOT NULL,
  position_x INTEGER,
  position_y INTEGER,
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unique_user_plot UNIQUE(user_id, plot_number)
);

-- =====================================================
-- USER CROPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_crops (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plot_id UUID NOT NULL REFERENCES public.farm_plots(id) ON DELETE CASCADE,
  seed_code TEXT NOT NULL REFERENCES public.seed_types(code) ON DELETE CASCADE,
  planted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc', NOW()),
  ready_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'growing' CHECK (status IN ('growing', 'ready', 'withered')),
  withered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unique_plot_crop UNIQUE(plot_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_farm_plots_user ON public.farm_plots(user_id);
CREATE INDEX IF NOT EXISTS idx_farm_plots_unlocked ON public.farm_plots(user_id, is_unlocked);
CREATE INDEX IF NOT EXISTS idx_user_crops_user ON public.user_crops(user_id);
CREATE INDEX IF NOT EXISTS idx_user_crops_plot ON public.user_crops(plot_id);
CREATE INDEX IF NOT EXISTS idx_user_crops_status ON public.user_crops(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_crops_ready ON public.user_crops(ready_at) WHERE status = 'growing';

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.farm_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_crops ENABLE ROW LEVEL SECURITY;

-- Farm plots policies
CREATE POLICY "Users can view their own farm plots"
  ON public.farm_plots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farm plots"
  ON public.farm_plots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm plots"
  ON public.farm_plots FOR UPDATE
  USING (auth.uid() = user_id);

-- User crops policies
CREATE POLICY "Users can view their own crops"
  ON public.user_crops FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crops"
  ON public.user_crops FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crops"
  ON public.user_crops FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crops"
  ON public.user_crops FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTION: Auto-create initial farm plots for new users
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_initial_farm_plots()
RETURNS TRIGGER AS $$
BEGIN
  -- Create 6 plots for new user (3 unlocked, 3 locked)
  INSERT INTO public.farm_plots (user_id, plot_number, position_x, position_y, is_unlocked, unlocked_at)
  VALUES
    (NEW.id, 1, 0, 0, true, TIMEZONE('utc', NOW())),
    (NEW.id, 2, 1, 0, true, TIMEZONE('utc', NOW())),
    (NEW.id, 3, 2, 0, true, TIMEZONE('utc', NOW())),
    (NEW.id, 4, 0, 1, false, NULL),
    (NEW.id, 5, 1, 1, false, NULL),
    (NEW.id, 6, 2, 1, false, NULL);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER: Create farm plots when user is created
-- =====================================================
CREATE TRIGGER trigger_create_initial_farm_plots
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_farm_plots();
