import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, plotId, seedCode } = await req.json();

    if (!userId || !plotId || !seedCode) {
      throw new Error("userId, plotId, and seedCode are required");
    }

    // 1. Get user data
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("coin")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    // 2. Get seed type data
    const { data: seedType, error: seedError } = await supabaseClient
      .from("seed_types")
      .select("code, name, base_price, growth_time")
      .eq("code", seedCode)
      .single();

    if (seedError) throw seedError;
    if (!seedType) throw new Error("Seed type not found");

    // 3. Check if user has enough coins
    if (user.coin < seedType.base_price) {
      throw new Error("Not enough coins");
    }

    // 4. Check if plot exists and is unlocked
    const { data: plot, error: plotError } = await supabaseClient
      .from("farm_plots")
      .select("id, is_unlocked, user_id")
      .eq("id", plotId)
      .eq("user_id", userId)
      .single();

    if (plotError) throw plotError;
    if (!plot) throw new Error("Plot not found");
    if (!plot.is_unlocked) throw new Error("Plot is locked");

    // 5. Check if plot already has a crop
    const { data: existingCrop, error: existingCropError } =
      await supabaseClient
        .from("user_crops")
        .select("id")
        .eq("plot_id", plotId)
        .maybeSingle();

    if (existingCropError) throw existingCropError;
    if (existingCrop) throw new Error("Plot already has a crop");

    // 6. Calculate ready_at time
    const now = new Date();
    const readyAt = new Date(
      now.getTime() + seedType.growth_time * 60 * 60 * 1000
    );

    // 7. Deduct coins from user
    const newCoin = user.coin - seedType.base_price;
    const { error: updateUserError } = await supabaseClient
      .from("users")
      .update({ coin: newCoin, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateUserError) throw updateUserError;

    // 8. Create crop record
    const { data: newCrop, error: createCropError } = await supabaseClient
      .from("user_crops")
      .insert({
        user_id: userId,
        plot_id: plotId,
        seed_code: seedCode,
        planted_at: now.toISOString(),
        ready_at: readyAt.toISOString(),
        status: "growing",
      })
      .select()
      .single();

    if (createCropError) throw createCropError;

    // 9. Try to deduct seed from inventory (if exists)
    const { data: inventoryItem } = await supabaseClient
      .from("user_inventory")
      .select("id, quantity")
      .eq("user_id", userId)
      .eq("item_type", "seed")
      .eq("item_code", seedCode)
      .maybeSingle();

    if (inventoryItem && inventoryItem.quantity > 0) {
      const newQuantity = inventoryItem.quantity - 1;
      if (newQuantity > 0) {
        await supabaseClient
          .from("user_inventory")
          .update({ quantity: newQuantity })
          .eq("id", inventoryItem.id);
      } else {
        await supabaseClient
          .from("user_inventory")
          .delete()
          .eq("id", inventoryItem.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        crop: {
          id: newCrop.id,
          plotId: newCrop.plot_id,
          seedCode: newCrop.seed_code,
          plantedAt: newCrop.planted_at,
          readyAt: newCrop.ready_at,
          status: newCrop.status,
        },
        user: {
          coin: newCoin,
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
