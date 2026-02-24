const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per isolate)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 15; // max requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

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

const SYSTEM_PROMPT = `You are the official AI assistant for Hoysala Degree College, Nelamangala, Bangalore. You are friendly, helpful, and knowledgeable.

College Info:
- Established: 2017 under Shri Shirdi Sai Educational Trust(R)
- Affiliated to Bangalore University, Approved by AICTE New Delhi
- College Code: BU 26 (P21GEF0099)
- Location: K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123
- Principal: Sri Gopal H.R (M.Sc, M.Ed, TET, KSET, Ph.D)

Courses Offered:
1. BCA (Bachelor of Computer Applications) - 3 Years, Fee: ₹35,000/year, Eligibility: 10+2 with Maths/CS, min 45%
2. B.Com Regular - 3 Years, Fee: ₹25,000/year, Eligibility: 10+2 any stream, min 40%
3. B.Com Professional (CA/CS/CMA coaching included) - 3 Years, Fee: ₹30,000/year
4. BBA (Bachelor of Business Administration) - 3 Years, Fee: ₹30,000/year
5. CA/CS Coaching - Integrated with B.Com Professional

Contact Numbers: 7676272167, 7975344252, 8618181383, 7892508243
Email: principal.hoysaladegreecollege@gmail.com

Key Features:
- Experienced faculty with industry experience
- Exclusive CA, CS & CMA coaching classes
- Add-on courses: AI, ML, Python, Java, Web Design for BCA; Tally, Excel, Aptitude for BCom/BBA
- Daily attendance SMS to parents
- Monthly internal assessments
- Weekly CA/CS mock tests
- Sophisticated library with digital resources
- NSS Unit for social service
- Student counseling cell
- Active placement cell with 90% placement rate
- Smart classrooms with digital projectors
- Computer lab with latest software
- Safe campus with CCTV surveillance

Committees: Language Club, Commerce Forum, Management Forum, Tech Club, NSS, Mentoring Cell, Placement Cell, Student Counseling Cell, Eco Club, Anti-Ragging Cell, Women Empowerment Cell, Grievance & Redressal Cell

Admissions: Open for 2026-27. Students can apply online at the Admissions page.

Documents Required: 10th & 12th Marksheets, TC, Migration Certificate, Aadhar, Photos, Caste Certificate (if applicable)

Instructions:
- Be conversational and friendly. Use emojis occasionally.
- Answer college-related questions comprehensively.
- For admission queries, guide them to apply online or call 7676272167.
- For unrelated questions, politely say you can only help with college-related topics.
- Keep responses concise but informative (max 200 words).
- If asked about fees, placements, courses, or facilities, provide specific details.
- You can understand and respond in English, Hindi, and Kannada.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(JSON.stringify({ reply: "You're sending too many messages. Please wait a moment and try again. 🙏" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { message, history } = await req.json();
    if (!message || typeof message !== "string") throw new Error("Message required");

    // Limit message length to prevent abuse
    const sanitizedMessage = message.slice(0, 1000);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("API key not configured");

    // Build messages array with conversation history
    const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
    
    if (history && Array.isArray(history)) {
      for (const h of history.slice(-6)) {
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
        model: "google/gemini-2.5-flash-lite",
        messages,
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("AI service temporarily unavailable");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again or call 7676272167.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Chat error:", error.message);
    return new Response(JSON.stringify({ reply: "I'm having trouble connecting right now. Please try again or call us at 7676272167 for immediate assistance! 📞" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
