import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

interface FarmPlot {
  id: string;
  plot_number: number;
  position_x: number | null;
  position_y: number | null;
  is_unlocked: boolean;
  unlocked_at: string | null;
  user_crops: CropInfo | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Fetch all data in parallel for better performance
    const [userResult, farmResult, inventoryResult] = await Promise.all([
      // 1. Fetch user data
      supabaseClient.from("users").select("*").eq("id", userId).single(),

      // 2. Fetch farm plots with crops
      supabaseClient
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
        .order("plot_number"),

      // 3. Fetch user inventory
      supabaseClient
        .from("user_inventory")
        .select("*")
        .eq("user_id", userId)
        .order("acquired_at", { ascending: false }),
    ]);

    // Check for errors
    if (userResult.error) {
      throw new Error(`User fetch error: ${userResult.error.message}`);
    }
    if (farmResult.error) {
      throw new Error(`Farm fetch error: ${farmResult.error.message}`);
    }
    if (inventoryResult.error) {
      throw new Error(
        `Inventory fetch error: ${inventoryResult.error.message}`
      );
    }

    if (!userResult.data) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Construct the complete game state
    const gameState = {
      user: userResult.data,
      inventory: inventoryResult.data || [],
      farm: {
        plots: farmResult.data,
      },
    };

    return new Response(JSON.stringify({ data: gameState }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get_game_state:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
