import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
    if (callerRole?.role !== "admin") throw new Error("Only admin can create staff");

    const body = await req.json();
    const { role, email, password, full_name, phone, employee_id, department_id, qualification, experience, subjects } = body;

    if (!email || !password || !full_name) throw new Error("Email, password, and full name are required");
    if (!role || !["teacher", "principal"].includes(role)) throw new Error("Role must be teacher or principal");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Invalid email format");
    if (password.length < 1) throw new Error("Password is required");
    if (full_name.length > 255) throw new Error("Name too long");

    // Create auth user with email confirmed
    const { data: authData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role },
    });
    if (createError) throw createError;
    if (!authData.user) throw new Error("Failed to create user");

    const userId = authData.user.id;

    // Wait for handle_new_user trigger
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update profile with phone
    if (phone) {
      await adminClient.from("profiles").update({ phone }).eq("user_id", userId);
    }

    // For teachers, update teacher record with details
    if (role === "teacher") {
      const teacherUpdate: Record<string, any> = {};
      if (employee_id) teacherUpdate.employee_id = employee_id;
      if (department_id) teacherUpdate.department_id = department_id;
      if (qualification) teacherUpdate.qualification = qualification;
      if (experience) teacherUpdate.experience = experience;
      if (subjects) {
        const subjectsList = typeof subjects === "string"
          ? subjects.split(",").map((s: string) => s.trim()).filter(Boolean)
          : Array.isArray(subjects) ? subjects : [];
        teacherUpdate.subjects = subjectsList;
      }
      if (Object.keys(teacherUpdate).length > 0) {
        const { error: teacherError } = await adminClient.from("teachers").update(teacherUpdate).eq("user_id", userId);
        if (teacherError) {
          console.error("Teacher update error:", teacherError);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Create staff error:", error);
    const msg = error.message || "";
    const safeMessage = msg.includes("Unauthorized") || msg.includes("No auth header")
      ? "Unauthorized"
      : msg.includes("Only admin")
      ? "Insufficient permissions"
      : msg.includes("already been registered") || msg.includes("already exists")
      ? "A user with this email already exists"
      : msg;
    return new Response(JSON.stringify({ error: safeMessage }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
