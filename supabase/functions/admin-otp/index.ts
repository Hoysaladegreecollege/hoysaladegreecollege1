import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function generateOTP(): string {
  const chars = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !caller) throw new Error("Unauthorized");

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .maybeSingle();

    if (!callerRole || callerRole.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    const { action, request_id, otp_code } = await req.json();

    if (action === "send_otp") {
      // Generate OTP and store it, then send email to all OTHER admins
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

      // Update the request with OTP
      const { error: updateErr } = await adminClient
        .from("pending_admin_requests")
        .update({ otp_code: otp, otp_expires_at: expiresAt })
        .eq("id", request_id);

      if (updateErr) throw new Error("Failed to set OTP");

      // Get the request details
      const { data: request } = await adminClient
        .from("pending_admin_requests")
        .select("*")
        .eq("id", request_id)
        .single();

      if (!request) throw new Error("Request not found");

      // Get all admin emails except the requester
      const { data: adminRoles } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      const adminUserIds = (adminRoles || [])
        .map(r => r.user_id)
        .filter(id => id !== request.requester_id);

      if (adminUserIds.length === 0) {
        // No other admins - allow self-approval for first admin
        return new Response(JSON.stringify({ success: true, self_approve: true, otp }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Get admin emails
      const { data: adminProfiles } = await adminClient
        .from("profiles")
        .select("email, full_name")
        .in("user_id", adminUserIds);

      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (!RESEND_API_KEY) throw new Error("Email service not configured");

      // Send OTP email to all other admins
      for (const admin of (adminProfiles || [])) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Hoysala Degree College <onboarding@resend.dev>",
            to: [admin.email],
            subject: `🔐 Admin Approval Required — OTP Verification`,
            html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;">
              <div style="max-width:600px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">
                <div style="background:linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #7f1d1d 100%);padding:48px 32px;text-align:center;">
                  <div style="font-size:48px;margin-bottom:12px;">🔐</div>
                  <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">Admin Approval Required</h1>
                  <p style="color:rgba(255,255,255,0.7);margin:10px 0 0;font-size:14px;">Two-Factor Authentication</p>
                </div>
                <div style="padding:40px 32px;">
                  <p style="font-size:16px;color:#1a202c;">Dear <strong>${admin.full_name}</strong>,</p>
                  <p style="font-size:15px;color:#4a5568;line-height:1.7;">
                    An existing admin has requested to create a <strong style="color:#dc2626;">new Admin account</strong>. Your approval is needed.
                  </p>
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;">NEW ADMIN DETAILS</p>
                    <p style="margin:0;font-size:15px;color:#1a202c;"><strong>Name:</strong> ${request.full_name}</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#1a202c;"><strong>Email:</strong> ${request.email}</p>
                  </div>
                  <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:16px;padding:24px;margin:24px 0;text-align:center;">
                    <p style="margin:0 0 8px;font-size:12px;color:#92400e;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Your Approval OTP Code</p>
                    <p style="margin:0;font-size:40px;font-weight:800;color:#92400e;letter-spacing:8px;">${otp}</p>
                    <p style="margin:10px 0 0;font-size:12px;color:#b45309;">This code expires in 10 minutes</p>
                  </div>
                  <p style="font-size:14px;color:#4a5568;line-height:1.6;">
                    Share this OTP with the requesting admin <strong>only if you approve</strong> the creation of this new admin account. If you did not expect this request, please ignore this email and investigate.
                  </p>
                  <div style="border-top:1px solid #e2e8f0;padding-top:20px;margin-top:24px;">
                    <p style="margin:0;font-size:12px;color:#94a3b8;">⚠️ This is a security-critical action. Only share the OTP if you have personally verified the request.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>`,
          }),
        });
      }

      return new Response(JSON.stringify({ success: true, admins_notified: adminProfiles?.length || 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === "verify_otp") {
      // Verify OTP and mark request as approved
      const { data: request } = await adminClient
        .from("pending_admin_requests")
        .select("*")
        .eq("id", request_id)
        .single();

      if (!request) throw new Error("Request not found");
      if (request.status !== "pending") throw new Error("Request already processed");
      if (!request.otp_code) throw new Error("No OTP generated for this request");
      
      if (new Date(request.otp_expires_at) < new Date()) {
        throw new Error("OTP has expired. Please request a new one.");
      }

      if (request.otp_code !== otp_code) {
        throw new Error("Invalid OTP code");
      }

      // Mark as approved
      const { error: approveErr } = await adminClient
        .from("pending_admin_requests")
        .update({
          status: "approved",
          approved_by: caller.id,
          approved_at: new Date().toISOString(),
          otp_code: null,
          otp_expires_at: null,
        })
        .eq("id", request_id);

      if (approveErr) throw new Error("Failed to approve request");

      return new Response(JSON.stringify({ success: true, approved: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Admin OTP error:", error.message);
    const msg = error.message || "";
    const isAuth = msg.includes("Unauthorized") || msg.includes("Insufficient");
    return new Response(JSON.stringify({ error: isAuth ? msg : "Operation failed. Please try again." }), {
      status: isAuth ? 403 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
