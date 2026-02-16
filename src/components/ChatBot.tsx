import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "bot" | "user";
  text: string;
  typing?: boolean;
}

const initialMessages: Message[] = [
  { role: "bot", text: "Welcome to Hoysala Degree College! 👋\n\nI'm your AI-powered college assistant. Ask me anything about courses, admissions, fees, or campus life!" },
];

const quickReplies = [
  { label: "📚 Courses", value: "What courses do you offer?" },
  { label: "📝 Admissions", value: "How do I apply for admission?" },
  { label: "💰 Fees", value: "What is the fee structure?" },
  { label: "📞 Contact", value: "How can I contact the college?" },
  { label: "🎓 CA/CS", value: "Tell me about CA and CS coaching" },
  { label: "🏆 Placements", value: "What is the placement record?" },
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg = text.trim();
    const newMessages = [...messages, { role: "user" as const, text: userMsg }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "bot", text: "", typing: true }]);

    try {
      // Send conversation history for context
      const history = newMessages.filter(m => !m.typing).slice(-8).map(m => ({ role: m.role, text: m.text }));
      
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message: userMsg, history },
      });

      const reply = data?.reply || "I'm sorry, I couldn't process that. Please call 7676272167 for help.";
      setMessages((prev) => [...prev.filter((m) => !m.typing), { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => !m.typing),
        { role: "bot", text: "I'm having trouble connecting. Please try again or call 7676272167." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-card border border-border text-foreground shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

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
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-2xl shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-secondary/20 backdrop-blur flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-body text-sm font-bold">AI College Assistant</p>
                <p className="text-[10px] opacity-70 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span> Powered by Gemini AI
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 rounded-full p-1.5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

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

          {messages.length <= 3 && (
            <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {quickReplies.map((q) => (
                <button key={q.label} onClick={() => handleSend(q.value)}
                  className="text-[11px] font-body px-2.5 py-1.5 rounded-full border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200">
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-border flex items-center gap-2 shrink-0">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 bg-muted rounded-xl px-3 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30 transition-shadow disabled:opacity-50" />
            <button onClick={() => handleSend(input)} disabled={isLoading}
              className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-navy-light transition-colors shrink-0 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
