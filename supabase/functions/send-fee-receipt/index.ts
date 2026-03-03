import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentEmail, studentName, receiptNumber, amount, paymentMethod, courseName, rollNumber, remarks, date, semester } = await req.json();

    if (!studentEmail || !amount || !receiptNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not found");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f0f4f8;">
        <div style="max-width:520px;margin:40px auto;background:white;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.08);">
          <!-- Header -->
          <div style="background:linear-gradient(135deg, #0a1628 0%, #1a3a6e 60%, #0a1628 100%);padding:36px 32px;text-align:center;">
            <div style="font-size:36px;margin-bottom:8px;">🎓</div>
            <h1 style="color:white;margin:0;font-size:22px;font-weight:800;">Hoysala Degree College</h1>
            <p style="color:rgba(255,255,255,0.5);margin:6px 0 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;">Official Payment Receipt</p>
          </div>
          
          <!-- Success Badge -->
          <div style="padding:24px 32px 0;">
            <div style="background:linear-gradient(135deg, #dcfce7, #f0fdf4);border:2px solid #86efac;border-radius:16px;padding:20px;text-align:center;">
              <div style="font-size:32px;margin-bottom:4px;">✅</div>
              <p style="font-size:11px;color:#16a34a;margin:0 0 4px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Payment Successful</p>
              <p style="font-size:36px;font-weight:900;color:#16a34a;margin:0;letter-spacing:-1px;">₹${Number(amount).toLocaleString()}</p>
            </div>
          </div>

          <!-- Receipt Details -->
          <div style="padding:24px 32px;">
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Receipt No</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;font-size:14px;letter-spacing:0.5px;">${receiptNumber}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Student</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;">${studentName || "—"}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Roll Number</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;">${rollNumber || "—"}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Course</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;">${courseName || "—"}</td>
              </tr>
              ${semester ? `<tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Semester</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;">Semester ${semester}</td>
              </tr>` : ""}
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Payment Method</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;">${paymentMethod || "Cash"}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Date</td>
                <td style="padding:12px 0;text-align:right;font-weight:700;color:#0f172a;">${date || new Date().toLocaleDateString()}</td>
              </tr>
              ${remarks ? `<tr>
                <td style="padding:12px 0;color:#64748b;font-size:13px;">Remarks</td>
                <td style="padding:12px 0;text-align:right;font-weight:600;color:#0f172a;">${remarks}</td>
              </tr>` : ""}
            </table>
          </div>

          <!-- Footer -->
          <div style="text-align:center;padding:20px 32px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="font-size:11px;color:#94a3b8;margin:0;">This is an auto-generated receipt from Hoysala Degree College.</p>
            <p style="font-size:11px;color:#94a3b8;margin:4px 0 0;">Please keep this for your records.</p>
            <p style="font-size:10px;color:#cbd5e1;margin:12px 0 0;">📞 7676272167 | 📧 principal.hoysaladegreecollege@gmail.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Hoysala Degree College <onboarding@resend.dev>",
        to: [studentEmail],
        subject: `Payment Receipt - ${receiptNumber} | ₹${Number(amount).toLocaleString()}`,
        html: htmlContent,
      }),
    });

    const resData = await res.json();
    if (!res.ok) {
      console.error("Resend error:", resData);
      return new Response(JSON.stringify({ error: "Failed to send email", details: resData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: resData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
