import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ChevronRight } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
  typing?: boolean;
}

const initialMessages: Message[] = [
  { role: "bot", text: "Welcome to Hoysala Degree College! 👋\n\nI'm your college assistant. How can I help you today?" },
];

const quickReplies = [
  { label: "📚 Courses", value: "courses offered" },
  { label: "📝 Admissions", value: "admission process" },
  { label: "💰 Fees", value: "fee structure" },
  { label: "📞 Contact", value: "contact info" },
  { label: "🎓 CA/CS", value: "ca cs coaching" },
  { label: "❓ FAQ", value: "faq" },
  { label: "🏆 Placements", value: "placements" },
  { label: "📅 Events", value: "events" },
];

const botResponses: Record<string, string> = {
  "courses offered": "We offer these programs:\n\n🖥️ **BCA** – Bachelor of Computer Applications\n📊 **B.Com Regular** – Bachelor of Commerce\n📈 **B.Com Professional** – With CA/CS/CMA coaching\n💼 **BBA** – Bachelor of Business Administration\n⚖️ **CA/CS Coaching** – Integrated with B.Com\n\nWould you like details about any specific course?",
  "admission process": "📋 **Admission Process:**\n\n1️⃣ Visit the **Admissions** page\n2️⃣ Click **Apply Online**\n3️⃣ Fill the application form\n4️⃣ Submit required documents\n5️⃣ Pay registration fee\n6️⃣ Get admission confirmation\n\n🎓 Admissions are open for 2026-27!",
  "fee structure": "💰 **Fee Structure:**\n\n🖥️ BCA – ₹35,000/year\n📊 B.Com Regular – ₹25,000/year\n📈 B.Com Professional – ₹30,000/year\n💼 BBA – ₹30,000/year\n\n📞 Call **7676272167** for details.",
  "contact info": "📍 K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala\n\n📞 **7676272167** / **7975344252**\n📞 **8618181383** / **7892508243**\n\n📧 principal.hoysaladegreecollege@gmail.com\n\n⏰ Mon-Sat, 9 AM – 5 PM",
  "ca cs coaching": "🎓 **CA, CS & CMA Coaching:**\n\n✅ CA Foundation & Intermediate\n✅ CS Foundation & Executive\n✅ CMA Foundation\n✅ Weekly tests & mock exams\n✅ Expert mentoring\n\nAll integrated with B.Com Professional!",
  "faq": "❓ **FAQ:**\n\n• **Hostel?** – PG facilities nearby\n• **Scholarships?** – Yes, for merit students\n• **Placements?** – 90% placement rate\n• **Transport?** – College buses available\n• **Library?** – Sophisticated, well-stocked",
  "placements": "🏆 **Placement Support:**\n\n✅ Dedicated Placement Cell\n✅ 90% placement rate\n✅ Industry partnerships\n✅ Resume workshops\n✅ Mock interviews\n✅ Career counseling",
  "events": "📅 **Events & Activities:**\n\n🎭 Annual Cultural Fest\n🏃 Sports Day\n🤖 AI & ML Workshops monthly\n📚 Guest lectures\n🎓 Graduation ceremony\n\nCheck our Events page for updates!",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);
    setInput("");

    setMessages((prev) => [...prev, { role: "bot", text: "", typing: true }]);

    setTimeout(() => {
      const key = Object.keys(botResponses).find((k) => text.toLowerCase().includes(k));
      const reply = key
        ? botResponses[key]
        : "Thank you for your question! For detailed info, visit our pages or call **7676272167**. Is there anything else I can help with?";
      setMessages((prev) => [...prev.filter((m) => !m.typing), { role: "bot", text: reply }]);
    }, 1000);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center animate-pulse-glow"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] sm:h-[520px] max-h-[calc(100vh-6rem)] glass-card rounded-2xl shadow-2xl flex flex-col animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-secondary/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-body text-sm font-bold">College Assistant</p>
                <p className="text-[10px] opacity-70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 rounded-full p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                {msg.typing ? (
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                ) : (
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm font-body whitespace-pre-line leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 3 && (
            <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {quickReplies.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleSend(q.value)}
                  className="text-[11px] font-body px-2.5 py-1.5 rounded-full border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex items-center gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Type your question..."
              className="flex-1 bg-muted rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
            <button
              onClick={() => handleSend(input)}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-navy-light transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
