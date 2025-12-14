import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key (bypass RLS)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get userId from request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId parameter" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Fetch user buildings with building type info
    const { data, error } = await supabaseClient
      .from("user_buildings")
      .select(
        `
        *,
        building_type:building_types!user_buildings_building_code_fkey(*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    // Calculate current capacity for each building based on level
    const buildingsWithCapacity = (data || []).map((building: any) => {
      const levelConfig = building.building_type.level_config;
      const currentLevel = building.current_level.toString();
      const current_capacity = levelConfig[currentLevel]?.capacity || 0;

      return {
        ...building,
        current_capacity,
      };
    });

    return new Response(
      JSON.stringify({
        data: buildingsWithCapacity,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
