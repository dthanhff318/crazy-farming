import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, itemType, itemCode, quantity } = await req.json();

    if (!userId || !itemType || !itemCode || !quantity) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get user data
    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("coin, level")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    // Get item data based on type
    let itemData: any;
    let itemPrice: number;
    let unlockLevel: number;

    if (itemType === "seed") {
      const { data, error } = await supabaseClient
        .from("seed_types")
        .select("*")
        .eq("code", itemCode)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Seed not found");

      itemData = data;
      itemPrice = data.base_price;
      unlockLevel = data.unlock_level;
    } else if (itemType === "animal") {
      const { data, error } = await supabaseClient
        .from("animal_types")
        .select("*")
        .eq("code", itemCode)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Animal not found");

      itemData = data;
      itemPrice = data.base_price;
      unlockLevel = data.unlock_level;
    } else {
      throw new Error("Invalid item type");
    }

    // Check level requirement
    if (userData.level < unlockLevel) {
      throw new Error(`Requires level ${unlockLevel}`);
    }

    // Calculate total cost
    const totalCost = itemPrice * quantity;

    // Check if user has enough coins
    if (userData.coin < totalCost) {
      throw new Error("Not enough coins");
    }

    // Start transaction: Deduct coins and add to inventory
    const { error: updateCoinError } = await supabaseClient
      .from("users")
      .update({ coin: userData.coin - totalCost })
      .eq("id", userId);

    if (updateCoinError) throw updateCoinError;

    // Check if item already exists in inventory
    const { data: existingItem } = await supabaseClient
      .from("user_inventory")
      .select("*")
      .eq("user_id", userId)
      .eq("item_type", itemType)
      .eq("item_code", itemCode)
      .single();

    if (existingItem) {
      // Update quantity
      const { error: updateError } = await supabaseClient
        .from("user_inventory")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (updateError) throw updateError;
    } else {
      // Insert new item
      const { error: insertError } = await supabaseClient
        .from("user_inventory")
        .insert({
          user_id: userId,
          item_type: itemType,
          item_code: itemCode,
          quantity: quantity,
        });

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        coins_left: userData.coin - totalCost,
        total_cost: totalCost,
        quantity: quantity,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
