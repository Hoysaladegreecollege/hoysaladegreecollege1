import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limiter - 5 OTP requests per minute per IP (critical for brute force prevention)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
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

// Cryptographically secure OTP generation
function generateOTP(): string {
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  const num = ((array[0] << 24) | (array[1] << 16) | (array[2] << 8) | array[3]) >>> 0;
  return String(num % 1000000).padStart(6, '0');
}

// Hash OTP using SHA-256 before storing
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// HTML escape to prevent injection in email templates
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait." }), {
        status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    // Validate inputs
    if (!action || typeof action !== "string") throw new Error("Invalid action");
    if (!request_id || typeof request_id !== "string" || request_id.length > 36) throw new Error("Invalid request");

    if (action === "send_otp") {
      const otp = generateOTP();
      const otpHash = await hashOTP(otp);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

      // Store only the hash, never the plaintext OTP
      const { error: updateErr } = await adminClient
        .from("pending_admin_requests")
        .update({ otp_code: otpHash, otp_expires_at: expiresAt })
        .eq("id", request_id);

      if (updateErr) throw new Error("Failed to set OTP");

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
        return new Response(JSON.stringify({ success: true, self_approve: true, otp }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: adminProfiles } = await adminClient
        .from("profiles")
        .select("email, full_name")
        .in("user_id", adminUserIds);

      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (!RESEND_API_KEY) throw new Error("Email service not configured");

      // Sanitize user-provided data before embedding in HTML
      const safeName = escapeHtml(request.full_name || "");
      const safeEmail = escapeHtml(request.email || "");

      for (const admin of (adminProfiles || [])) {
        const safeAdminName = escapeHtml(admin.full_name || "");
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
                  <p style="font-size:16px;color:#1a202c;">Dear <strong>${safeAdminName}</strong>,</p>
                  <p style="font-size:15px;color:#4a5568;line-height:1.7;">
                    An existing admin has requested to create a <strong style="color:#dc2626;">new Admin account</strong>. Your approval is needed.
                  </p>
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:20px 0;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#64748b;">NEW ADMIN DETAILS</p>
                    <p style="margin:0;font-size:15px;color:#1a202c;"><strong>Name:</strong> ${safeName}</p>
                    <p style="margin:4px 0 0;font-size:15px;color:#1a202c;"><strong>Email:</strong> ${safeEmail}</p>
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
      if (!otp_code || typeof otp_code !== "string" || otp_code.length !== 6) {
        throw new Error("Invalid OTP format");
      }

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

      // Hash the submitted OTP and compare with stored hash
      const submittedHash = await hashOTP(otp_code);

      // Constant-time comparison on hashes to prevent timing attacks
      const encoder = new TextEncoder();
      const a = encoder.encode(request.otp_code);
      const b = encoder.encode(submittedHash);
      if (a.length !== b.length) throw new Error("Invalid OTP code");
      let mismatch = 0;
      for (let i = 0; i < a.length; i++) {
        mismatch |= a[i] ^ b[i];
      }
      if (mismatch !== 0) throw new Error("Invalid OTP code");

      // Mark as approved and clear OTP hash
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
