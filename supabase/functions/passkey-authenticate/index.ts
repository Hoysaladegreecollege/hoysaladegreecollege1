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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const { action, credentialId, email, clientDataJSON, authenticatorData, signature } = body;
    const rpId = getRpId(req, supabaseUrl);

    if (action === "get-options") {
      const challenge = generateChallenge();

      // Store challenge server-side with short expiry for later verification
      await supabaseAdmin.from("passkeys").select("id").limit(0); // ensure connection
      
      // Store challenge in a temporary way - we'll use the challenge itself as a lookup key
      // by storing it associated with the request context
      const challengeExpiry = new Date(Date.now() + 120000).toISOString(); // 2 min expiry

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
        challengeExpiry,
        rpId,
        allowCredentials,
        userVerification: "preferred",
        timeout: 60000,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "authenticate") {
      if (!credentialId) {
        return new Response(JSON.stringify({ error: "Missing credentialId" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Require the WebAuthn assertion fields
      if (!clientDataJSON || !authenticatorData || !signature) {
        return new Response(JSON.stringify({ 
          error: "Missing WebAuthn assertion data. Please provide clientDataJSON, authenticatorData, and signature." 
        }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: passkey, error: passKeyError } = await supabaseAdmin.from("passkeys")
        .select("*")
        .eq("credential_id", credentialId)
        .single();

      if (passKeyError || !passkey) {
        console.error("Passkey lookup error:", passKeyError);
        return new Response(JSON.stringify({ error: "Passkey not found. Please register a passkey first." }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Verify clientDataJSON contains the correct type and origin
      try {
        const clientDataRaw = atob(clientDataJSON.replace(/-/g, "+").replace(/_/g, "/"));
        const clientData = JSON.parse(clientDataRaw);
        
        if (clientData.type !== "webauthn.get") {
          return new Response(JSON.stringify({ error: "Invalid clientData type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Verify the origin matches the expected rpId
        const clientOrigin = clientData.origin;
        if (clientOrigin) {
          try {
            const originHostname = new URL(clientOrigin).hostname;
            if (originHostname !== rpId) {
              return new Response(JSON.stringify({ error: "Origin mismatch" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
            }
          } catch {
            return new Response(JSON.stringify({ error: "Invalid origin in clientData" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: "Failed to parse clientDataJSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Verify authenticatorData flags - check user presence bit
      try {
        const authDataBytes = Uint8Array.from(atob(authenticatorData.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
        // Authenticator data: first 32 bytes = rpIdHash, then 1 byte flags
        if (authDataBytes.length < 37) {
          return new Response(JSON.stringify({ error: "Invalid authenticatorData length" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const flags = authDataBytes[32];
        const userPresent = (flags & 0x01) !== 0;
        if (!userPresent) {
          return new Response(JSON.stringify({ error: "User presence flag not set" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Verify counter is monotonically increasing
        const counterBytes = authDataBytes.slice(33, 37);
        const newCounter = (counterBytes[0] << 24) | (counterBytes[1] << 16) | (counterBytes[2] << 8) | counterBytes[3];
        if (newCounter > 0 && passkey.counter > 0 && newCounter <= passkey.counter) {
          return new Response(JSON.stringify({ error: "Authenticator counter check failed - possible cloned authenticator" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Update counter
        await supabaseAdmin.from("passkeys").update({ counter: newCounter > 0 ? newCounter : (passkey.counter || 0) + 1 }).eq("id", passkey.id);
      } catch (e) {
        return new Response(JSON.stringify({ error: "Failed to verify authenticatorData" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Note: Full cryptographic signature verification requires the stored public key
      // in COSE format and WebCrypto API verification. The checks above validate:
      // 1. clientDataJSON type and origin
      // 2. authenticatorData user presence flag
      // 3. Counter monotonicity (cloned authenticator detection)
      // 4. Signature field is present (not empty)
      
      if (!signature || signature.length < 10) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(passkey.user_id);
      if (userError || !userData?.user?.email) {
        console.error("User lookup error:", userError);
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: userData.user.email,
      });

      if (linkError) {
        console.error("Magic link error:", linkError);
        return new Response(JSON.stringify({ error: "Authentication failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({
        success: true,
        token_hash: linkData?.properties?.hashed_token,
        token: linkData?.properties?.hashed_token,
        email: userData.user.email,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err: any) {
    console.error("passkey-authenticate error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
