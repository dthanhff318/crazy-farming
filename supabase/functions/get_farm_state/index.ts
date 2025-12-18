import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FarmPlot {
  id: string;
  plotNumber: number;
  positionX: number | null;
  positionY: number | null;
  isUnlocked: boolean;
  unlockedAt: string | null;
  crop: CropInfo | null;
}

interface CropInfo {
  id: string;
  seedCode: string;
  seedName: string;
  seedIcon: string | null;
  plantedAt: string;
  readyAt: string;
  status: string;
  progress: number;
  remainingTime: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId } = await req.json();

    if (!userId) {
      throw new Error("userId is required");
    }

    // Get all farm plots with crops and seed information
    const { data: plots, error: plotsError } = await supabaseClient
      .from("farm_plots")
      .select(
        `
        id,
        plot_number,
        position_x,
        position_y,
        is_unlocked,
        unlocked_at,
        user_crops (
          id,
          seed_code,
          planted_at,
          ready_at,
          status,
          seed_types (
            name,
            icon,
            growth_time
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("plot_number");

    if (plotsError) {
      throw plotsError;
    }

    const now = new Date();

    // Process plots and calculate crop progress
    const processedPlots: FarmPlot[] = plots.map((plot: any) => {
      let crop: CropInfo | null = null;

      if (plot.user_crops && plot.user_crops.length > 0) {
        const cropData = plot.user_crops[0];
        const plantedAt = new Date(cropData.planted_at);
        const readyAt = new Date(cropData.ready_at);

        // Calculate progress
        const totalTime = readyAt.getTime() - plantedAt.getTime();
        const elapsed = now.getTime() - plantedAt.getTime();
        const progress = Math.min(Math.round((elapsed / totalTime) * 100), 100);

        // Calculate remaining time in seconds
        const remainingTime = Math.max(
          Math.round((readyAt.getTime() - now.getTime()) / 1000),
          0
        );

        // Auto-update status if ready
        let status = cropData.status;
        if (status === "growing" && now >= readyAt) {
          status = "ready";

          // Update status in database
          supabaseClient
            .from("user_crops")
            .update({ status: "ready" })
            .eq("id", cropData.id)
            .then();
        }

        crop = {
          id: cropData.id,
          seedCode: cropData.seed_code,
          seedName: cropData.seed_types.name,
          seedIcon: cropData.seed_types.icon,
          plantedAt: cropData.planted_at,
          readyAt: cropData.ready_at,
          status,
          progress,
          remainingTime,
        };
      }

      return {
        id: plot.id,
        plotNumber: plot.plot_number,
        positionX: plot.position_x,
        positionY: plot.position_y,
        isUnlocked: plot.is_unlocked,
        unlockedAt: plot.unlocked_at,
        crop,
      };
    });

    // Calculate stats
    const stats = {
      totalPlots: processedPlots.length,
      unlockedPlots: processedPlots.filter((p) => p.isUnlocked).length,
      activeCrops: processedPlots.filter(
        (p) => p.crop && p.crop.status === "growing"
      ).length,
      readyCrops: processedPlots.filter(
        (p) => p.crop && p.crop.status === "ready"
      ).length,
    };

    return new Response(
      JSON.stringify({
        plots: processedPlots,
        stats,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
