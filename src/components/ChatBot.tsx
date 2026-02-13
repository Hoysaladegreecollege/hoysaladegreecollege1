import { useState } from "react";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
  typing?: boolean;
}

const initialMessages: Message[] = [
  { role: "bot", text: "Welcome to Hoysala Degree College! 👋 I'm here to help you with admissions, courses, events, and more. How can I assist you today?" },
];

const quickReplies = [
  { label: "📚 Courses offered", value: "courses offered" },
  { label: "📝 Admission process", value: "admission process" },
  { label: "💰 Fee structure", value: "fee structure" },
  { label: "📞 Contact info", value: "contact info" },
  { label: "🎓 CA/CS coaching", value: "ca cs coaching" },
  { label: "❓ FAQ", value: "faq" },
];

const botResponses: Record<string, string> = {
  "courses offered": "We offer these programs:\n\n🖥️ **BCA** – Bachelor of Computer Applications\n📊 **B.Com Regular** – Bachelor of Commerce\n📈 **B.Com Professional** – With CA/CS/CMA coaching\n💼 **BBA** – Bachelor of Business Administration\n⚖️ **CA/CS Coaching** – Integrated with B.Com\n\nWould you like details about any specific course?",
  "admission process": "Our admission process:\n\n1️⃣ Visit the **Admissions** page\n2️⃣ Click **Apply Online** to fill the form\n3️⃣ Submit required documents\n4️⃣ Pay the registration fee\n5️⃣ Receive admission confirmation\n\n🎓 Admissions are open for 2026-27!",
  "fee structure": "Fee structure:\n\n🖥️ BCA – ₹35,000/year\n📊 B.Com Regular – ₹25,000/year\n📈 B.Com Professional – ₹30,000/year\n💼 BBA – ₹30,000/year\n\n📞 Call **7676272167** for more details.",
  "contact info": "📍 K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town\n\n📞 **7676272167** / **7975344252** / **8618181383** / **7892508243**\n\n📧 principal.hoysaladegreecollege@gmail.com\n\n⏰ Mon-Sat, 9:00 AM – 5:00 PM",
  "ca cs coaching": "We offer exclusive **CA, CS & CMA coaching** integrated with our B.Com Professional program!\n\n✅ CA Foundation & Intermediate\n✅ CS Foundation & Executive\n✅ CMA Foundation\n✅ Weekly tests & mock exams\n✅ One-on-one mentoring\n\nAll included in B.Com Professional fee!",
  "faq": "Frequently Asked Questions:\n\n❓ **Is hostel available?** – Not currently, but PG facilities are nearby.\n❓ **Scholarship available?** – Yes, for meritorious students.\n❓ **Placement support?** – Yes, 90% placement rate.\n❓ **Transport facility?** – College buses on select routes.\n\nAnything else you'd like to know?",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: text.trim() }]);
    setInput("");

    // Show typing indicator
    setMessages((prev) => [...prev, { role: "bot", text: "", typing: true }]);

    setTimeout(() => {
      const key = Object.keys(botResponses).find((k) => text.toLowerCase().includes(k));
      const reply = key
        ? botResponses[key]
        : "Thank you for your question! For detailed information, please visit our relevant pages or contact us at **7676272167**. Is there anything else I can help with?";
      setMessages((prev) => [...prev.filter((m) => !m.typing), { role: "bot", text: reply }]);
    }, 1200);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center animate-pulse-glow"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] glass-card rounded-2xl shadow-2xl flex flex-col animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-secondary/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold">College Assistant</p>
                <p className="text-[10px] opacity-70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 rounded-full p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.typing ? (
                  <div className="bg-muted rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                ) : (
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm font-body whitespace-pre-line leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick replies */}
          {messages.length <= 3 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleSend(q.value)}
                  className="text-xs font-body px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Type your question..."
              className="flex-1 bg-muted rounded-lg px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
            <button
              onClick={() => handleSend(input)}
              className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-navy-light transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
