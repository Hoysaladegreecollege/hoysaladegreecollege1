import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

const SYSTEM_PROMPT = `You are "HDC Study Buddy" — a highly intelligent, friendly, and helpful AI assistant built exclusively for students of Hoysala Degree College (HDC), Nelamangala, Bangalore.

YOUR CAPABILITIES:
1. **Academic Help**: Answer questions on any subject — Mathematics, Computer Science, Commerce, Business, Accounting, Economics, English, Kannada, Hindi, etc.
2. **Image Analysis**: Students can share images of textbook pages, handwritten notes, math problems, diagrams, charts, code screenshots, or exam questions. Analyze them thoroughly and provide detailed explanations.
3. **Exam Preparation**: Help with exam prep, create practice questions, explain concepts, solve problems step-by-step.
4. **Study Planning**: Suggest study schedules, time management tips, and effective learning strategies.
5. **Code Help**: For BCA students — help with programming in C, C++, Java, Python, HTML/CSS, JavaScript, SQL, Data Structures, and Algorithms.
6. **Essay & Writing**: Help draft essays, reports, assignments, and presentations.
7. **Quick Math**: Solve mathematical problems with step-by-step working.
8. **Concept Simplification**: Break down complex topics into simple, easy-to-understand explanations.
9. **Career Guidance**: Provide guidance on career paths, competitive exams (CA, CS, CMA, UPSC, etc.), and higher education options.
10. **College Info**: Answer questions about HDC — courses (BCA, B.Com, BBA), fee structure, faculty, events, facilities, etc.

FORMATTING RULES:
- Use markdown formatting for clear, structured responses.
- Use **bold** for important terms and concepts.
- Use bullet points and numbered lists for organized content.
- Use code blocks (\`\`\`) for programming code with language specification.
- Use LaTeX-style notation for math when helpful.
- Keep responses comprehensive but concise.
- Use emojis sparingly but effectively to make responses engaging (1-3 per response).

PERSONALITY:
- Be warm, encouraging, and patient like a senior student mentor.
- Celebrate when students understand concepts.
- If a student seems stressed about exams, be supportive and motivating.
- Always provide actionable, practical advice.
- If you don't know something specific to HDC, say so honestly and suggest who to contact.

COLLEGE CONTEXT:
- Hoysala Degree College, Nelamangala, Bengaluru
- Courses: BCA (₹80,000/year), B.Com Regular & Professional (₹60,000/year), BBA (₹70,000/year)
- Affiliated to Bangalore University
- Principal: Sri Gopal H.R
- Contact: 7676272167

IMPORTANT:
- You can understand and respond in English, Hindi, and Kannada.
- When analyzing images, be thorough and explain what you see.
- For math problems, always show step-by-step solutions.
- For code questions, explain the logic, not just the answer.
- Never refuse to help with legitimate academic questions.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    // Authenticate the student
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (isRateLimited(user.id)) {
      return new Response(
        JSON.stringify({ error: "You're sending too many messages. Please wait a moment. 🙏" }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { message, history, imageBase64, imageType } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedMessage = message.slice(0, 2000);

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("API key not configured");

    // Fetch student context
    let studentContext = "";
    try {
      const { data: student } = await supabase
        .from("students")
        .select("semester, roll_number, course_id, courses(name, code)")
        .eq("user_id", user.id)
        .single();

      if (student) {
        const courseName = (student as any).courses?.name || "Unknown";
        const courseCode = (student as any).courses?.code || "";
        studentContext = `\n\nSTUDENT CONTEXT: This student is in Semester ${student.semester || "N/A"}, studying ${courseName} (${courseCode}), Roll Number: ${student.roll_number}. Tailor your answers to their course level when relevant.`;
      }
    } catch (e) {
      console.error("Failed to fetch student context:", e);
    }

    // Build messages array
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT + studentContext },
    ];

    if (history && Array.isArray(history)) {
      for (const h of history.slice(-10)) {
        if (h.content) {
          messages.push({ role: h.role === "assistant" ? "assistant" : "user", content: h.content });
        }
      }
    }

    // Build user message content (text + optional image)
    if (imageBase64 && imageType) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: sanitizedMessage },
          {
            type: "image_url",
            image_url: { url: `data:${imageType};base64,${imageBase64}` },
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: sanitizedMessage });
    }

    // Use a vision-capable model when images are present
    const model = imageBase64 ? "google/gemini-2.5-flash" : "google/gemini-2.5-flash";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2000,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI service is busy. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits exhausted. Please contact admin." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Please try again!";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Student chat error:", error.message);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again!" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
