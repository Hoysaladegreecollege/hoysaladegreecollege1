import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No auth header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !caller) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerRole } = await adminClient.from("user_roles").select("role").eq("user_id", caller.id).maybeSingle();
    if (callerRole?.role !== "admin") throw new Error("Only admin can reset passwords");

    const { userId, newPassword } = await req.json();
    if (!userId) throw new Error("userId required");
    if (!newPassword || newPassword.length < 8) throw new Error("Password must be at least 8 characters");
    if (!/[A-Z]/.test(newPassword)) throw new Error("Password must contain an uppercase letter");
    if (!/[a-z]/.test(newPassword)) throw new Error("Password must contain a lowercase letter");
    if (!/[0-9]/.test(newPassword)) throw new Error("Password must contain a number");

    const { error } = await adminClient.auth.admin.updateUserById(userId, { password: newPassword });
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    const msg = error.message || "";
    const safeMessage = msg.includes("Unauthorized") || msg.includes("No auth header")
      ? "Unauthorized"
      : msg.includes("Only admin")
      ? "Insufficient permissions"
      : msg.includes("Password must")
      ? msg
      : msg.includes("userId required")
      ? "User ID is required"
      : "An error occurred while resetting the password";
    return new Response(JSON.stringify({ error: safeMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
