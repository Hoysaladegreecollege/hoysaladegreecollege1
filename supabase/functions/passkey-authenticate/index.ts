import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const { action, credentialId, email } = await req.json();

    if (action === "get-options") {
      // Generate authentication options
      const challenge = generateChallenge();

      // If email provided, get user's passkeys
      let allowCredentials: any[] = [];
      if (email) {
        const { data: userData } = await supabaseAdmin.auth.admin.listUsers();
        const user = userData?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
        if (user) {
          const { data: passkeys } = await supabaseAdmin.from("passkeys").select("credential_id, transports").eq("user_id", user.id);
          allowCredentials = (passkeys || []).map((p: any) => ({
            id: p.credential_id,
            type: "public-key",
            transports: p.transports || [],
          }));
        }
      }

      return new Response(JSON.stringify({
        challenge,
        rpId: new URL(req.headers.get("origin") || supabaseUrl).hostname,
        allowCredentials,
        userVerification: "preferred",
        timeout: 60000,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "authenticate") {
      // Find user by credential ID
      const { data: passkey } = await supabaseAdmin.from("passkeys")
        .select("*")
        .eq("credential_id", credentialId)
        .single();

      if (!passkey) {
        return new Response(JSON.stringify({ error: "Passkey not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Update counter
      await supabaseAdmin.from("passkeys").update({ counter: passkey.counter + 1 }).eq("id", passkey.id);

      // Get user email and generate a magic link / sign in token
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(passkey.user_id);
      if (!userData?.user?.email) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Generate a sign-in link
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: userData.user.email,
      });

      if (linkError) {
        return new Response(JSON.stringify({ error: linkError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({
        success: true,
        token: linkData?.properties?.hashed_token,
        email: userData.user.email,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
