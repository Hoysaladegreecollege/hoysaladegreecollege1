import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, applicationNumber, status } = await req.json();

    if (!email || !fullName || !applicationNumber || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isApproved = status === "approved";
    const isSubmitted = status === "submitted";
    const isRejected = status === "rejected";

    const subject = isApproved
      ? `🎉 Congratulations! Your Application ${applicationNumber} has been Approved`
      : isSubmitted
      ? `✅ Application Received — ${applicationNumber} | Hoysala Degree College`
      : `Application ${applicationNumber} - Status Update`;

    const html = isSubmitted ? `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">
        <div style="background:linear-gradient(135deg, #0a1628 0%, #1a3a6e 50%, #0a1628 100%);padding:48px 32px;text-align:center;">
          <div style="font-size:48px;margin-bottom:12px;">🎓</div>
          <h1 style="color:white;margin:0;font-size:26px;font-weight:700;">Application Received!</h1>
          <p style="color:rgba(255,255,255,0.65);margin:10px 0 0;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Hoysala Degree College</p>
        </div>
        <div style="padding:40px 32px;">
          <p style="font-size:17px;color:#1a202c;margin:0 0 8px;">Dear <strong>${fullName}</strong>,</p>
          <p style="font-size:15px;color:#4a5568;line-height:1.7;margin:16px 0;">
            Thank you for applying to <strong>Hoysala Degree College</strong>! We have successfully received your application and it is currently <strong style="color:#d97706;">under review</strong> by our admissions team.
          </p>
          <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;border-radius:16px;padding:24px;margin:24px 0;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#666;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Your Application Number</p>
            <p style="margin:0;font-size:32px;font-weight:800;color:#0a1628;letter-spacing:2px;">${applicationNumber}</p>
            <p style="margin:8px 0 0;font-size:12px;color:#666;">Save this number — you'll need it to track your application status</p>
          </div>
          <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin:20px 0;">
            <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0a1628;text-transform:uppercase;letter-spacing:0.5px;">What Happens Next?</p>
            <div style="margin-bottom:10px;display:flex;align-items:flex-start;">
              <span style="background:#0a1628;color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:12px;flex-shrink:0;">1</span>
              <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.5;">Our admissions team will <strong>review your documents</strong> within 2-3 working days</p>
            </div>
            <div style="margin-bottom:10px;display:flex;align-items:flex-start;">
              <span style="background:#0a1628;color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:12px;flex-shrink:0;">2</span>
              <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.5;">You will receive an <strong>email notification</strong> once your application is processed</p>
            </div>
            <div style="display:flex;align-items:flex-start;">
              <span style="background:#0a1628;color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:12px;flex-shrink:0;">3</span>
              <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.5;">Track your status anytime at our <strong>Application Status Portal</strong></p>
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:24px;margin-top:24px;">
            <p style="font-size:14px;color:#4a5568;margin:0 0 12px;">For any queries, please contact us:</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a href="tel:7676272167" style="display:inline-flex;align-items:center;background:#0a1628;color:white;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;">📞 7676272167</a>
              <a href="mailto:principal.hoysaladegreecollege@gmail.com" style="display:inline-flex;align-items:center;background:#f8fafc;color:#0a1628;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid #e2e8f0;">✉️ Email Us</a>
            </div>
          </div>
          <p style="font-size:14px;color:#4a5568;margin:28px 0 0;line-height:1.6;">
            Best regards,<br/>
            <strong style="color:#0a1628;">Admissions Team</strong><br/>
            <span style="font-size:12px;color:#94a3b8;">Hoysala Degree College · Affiliated to Bangalore University · BU 26</span>
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>` : `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;">
      <div style="max-width:600px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12);">
        <div style="background:${isApproved ? 'linear-gradient(135deg, #0a1628 0%, #1a3a6e 50%, #0a1628 100%)' : 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #7f1d1d 100%)'};padding:48px 32px;text-align:center;position:relative;">
          <div style="font-size:48px;margin-bottom:12px;">${isApproved ? '🎉' : '📋'}</div>
          <h1 style="color:white;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">${isApproved ? 'Application Approved!' : 'Application Status Update'}</h1>
          <p style="color:rgba(255,255,255,0.65);margin:10px 0 0;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Hoysala Degree College</p>
        </div>
        <div style="padding:40px 32px;">
          <p style="font-size:17px;color:#1a202c;margin:0 0 8px;">Dear <strong>${fullName}</strong>,</p>
          ${isApproved ? `
            <p style="font-size:15px;color:#4a5568;line-height:1.7;margin:16px 0;">
              We are absolutely delighted to inform you that your admission application has been <strong style="color:#16a34a;">APPROVED</strong>! Welcome to the Hoysala Degree College family. 🎓
            </p>
            <div style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:2px solid #86efac;border-radius:16px;padding:24px;margin:24px 0;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#666;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Your Application Number</p>
              <p style="margin:0;font-size:32px;font-weight:800;color:#0a1628;letter-spacing:2px;">${applicationNumber}</p>
            </div>
            <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin:20px 0;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#0a1628;text-transform:uppercase;letter-spacing:0.5px;">Next Steps</p>
              <div style="display:flex;align-items:flex-start;margin-bottom:10px;">
                <span style="background:#0a1628;color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:12px;flex-shrink:0;">1</span>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.5;">Visit the college campus with your <strong>original documents</strong></p>
              </div>
              <div style="display:flex;align-items:flex-start;margin-bottom:10px;">
                <span style="background:#0a1628;color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:12px;flex-shrink:0;">2</span>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.5;">Complete the <strong>fee payment</strong> at the accounts office</p>
              </div>
              <div style="display:flex;align-items:flex-start;">
                <span style="background:#0a1628;color:white;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:12px;flex-shrink:0;">3</span>
                <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.5;">Collect your <strong>student ID card</strong> and course materials</p>
              </div>
            </div>
          ` : `
            <p style="font-size:15px;color:#4a5568;line-height:1.7;margin:16px 0;">
              We regret to inform you that your application <strong>${applicationNumber}</strong> could not be approved at this time after careful review.
            </p>
            <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin:20px 0;">
              <p style="margin:0;font-size:14px;color:#dc2626;line-height:1.6;">
                This decision does not reflect on your potential or abilities. We sincerely encourage you to reach out to our admissions office for further clarification and to explore alternative pathways.
              </p>
            </div>
          `}
          <div style="border-top:1px solid #e2e8f0;padding-top:24px;margin-top:24px;">
            <p style="font-size:14px;color:#4a5568;margin:0 0 12px;">For any queries or assistance, please don't hesitate to contact us:</p>
            <div style="display:flex;gap:12px;flex-wrap:wrap;">
              <a href="tel:7676272167" style="display:inline-flex;align-items:center;background:#0a1628;color:white;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;">📞 7676272167</a>
              <a href="mailto:principal.hoysaladegreecollege@gmail.com" style="display:inline-flex;align-items:center;background:#f8fafc;color:#0a1628;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:600;border:1px solid #e2e8f0;">✉️ Email Us</a>
            </div>
          </div>
          <p style="font-size:14px;color:#4a5568;margin:28px 0 0;line-height:1.6;">
            Best regards,<br/>
            <strong style="color:#0a1628;">Admissions Team</strong><br/>
            <span style="font-size:12px;color:#94a3b8;">Hoysala Degree College · Affiliated to Bangalore University · BU 26</span>
          </p>
        </div>
        <div style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hoysala Degree College <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: data.message || "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, messageId: data.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
