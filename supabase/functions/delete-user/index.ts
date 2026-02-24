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

    // Get student record ID first (FK references use students.id, not user_id)
    const { data: studentRecord } = await adminClient.from("students").select("id").eq("user_id", userId).maybeSingle();
    
    if (studentRecord) {
      // Delete records that reference students.id
      await adminClient.from("attendance").delete().eq("student_id", studentRecord.id);
      await adminClient.from("marks").delete().eq("student_id", studentRecord.id);
      await adminClient.from("absent_notes").delete().eq("student_id", studentRecord.id);
      // Delete student record
      await adminClient.from("students").delete().eq("id", studentRecord.id);
    }

    // Delete teacher record if exists
    await adminClient.from("teachers").delete().eq("user_id", userId);
    
    // Delete study materials uploaded by this user
    await adminClient.from("study_materials").delete().eq("uploaded_by", userId);
    
    // Delete role and profile
    await adminClient.from("user_roles").delete().eq("user_id", userId);
    await adminClient.from("profiles").delete().eq("user_id", userId);

    // Delete from auth
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Delete user error:", error);
    const msg = error.message || "";
    const safeMessage = msg.includes("Cannot delete yourself")
      ? "Cannot delete yourself"
      : msg.includes("userId required")
      ? "User ID is required"
      : msg.includes("Unauthorized") || msg.includes("No auth header")
      ? "Unauthorized"
      : msg.includes("Only admin")
      ? "Insufficient permissions"
      : "An error occurred while deleting the user";
    return new Response(JSON.stringify({ error: safeMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
