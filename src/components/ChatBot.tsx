import { useState, useRef, useEffect } from "react";
import { X, Send, ArrowUp, ChevronDown, Sparkles } from "lucide-react";
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

/* Gradient orb SVG used as bot avatar */
function GradientOrb({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className="shrink-0">
      <defs>
        <radialGradient id="orb-grad" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stopColor="hsl(270 60% 75%)" />
          <stop offset="50%" stopColor="hsl(330 50% 70%)" />
          <stop offset="100%" stopColor="hsl(30 70% 70%)" />
        </radialGradient>
        <filter id="orb-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <circle cx="40" cy="40" r="34" fill="url(#orb-grad)" filter="url(#orb-blur)" opacity="0.85" />
      <circle cx="40" cy="40" r="34" fill="url(#orb-grad)" />
      {/* Eyes */}
      <path d="M30 38 Q32 30 34 38" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M46 38 Q48 30 50 38" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

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
      const history = newMessages.filter(m => !m.typing).slice(-8).map(m => ({ role: m.role, text: m.text }));
      const { data } = await supabase.functions.invoke("chat", {
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

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-[5.5rem] right-4 sm:bottom-24 sm:right-6 z-50 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-card border border-border text-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        aria-label="Scroll to top"
        style={{ transitionDelay: "100ms" }}
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* Chatbot launcher — gradient orb with ripple rings */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          aria-label="Open chat assistant"
          style={{ background: "linear-gradient(135deg, hsl(270 60% 75%), hsl(330 50% 70%), hsl(30 70% 70%))" }}
        >
          {/* Ripple rings */}
          <span className="absolute inset-0 rounded-full chatbot-ripple-ring" style={{ animationDelay: "0s" }} />
          <span className="absolute inset-0 rounded-full chatbot-ripple-ring" style={{ animationDelay: "0.7s" }} />
          <span className="absolute inset-0 rounded-full chatbot-ripple-ring" style={{ animationDelay: "1.4s" }} />
          {/* Eyes icon */}
          <svg width="28" height="28" viewBox="0 0 80 80" fill="none" className="relative z-10">
            <path d="M24 40 Q28 26 32 40" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M48 40 Q52 26 56 40" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-border/30 bg-card ${isMinimized ? "h-auto" : "h-[72vh] sm:h-[560px] max-h-[calc(100vh-5rem)]"}`}
        >
          {/* Header */}
          <div className="relative px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-border/50 bg-card">
            <div className="flex items-center gap-3">
              <GradientOrb size={40} />
              <div>
                <p className="font-body text-sm font-bold text-foreground leading-tight">Smart Assistant</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                  How may I help you today?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors" aria-label="Minimize">
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition-colors" aria-label="Close">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-muted/20">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`} style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}>
                    {msg.role === "bot" && <GradientOrb size={28} />}
                    {msg.typing ? (
                      <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    ) : (
                      <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm font-body whitespace-pre-line leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-md text-white shadow-sm"
                          : "bg-card border border-border/50 text-foreground rounded-bl-md shadow-sm"
                      }`}
                        style={msg.role === "user" ? { background: "linear-gradient(135deg, hsl(270 55% 60%), hsl(300 45% 60%))" } : undefined}
                      >
                        {msg.text}
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-muted-foreground">You</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              {messages.length <= 3 && (
                <div className="px-3 sm:px-4 pb-2.5 flex flex-wrap gap-1.5 shrink-0 border-t border-border/30 pt-2.5 bg-card">
                  <p className="w-full font-body text-[10px] text-muted-foreground mb-1">Quick questions:</p>
                  {quickReplies.map((q) => (
                    <button key={q.label} onClick={() => handleSend(q.value)}
                      className="text-[11px] font-body px-2.5 py-1.5 rounded-full border border-border/60 bg-card text-foreground hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-200 hover:scale-105">
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="p-3 border-t border-border/30 flex items-center gap-2 shrink-0 bg-card">
                <div className="flex-1 flex items-center bg-muted/40 border border-border/50 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-purple-300/50 focus-within:border-purple-300/50 transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 mr-2 shrink-0" />
                  <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                    placeholder="Message..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm font-body outline-none disabled:opacity-50 text-foreground placeholder:text-muted-foreground" />
                </div>
                <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 text-white"
                  style={{ background: "linear-gradient(135deg, hsl(270 55% 60%), hsl(300 45% 60%))" }}>
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
