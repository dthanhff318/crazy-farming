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

    // Get request body
    const { userId, buildingCode } = await req.json();

    if (!userId || !buildingCode) {
      return new Response(
        JSON.stringify({ error: "Missing userId or buildingCode" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get user building
    const { data: userBuilding, error: buildingError } = await supabaseClient
      .from("user_buildings")
      .select("*")
      .eq("user_id", userId)
      .eq("building_code", buildingCode)
      .single();

    if (buildingError || !userBuilding) {
      return new Response(
        JSON.stringify({ error: "You don't own this building" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Get building type info
    const { data: buildingType, error: typeError } = await supabaseClient
      .from("building_types")
      .select("*")
      .eq("code", buildingCode)
      .single();

    if (typeError || !buildingType) {
      return new Response(
        JSON.stringify({ error: "Building type not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Get next level info
    const currentLevel = userBuilding.current_level;
    const nextLevel = currentLevel + 1;
    const levelConfig = buildingType.level_config;

    if (!levelConfig[nextLevel.toString()]) {
      return new Response(
        JSON.stringify({ error: "Building is already at max level" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const upgradePrice = levelConfig[nextLevel.toString()].upgrade_price;

    // Get user data
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Check if user has enough coins
    if (user.coin < upgradePrice) {
      return new Response(
        JSON.stringify({
          error: `Not enough coins. Need ${upgradePrice}, have ${user.coin}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Upgrade building
    const { data: upgradedBuilding, error: upgradeError } =
      await supabaseClient
        .from("user_buildings")
        .update({
          current_level: nextLevel,
        })
        .eq("id", userBuilding.id)
        .select()
        .single();

    if (upgradeError) throw upgradeError;

    // Deduct coins from user
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({
        coin: user.coin - upgradePrice,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        data: upgradedBuilding,
        new_level: nextLevel,
        new_capacity: levelConfig[nextLevel.toString()].capacity,
        coins_left: user.coin - upgradePrice,
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
