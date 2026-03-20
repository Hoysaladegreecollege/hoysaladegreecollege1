import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  let binary = "";
  array.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function getRpId(req: Request, supabaseUrl: string): string {
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).hostname;
    } catch {
      // ignore
    }
  }
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return "localhost";
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("passkey-register: No auth header");
      return new Response(JSON.stringify({ error: "No auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Use getClaims for signing-keys compatibility
    const supabaseUser = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseUser.auth.getClaims(token);

    if (claimsError || !claimsData?.claims?.sub) {
      console.error("passkey-register: getClaims failed", claimsError);
      // Fallback to getUser
      const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
      if (userError || !user) {
        console.error("passkey-register: getUser also failed", userError);
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Use user from getUser fallback
      return await handleRequest(req, user.id, user.email || user.id, user.user_metadata?.full_name || user.email || "User", supabaseUrl, serviceKey);
    }

    const userId = claimsData.claims.sub as string;
    const email = (claimsData.claims.email as string) || userId;
    
    // Get full user data for display name
    const { data: { user: fullUser } } = await supabaseUser.auth.getUser();
    const displayName = fullUser?.user_metadata?.full_name || email || "User";

    return await handleRequest(req, userId, email, displayName, supabaseUrl, serviceKey);
  } catch (err) {
    console.error("passkey-register error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function handleRequest(req: Request, userId: string, email: string, displayName: string, supabaseUrl: string, serviceKey: string) {
  const { action, credential } = await req.json();
  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  const rpId = getRpId(req, supabaseUrl);

  if (action === "get-options") {
    const challenge = generateChallenge();
    const { data: existing } = await supabaseAdmin.from("passkeys").select("credential_id").eq("user_id", userId);

    const options = {
      challenge,
      rp: { name: "Hoysala Degree College", id: rpId },
      user: {
        id: toBase64Url(userId),
        name: email,
        displayName: displayName,
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

    return new Response(JSON.stringify({ options, challenge }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (action === "register") {
    const { id, rawId, response: credResponse, name } = credential || {};
    if (!id && !rawId) {
      return new Response(JSON.stringify({ error: "Invalid credential id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await supabaseAdmin.from("passkeys").insert({
      user_id: userId,
      credential_id: rawId || id,
      public_key: credResponse?.publicKey || credResponse?.attestationObject || "",
      counter: 0,
      transports: credential?.transports || [],
      name: name || "My Passkey",
    });

    if (insertError) {
      console.error("passkey-register insert error:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
