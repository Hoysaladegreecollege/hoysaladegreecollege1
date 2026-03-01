import { useState, useRef, useEffect } from "react";
import { X, Send, ChevronDown, Sparkles, MessageCircle, Bot } from "lucide-react";
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
      {/* Premium Chatbot Launcher */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          aria-label="Open chat assistant"
        >
          {/* Outer glow ring */}
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(circle, hsla(var(--gold), 0.15) 0%, transparent 70%)",
              transform: "scale(1.8)",
              filter: "blur(8px)",
            }}
          />
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full border border-primary/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          {/* Main button */}
          <span
            className="relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-active:scale-95"
            style={{
              background: "hsl(var(--primary))",
              boxShadow: "0 8px 32px hsla(var(--primary), 0.3)",
              animation: "chatbot-float 4.5s ease-in-out infinite",
            }}
          >
            <MessageCircle className="w-6 h-6 text-primary-foreground drop-shadow-sm" />
          </span>
        </button>
      )}

      {/* Premium Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] rounded-3xl flex flex-col overflow-hidden border border-border/20 ${isMinimized ? "h-auto" : "h-[74vh] sm:h-[580px] max-h-[calc(100vh-5rem)]"}`}
          style={{
            animation: "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            background: "hsl(var(--card))",
            boxShadow: "0 25px 80px -12px rgba(0,0,0,0.5), 0 0 0 1px hsla(var(--border), 0.1), 0 0 60px -20px hsla(var(--gold), 0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Premium Header */}
          <div
            className="relative px-5 py-4 flex items-center justify-between shrink-0 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85), hsl(var(--gold) / 0.9))",
            }}
          >
            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.15) 45%, transparent 60%)",
                animation: "shimmer 4s ease-in-out infinite",
              }}
            />
            <div className="flex items-center gap-3 relative z-10">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-foreground tracking-wide" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  HDC Assistant
                </p>
                <p className="text-[10px] text-primary-foreground/60 flex items-center gap-1.5 mt-0.5 tracking-wider uppercase" style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "0.08em" }}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  Active Now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 relative z-10">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary-foreground/10 transition-all duration-300"
                aria-label="Minimize"
              >
                <ChevronDown className={`w-4 h-4 text-primary-foreground/60 transition-transform duration-500 ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary-foreground/10 transition-all duration-300"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-primary-foreground/60" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
                style={{
                  background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.15) 100%)",
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    style={{
                      animation: `fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 50, 300)}ms both`,
                    }}
                  >
                    {msg.role === "bot" && (
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1"
                        style={{
                          background: "linear-gradient(135deg, hsla(var(--primary), 0.12), hsla(var(--gold), 0.08))",
                          border: "1px solid hsla(var(--primary), 0.1)",
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    {msg.typing ? (
                      <div
                        className="rounded-2xl rounded-bl-sm px-5 py-3.5 flex items-center gap-2"
                        style={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border) / 0.3)",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        }}
                      >
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="w-2 h-2 rounded-full bg-primary/40"
                            style={{
                              animation: `typing-bounce 1.2s ease-in-out ${d * 0.15}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[82%] px-4 py-3 rounded-2xl text-[13px] whitespace-pre-line leading-relaxed ${
                          msg.role === "user"
                            ? "rounded-br-sm text-primary-foreground"
                            : "rounded-bl-sm text-foreground"
                        }`}
                        style={{
                          fontFamily: "'Inter', system-ui, sans-serif",
                          letterSpacing: "-0.01em",
                          ...(msg.role === "user"
                            ? {
                                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85))",
                                boxShadow: "0 4px 16px hsla(var(--primary), 0.2), 0 1px 3px rgba(0,0,0,0.1)",
                              }
                            : {
                                background: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border) / 0.3)",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.04), 0 0 0 0.5px hsla(var(--border), 0.1)",
                              }),
                        }}
                      >
                        {msg.text}
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1"
                        style={{
                          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))",
                          boxShadow: "0 2px 8px hsla(var(--primary), 0.2)",
                        }}
                      >
                        <span className="text-[9px] font-bold text-primary-foreground tracking-wider">YOU</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Premium Quick Replies */}
              {messages.length <= 3 && (
                <div className="px-4 sm:px-5 pb-3 flex flex-wrap gap-1.5 shrink-0 pt-3"
                  style={{
                    borderTop: "1px solid hsl(var(--border) / 0.15)",
                    background: "hsl(var(--card))",
                  }}
                >
                  <p className="w-full text-[10px] text-muted-foreground mb-1.5 uppercase tracking-widest font-medium" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                    Suggested
                  </p>
                  {quickReplies.map((q, i) => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.value)}
                      className="text-[11px] px-3 py-1.5 rounded-full text-foreground/80 hover:text-foreground transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                      style={{
                        fontFamily: "'Inter', system-ui, sans-serif",
                        background: "hsl(var(--muted) / 0.3)",
                        border: "1px solid hsl(var(--border) / 0.3)",
                        animation: `fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "hsla(var(--gold), 0.3)";
                        e.currentTarget.style.background = "hsla(var(--gold), 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "hsl(var(--border) / 0.3)";
                        e.currentTarget.style.background = "hsl(var(--muted) / 0.3)";
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Premium Input Area */}
              <div
                className="p-3 sm:p-4 flex items-center gap-2.5 shrink-0"
                style={{
                  borderTop: "1px solid hsl(var(--border) / 0.15)",
                  background: "hsl(var(--card))",
                }}
              >
                <div
                  className="flex-1 flex items-center rounded-2xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: "hsl(var(--muted) / 0.25)",
                    border: "1px solid hsl(var(--border) / 0.2)",
                  }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                    placeholder="Type a message..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-[13px] outline-none disabled:opacity-40 text-foreground placeholder:text-muted-foreground/50"
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  />
                </div>
                <button
                  onClick={() => handleSend(input)}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 disabled:opacity-20 disabled:cursor-not-allowed hover:scale-105 active:scale-95 text-primary-foreground"
                  style={{
                    background: input.trim() && !isLoading
                      ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.9))"
                      : "hsl(var(--muted) / 0.4)",
                    boxShadow: input.trim() && !isLoading
                      ? "0 4px 16px hsla(var(--primary), 0.25)"
                      : "none",
                  }}
                >
                  {isLoading ? (
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        border: "2px solid rgba(255,255,255,0.2)",
                        borderTopColor: "rgba(255,255,255,0.8)",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Chatbot-specific keyframes */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  );
}
