import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Experience required for each level (simple formula: level * 100)
const getExpForLevel = (level: number): number => level * 100;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, cropId } = await req.json();

    if (!userId || !cropId) {
      throw new Error("userId and cropId are required");
    }

    // 1. Get crop data
    const { data: crop, error: cropError } = await supabaseClient
      .from("user_crops")
      .select(
        `
        id,
        user_id,
        seed_code,
        status,
        seed_types (
          name,
          harvest_value
        )
      `
      )
      .eq("id", cropId)
      .eq("user_id", userId)
      .single();

    if (cropError) throw cropError;
    if (!crop) throw new Error("Crop not found");

    // 2. Check if crop is ready
    if (crop.status !== "ready") {
      throw new Error("Crop is not ready to harvest");
    }

    // 3. Get user data
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("coin, exp, level")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    // 4. Calculate rewards
    const harvestValue = crop.seed_types.harvest_value;
    const expGain = Math.floor(harvestValue / 5); // 1 EXP per 5 coins

    const newCoin = user.coin + harvestValue;
    const newExp = user.exp + expGain;

    // 5. Check for level up
    let newLevel = user.level;
    let leveledUp = false;

    while (newExp >= getExpForLevel(newLevel + 1)) {
      newLevel++;
      leveledUp = true;
    }

    // 6. Update user
    const { error: updateUserError } = await supabaseClient
      .from("users")
      .update({
        coin: newCoin,
        exp: newExp,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateUserError) throw updateUserError;

    // 7. Delete crop (harvested)
    const { error: deleteCropError } = await supabaseClient
      .from("user_crops")
      .delete()
      .eq("id", cropId);

    if (deleteCropError) throw deleteCropError;

    return new Response(
      JSON.stringify({
        success: true,
        harvested: {
          seedCode: crop.seed_code,
          seedName: crop.seed_types.name,
          harvestValue,
          exp: expGain,
        },
        user: {
          coin: newCoin,
          exp: newExp,
          level: newLevel,
          leveledUp,
        },
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
