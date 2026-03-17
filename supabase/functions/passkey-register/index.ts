import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function getRpId(req: Request, supabaseUrl: string): string {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).hostname;
    } catch {}
  }
  try { return new URL(supabaseUrl).hostname; } catch { return "localhost"; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseUser = createClient(supabaseUrl, supabaseKey, { global: { headers: { authorization: authHeader } } });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { action, credential } = await req.json();
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const rpId = getRpId(req, supabaseUrl);

    if (action === "get-options") {
      const challenge = generateChallenge();
      const { data: existing } = await supabaseAdmin.from("passkeys").select("credential_id").eq("user_id", user.id);

      const options = {
        challenge,
        rp: { name: "Hoysala Degree College", id: rpId },
        user: {
          id: btoa(user.id),
          name: user.email || user.id,
          displayName: user.user_metadata?.full_name || user.email || "User",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 60000,
        excludeCredentials: (existing || []).map((e: any) => ({ id: e.credential_id, type: "public-key" })),
      };

      return new Response(JSON.stringify({ options, challenge }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "register") {
      const { id, rawId, response: credResponse, type, name } = credential;

      const { error: insertError } = await supabaseAdmin.from("passkeys").insert({
        user_id: user.id,
        credential_id: rawId || id,
        public_key: credResponse.publicKey || credResponse.attestationObject || "",
        counter: 0,
        transports: credential.transports || [],
        name: name || "My Passkey",
      });

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("passkey-register error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
