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

    // Check if user already owns this building
    const { data: existingBuilding } = await supabaseClient
      .from("user_buildings")
      .select("*")
      .eq("user_id", userId)
      .eq("building_code", buildingCode)
      .single();

    if (existingBuilding) {
      return new Response(
        JSON.stringify({ error: "You already own this building" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get building type info
    const { data: buildingType, error: buildingError } = await supabaseClient
      .from("building_types")
      .select("*")
      .eq("code", buildingCode)
      .single();

    if (buildingError || !buildingType) {
      return new Response(
        JSON.stringify({ error: "Building type not found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

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

    // Check if user level meets unlock requirement
    if (user.level < buildingType.unlock_level) {
      return new Response(
        JSON.stringify({
          error: `Requires level ${buildingType.unlock_level}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check if user has enough coins
    if (user.coin < buildingType.base_price) {
      return new Response(
        JSON.stringify({
          error: `Not enough coins. Need ${buildingType.base_price}, have ${user.coin}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Create user building
    const { data: newBuilding, error: insertError } = await supabaseClient
      .from("user_buildings")
      .insert({
        user_id: userId,
        building_code: buildingCode,
        current_level: 1,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Deduct coins from user
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({
        coin: user.coin - buildingType.base_price,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({
        data: newBuilding,
        coins_left: user.coin - buildingType.base_price,
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
