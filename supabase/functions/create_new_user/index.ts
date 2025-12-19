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

const CONFIG_NEW_USER = {
  name: "",
  level: 1,
  exp: 0,
  coin: 8,
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
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
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

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: true,
          user: existingUser,
          message: "User already exists",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create new user and farm plots
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

    const [userData] = await Promise.all([
      supabaseClient
        .from("users")
        .insert({
          id: userId,
          ...CONFIG_NEW_USER,
        })
        .select()
        .single(),
      ...mappingPlots,
    ]);

    if (userData.error) {
      throw new Error("Failed to create user or farm plots");
    }

    const user = userData.data;

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
