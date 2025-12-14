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
      .select("coin")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!userData) throw new Error("User not found");

    // Get inventory item
    const { data: inventoryItem, error: inventoryError } = await supabaseClient
      .from("user_inventory")
      .select("*")
      .eq("user_id", userId)
      .eq("item_type", itemType)
      .eq("item_code", itemCode)
      .single();

    if (inventoryError) throw new Error("Item not found in inventory");
    if (!inventoryItem) throw new Error("Item not found in inventory");

    // Check if user has enough quantity
    if (inventoryItem.quantity < quantity) {
      throw new Error("Not enough quantity in inventory");
    }

    // Get item sell price
    let sellPrice: number;

    if (itemType === "seed") {
      const { data, error } = await supabaseClient
        .from("seed_types")
        .select("sell_price")
        .eq("code", itemCode)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Seed not found");

      sellPrice = data.sell_price;
    } else if (itemType === "animal") {
      const { data, error } = await supabaseClient
        .from("animal_types")
        .select("sell_price")
        .eq("code", itemCode)
        .single();

      if (error) throw error;
      if (!data) throw new Error("Animal not found");

      sellPrice = data.sell_price;
    } else {
      throw new Error("Invalid item type");
    }

    // Calculate total earnings
    const totalEarnings = sellPrice * quantity;

    // Start transaction: Add coins and remove from inventory
    const { error: updateCoinError } = await supabaseClient
      .from("users")
      .update({ coin: userData.coin + totalEarnings })
      .eq("id", userId);

    if (updateCoinError) throw updateCoinError;

    // Update inventory quantity
    const newQuantity = inventoryItem.quantity - quantity;

    if (newQuantity === 0) {
      // Remove item from inventory if quantity is 0
      const { error: deleteError } = await supabaseClient
        .from("user_inventory")
        .delete()
        .eq("id", inventoryItem.id);

      if (deleteError) throw deleteError;
    } else {
      // Update quantity
      const { error: updateError } = await supabaseClient
        .from("user_inventory")
        .update({ quantity: newQuantity })
        .eq("id", inventoryItem.id);

      if (updateError) throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        coins_earned: totalEarnings,
        new_coin_balance: userData.coin + totalEarnings,
        quantity_sold: quantity,
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
