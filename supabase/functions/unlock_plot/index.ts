import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Calculate unlock price based on plot number
const calculateUnlockPrice = (plotNumber: number): number => {
  // Plots 1-3: Free (already unlocked)
  // Plot 4: 100 coins
  // Plot 5: 200 coins
  // Plot 6: 300 coins
  // Additional plots: (plotNumber - 3) * 100
  if (plotNumber <= 3) return 0;
  return (plotNumber - 3) * 100;
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

    const { userId, plotId } = await req.json();

    if (!userId || !plotId) {
      throw new Error("userId and plotId are required");
    }

    // 1. Get plot data
    const { data: plot, error: plotError } = await supabaseClient
      .from("farm_plots")
      .select("id, user_id, plot_number, is_unlocked")
      .eq("id", plotId)
      .eq("user_id", userId)
      .single();

    if (plotError) throw plotError;
    if (!plot) throw new Error("Plot not found");

    // 2. Check if plot is already unlocked
    if (plot.is_unlocked) {
      throw new Error("Plot is already unlocked");
    }

    // 3. Calculate unlock price
    const unlockPrice = calculateUnlockPrice(plot.plot_number);

    // 4. Get user data
    const { data: user, error: userError } = await supabaseClient
      .from("users")
      .select("coin")
      .eq("id", userId)
      .single();

    if (userError) throw userError;
    if (!user) throw new Error("User not found");

    // 5. Check if user has enough coins
    if (user.coin < unlockPrice) {
      throw new Error(
        `Not enough coins. Need ${unlockPrice}, have ${user.coin}`
      );
    }

    // 6. Deduct coins from user
    const newCoin = user.coin - unlockPrice;
    const { error: updateUserError } = await supabaseClient
      .from("users")
      .update({ coin: newCoin, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (updateUserError) throw updateUserError;

    // 7. Unlock the plot
    const now = new Date().toISOString();
    const { data: unlockedPlot, error: unlockError } = await supabaseClient
      .from("farm_plots")
      .update({
        is_unlocked: true,
        unlocked_at: now,
      })
      .eq("id", plotId)
      .select()
      .single();

    if (unlockError) throw unlockError;

    return new Response(
      JSON.stringify({
        success: true,
        plot: {
          id: unlockedPlot.id,
          plotNumber: unlockedPlot.plot_number,
          isUnlocked: unlockedPlot.is_unlocked,
          unlockedAt: unlockedPlot.unlocked_at,
        },
        user: {
          coin: newCoin,
        },
        unlockPrice,
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
