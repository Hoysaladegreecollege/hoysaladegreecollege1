import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check caller is admin/teacher/principal
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!callerRole || !["admin", "teacher", "principal"].includes(callerRole.role)) {
      throw new Error("Insufficient permissions");
    }

    const { action, studentIds, fromSemester, toSemester, courseId } = await req.json();

    if (action === "notify_promotion") {
      if (!studentIds?.length || !fromSemester || !toSemester) {
        throw new Error("Missing required fields");
      }

      // Get student details with profiles
      const { data: students } = await adminClient
        .from("students")
        .select("id, user_id, roll_number")
        .in("id", studentIds);

      if (!students?.length) {
        return new Response(JSON.stringify({ success: true, notified: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const userIds = students.map(s => s.user_id);
      const { data: profiles } = await adminClient
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);

      if (!RESEND_API_KEY) {
        console.error("RESEND_API_KEY not found");
        return new Response(JSON.stringify({ success: true, notified: 0, reason: "Email not configured" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let notified = 0;
      for (const student of students) {
        const profile = profiles?.find(p => p.user_id === student.user_id);
        if (!profile?.email) continue;

        try {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Hoysala Degree College <onboarding@resend.dev>",
              to: [profile.email],
              subject: `🎓 Semester Promotion - You've been promoted to Semester ${toSemester}!`,
              html: `
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"></head>
                <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;">
                  <div style="max-width:520px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.08);">
                    <div style="background:linear-gradient(135deg, #0a1628 0%, #1a3a6e 60%, #0a1628 100%);padding:36px 32px;text-align:center;">
                      <div style="font-size:48px;margin-bottom:8px;">🎓</div>
                      <h1 style="color:white;margin:0;font-size:22px;font-weight:800;">Semester Promotion</h1>
                      <p style="color:rgba(255,255,255,0.5);margin:8px 0 0;font-size:13px;">Hoysala Degree College</p>
                    </div>
                    <div style="padding:32px;">
                      <p style="font-size:16px;color:#1a202c;">Dear <strong>${profile.full_name}</strong>,</p>
                      <p style="font-size:15px;color:#4a5568;line-height:1.7;">
                        Congratulations! You have been <strong style="color:#16a34a;">promoted</strong> from 
                        <strong>Semester ${fromSemester}</strong> to <strong>Semester ${toSemester}</strong>.
                      </p>
                      <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:16px;padding:24px;margin:20px 0;text-align:center;">
                        <div style="display:inline-block;margin:0 12px;">
                          <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">From</p>
                          <p style="margin:4px 0 0;font-size:28px;font-weight:800;color:#94a3b8;">S${fromSemester}</p>
                        </div>
                        <span style="font-size:24px;color:#16a34a;">→</span>
                        <div style="display:inline-block;margin:0 12px;">
                          <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">To</p>
                          <p style="margin:4px 0 0;font-size:28px;font-weight:800;color:#16a34a;">S${toSemester}</p>
                        </div>
                      </div>
                      <p style="font-size:14px;color:#4a5568;line-height:1.6;">
                        Your new semester details are now updated in your student portal. Please check your dashboard for the latest timetable and announcements.
                      </p>
                    </div>
                    <div style="text-align:center;padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                      <p style="font-size:11px;color:#94a3b8;margin:0;">📞 7676272167 | 📧 principal.hoysaladegreecollege@gmail.com</p>
                    </div>
                  </div>
                </body>
                </html>`,
            }),
          });
          notified++;
        } catch (e) {
          console.error("Failed to send promotion email to", profile.email, e);
        }
      }

      return new Response(JSON.stringify({ success: true, notified }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Promotion notification error:", error.message);
    return new Response(JSON.stringify({ error: "Operation failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
