const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the official AI assistant for Hoysala Degree College, Nelamangala, Bangalore.

College Info:
- Established: 2017 under Shri Shirdi Sai Educational Trust(R)
- Affiliated to Bangalore University, Approved by AICTE New Delhi
- College Code: BU 26 (P21GEF0099)
- Location: K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123
- Principal: Sri Gopal H.R (M.Sc, M.Ed, TET, KSET, Ph.D)

Courses: BCA, B.Com Regular, B.Com Professional, BBA, CA/CS/CMA coaching
Contact: 7676272167, 7975344252, 8618181383, 7892508243
Email: principal.hoysaladegreecollege@gmail.com

Facilities: Sophisticated Library, NSS, Student Counseling Cell, Placement Cell, Daily Attendance SMS, Monthly Internals, Weekly CA/CS Tests, AI & ML Workshops

Committees: Language Club, Commerce Forum, Management Forum, Tech Club, NSS, Mentoring Cell, Placement Cell, Student Counseling Cell, Eco Club, Anti-Ragging Cell, Women Empowerment Cell, Grievance & Redressal Cell

Add-on Courses:
- BCom/BBA: CA/CS/CMA/IBPS, Tally ERP, MS Excel, Aptitude, Soft Skills
- BCA: AI, ML, Web Designing, Data Science, Python, Java, Computer Networking

Admissions: Open for 2026-27. Visit /admissions page to apply online.

Be helpful, friendly, concise. Answer only college-related queries. For unrelated questions, politely redirect to college topics.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { message } = await req.json();
    if (!message) throw new Error("Message required");

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("API key not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
