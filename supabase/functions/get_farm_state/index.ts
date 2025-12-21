import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface FarmPlot {
  id: string;
  plot_number: number;
  position_x: number | null;
  position_y: number | null;
  is_unlocked: boolean;
  unlocked_at: string | null;
  crop: CropInfo | null;
}

interface CropInfo {
  id: string;
  seed_code: string;
  seed_name: string;
  planted_at: string;
  ready_at: string;
  status: string;
  progress: number;
  remaining_time: number;
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

    return new Response(
      JSON.stringify({
        plots: plots,
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
