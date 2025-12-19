import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const coordinates = [
  [-7, 8],
  [-6, 8],
  [-5, 8],
  [-7, 7],
  [-6, 7],
  [-5, 7],
];

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
    const { userId, name } = await req.json();

    if (!userId || !name) {
      return new Response(JSON.stringify({ error: "Missing userId or name" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseClient
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    let user;

    if (existingUser) {
      // User exists, update the name
      const { data, error } = await supabaseClient
        .from("users")
        .update({ name })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      user = data;
    } else {
      // User doesn't exist, create new user and related data

      const mappingPlots = coordinates.map(([x, y], index) =>
        supabaseClient.from("farm_plots").insert({
          user_id: userId,
          plot_number: index + 1,
          position_x: x,
          position_y: y,
          is_unlocked: true,
          unlocked_at: new Date().toISOString(),
        })
      );

      const [userData, farmPlotsData] = await Promise.all([
        supabaseClient.from("users").insert({
          id: userId,
          name,
          level: 1,
          exp: 0,
          coin: 0,
        }),
        ...mappingPlots,
      ]);

      if (userData.error || farmPlotsData.error) {
        throw new Error("Failed to create user or farm plots");
      }

      user = userData.data;
    }

    return new Response(
      JSON.stringify({
        data: user,
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
