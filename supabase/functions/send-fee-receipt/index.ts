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
    const { studentEmail, studentName, receiptNumber, amount, paymentMethod, courseName, rollNumber, remarks, date } = await req.json();

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
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 20px; color: #1a1a2e; margin: 0;">Hoysala Degree College</h1>
          <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Payment Receipt</p>
        </div>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 12px; color: #16a34a; margin: 0 0 4px;">Payment Successful</p>
          <p style="font-size: 28px; font-weight: bold; color: #16a34a; margin: 0;">₹${Number(amount).toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Receipt No</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${receiptNumber}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Student</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${studentName || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Roll Number</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${rollNumber || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Course</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${courseName || "—"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Payment Method</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${paymentMethod || "Cash"}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Date</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${date || new Date().toLocaleDateString()}</td></tr>
          ${remarks ? `<tr><td style="padding: 8px 0; color: #6b7280;">Remarks</td><td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a2e;">${remarks}</td></tr>` : ""}
        </table>
        <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 11px; color: #9ca3af; margin: 0;">This is an auto-generated receipt from Hoysala Degree College.</p>
          <p style="font-size: 11px; color: #9ca3af; margin: 4px 0 0;">Please keep this for your records.</p>
        </div>
      </div>
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
