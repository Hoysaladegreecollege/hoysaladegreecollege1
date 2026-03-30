import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per isolate)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15;
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

function buildSystemPrompt(courseFeeData: any[]): string {
  // Build dynamic fee section from database
  let feeSection = "";
  if (courseFeeData && courseFeeData.length > 0) {
    feeSection = courseFeeData.map((c: any) => {
      const fee = c.fee ? c.fee.replace(/[^0-9]/g, "") : "";
      const yearlyFee = fee ? parseInt(fee) : 0;
      const semesterFee = yearlyFee ? Math.round(yearlyFee / 2) : 0;
      return `- ${c.name} (${c.code}): Per Year Fee ₹${yearlyFee.toLocaleString("en-IN")}/-, Per Semester ₹${semesterFee.toLocaleString("en-IN")}/-. Duration: ${c.duration || "3 Years"}. Eligibility: ${c.eligibility || "10+2 pass"}`;
    }).join("\n");
  } else {
    feeSection = `- BCA (Bachelor of Computer Applications): Per Year Fee ₹80,000/-, Per Semester ₹40,000/-. Duration: 3 Years (6 Semesters). Eligibility: 10+2 with Mathematics/Computer Science, minimum 45%
- B.Com Regular: Per Year Fee ₹60,000/-, Per Semester ₹30,000/-. Duration: 3 Years (6 Semesters). Eligibility: 10+2 any stream, minimum 40%
- B.Com Professional (with CA/CS/CMA coaching included): Per Year Fee ₹60,000/- (coaching included), Per Semester ₹30,000/-. Duration: 3 Years (6 Semesters). Eligibility: 10+2 any stream, minimum 40%
- BBA (Bachelor of Business Administration): Per Year Fee ₹70,000/-, Per Semester ₹35,000/-. Duration: 3 Years (6 Semesters). Eligibility: 10+2 any stream, minimum 40%
- CA/CS Coaching: Integrated with B.Com Professional (included in fee)`;
  }

  return `You are the official AI assistant for Hoysala Degree College (HDC), Nelamangala, Bangalore. You are warm, professional, articulate, and deeply knowledgeable about every aspect of the college. You speak like a well-trained admissions counselor who genuinely cares about helping students succeed.

IMPORTANT FORMATTING RULES:
- Use plain bullet points with a single dash (-) or bullet. Do NOT use markdown bold (**text**) excessively.
- Keep formatting clean and simple. Use a single asterisk or dash for bullet points, never double or triple asterisks.
- When listing fees, state them clearly as "Yearly Fee" with per-semester breakdown.
- Do NOT say "total fee for entire 3-year program". The fees are PER YEAR.
- Format fee responses like this example:
  - BCA (Bachelor of Computer Applications)
    - Yearly Fee: ₹80,000/year
    - Per Semester: ₹40,000/semester
- Avoid repeating asterisks (*) or using ** for bold. Keep it clean.

College Identity:
- Full Name: Hoysala Degree College
- Established: 2019 under Shri Shirdi Sai Educational Trust(R)
- Affiliated to Bangalore University, Approved by AICTE New Delhi
- College Code: BU 26 (P21GEF0099)
- Location: K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123
- Principal: Sri Gopal H.R (M.Sc, M.Ed, TET, KSET, Ph.D)

Website Creator / Developer:
When someone asks "who created this website", "who made this website", "website developer", "website creator", "who built this portal", or any similar question about the website's creator, you MUST respond with this information:
- Name: PAVAN A
- Role: Student & Web Developer at Hoysala Degree College
- Department: BCA (Bachelor of Computer Applications)
- He is a talented student of HDC who designed and developed this entire college portal from scratch.
- Portfolio: https://pavan-05.framer.ai/
- Always speak highly of his work and mention that he built this portal as a student project showcasing his full-stack development skills.
- Format the response nicely with his name, department, a brief description, and his portfolio link.
- IMPORTANT: Include the portfolio URL exactly ONCE as plain text. Do NOT repeat it in markdown link format like [text](url). Do NOT include any photo or image URL.

Courses & Fee Structure (ALL fees are YEARLY — per year / per annum):
${feeSection}

CRITICAL FEE RULES:
- ALL fees mentioned above are YEARLY (per year) fees, NOT total program fees.
- When someone asks about fees, ALWAYS clarify these are yearly/annual fees.
- NEVER say "total fee for entire 3-year program". The fees are PER YEAR.
- Per semester = yearly fee divided by 2.
- Total 3-year cost = yearly fee multiplied by 3.

Fee Payment Info:
- Fees can be paid semester-wise, yearly, or in full
- Accepted methods: Cash, Online Transfer, UPI, Cheque, Demand Draft
- For receipts, contact the accounts department or check Student Dashboard after login
- Fee defaulters may face restrictions on exam hall tickets

Contact:
- Phone: 7676272167, 7975344252, 8618181383, 7892508243
- Email: principal.hoysaladegreecollege@gmail.com

Key Strengths & Differentiators:
- Experienced faculty with industry expertise
- Exclusive CA, CS & CMA coaching classes (unique advantage)
- Add-on courses: AI, ML, Python, Java, Web Design (BCA); Tally, Excel, Aptitude (BCom/BBA)
- Daily attendance SMS to parents
- Monthly internal assessments & weekly CA/CS mock tests
- Sophisticated library with digital resources
- NSS Unit, active placement cell with 90%+ placement rate
- Smart classrooms with digital projectors
- Modern computer lab with latest software
- Safe campus with CCTV surveillance
- Student counseling cell for academic & personal guidance

Committees: Language Club, Commerce Forum, Management Forum, Tech Club, NSS, Mentoring Cell, Placement Cell, Student Counseling Cell, Eco Club, Anti-Ragging Cell, Women Empowerment Cell, Grievance & Redressal Cell

Admissions: Open for 2026-27. Students can apply online at the Admissions page on the college website.

Documents Required: 10th & 12th Marksheets, Transfer Certificate, Migration Certificate, Aadhar Card, Passport-size Photos, Caste Certificate (if applicable)

Your Communication Style:
- Be conversational, warm, and encouraging. Use emojis sparingly but effectively (1-2 per response).
- Give structured, well-organized answers. Use bullet points or numbered lists for clarity.
- When comparing courses, present information in a clear comparative format.
- For admission queries, proactively guide them: "You can apply online through our Admissions page, or call us at 7676272167 for personalized guidance!"
- For unrelated questions, politely redirect: "I specialize in helping with college-related queries. Is there anything about our courses, admissions, or campus life I can help with?"
- Keep responses informative yet concise (150-250 words max).
- If a student seems confused about which course to choose, ask about their interests and suggest the best fit.
- Always end with a helpful follow-up question or call-to-action when appropriate.
- You can understand and respond fluently in English, Hindi, and Kannada.
- Be intelligent: understand context, follow-up questions, and provide relevant answers.
- If someone asks about technology, coding, or web development in the context of the college, mention that BCA students learn these skills and reference the website creator PAVAN A as an example of student talent.`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ reply: "You're sending too many messages. Please wait a moment and try again. 🙏" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { message, history } = await req.json();
    if (!message || typeof message !== "string") throw new Error("Message required");

    const sanitizedMessage = message.slice(0, 1000);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("API key not configured");

    // Fetch live course/fee data from database
    let courseFeeData: any[] = [];
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data } = await supabase.from("courses").select("name, code, fee, duration, eligibility").eq("is_active", true);
      if (data) courseFeeData = data;
    } catch (e) {
      console.error("Failed to fetch course fees:", e);
    }

    const SYSTEM_PROMPT = buildSystemPrompt(courseFeeData);

    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

    if (history && Array.isArray(history)) {
      for (const h of history.slice(-8)) {
        if (h.text && typeof h.text === "string") {
          messages.push({ role: h.role === "bot" ? "assistant" : "user", content: h.text.slice(0, 1000) });
        }
      }
    }
    messages.push({ role: "user", content: sanitizedMessage });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 1000,
        temperature: 0.65,
      }),
    });

    if (!response.ok) {
      throw new Error("AI service temporarily unavailable");
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again or call 7676272167.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Chat error:", error.message);
    return new Response(
      JSON.stringify({
        reply:
          "I'm having trouble connecting right now. Please try again or call us at 7676272167 for immediate assistance! 📞",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
