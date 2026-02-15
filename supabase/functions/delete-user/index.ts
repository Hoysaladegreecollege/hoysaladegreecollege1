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
    if (callerRole?.role !== "admin") throw new Error("Only admin can delete users");

    const { userId } = await req.json();
    if (!userId) throw new Error("userId required");
    if (userId === caller.id) throw new Error("Cannot delete yourself");

    // Delete related data first (order matters for FK constraints)
    await adminClient.from("attendance").delete().eq("student_id", userId);
    await adminClient.from("marks").delete().eq("student_id", userId);
    await adminClient.from("absent_notes").delete().eq("student_id", userId);
    
    // Get student record ID to delete attendance/marks by student table ID
    const { data: studentRecord } = await adminClient.from("students").select("id").eq("user_id", userId).maybeSingle();
    if (studentRecord) {
      await adminClient.from("attendance").delete().eq("student_id", studentRecord.id);
      await adminClient.from("marks").delete().eq("student_id", studentRecord.id);
      await adminClient.from("absent_notes").delete().eq("student_id", studentRecord.id);
    }
    
    await adminClient.from("students").delete().eq("user_id", userId);
    await adminClient.from("teachers").delete().eq("user_id", userId);
    await adminClient.from("user_roles").delete().eq("user_id", userId);
    await adminClient.from("profiles").delete().eq("user_id", userId);

    // Delete from auth
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Delete user error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
