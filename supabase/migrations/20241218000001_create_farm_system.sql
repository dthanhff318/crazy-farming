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

