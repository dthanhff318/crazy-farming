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
    const { userId, name } = await req.json();

    if (!userId || !name) {
      return new Response(
        JSON.stringify({ error: "Missing userId or name" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
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
      // User doesn't exist, create new user
      const { data, error } = await supabaseClient
        .from("users")
        .insert({
          id: userId,
          name,
          level: 1,
          exp: 0,
          coin: 100,
        })
        .select()
        .single();

      if (error) throw error;
      user = data;
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
