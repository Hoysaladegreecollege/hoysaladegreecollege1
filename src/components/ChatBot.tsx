import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, ArrowUp, Bot, ChevronDown, Mic } from "lucide-react";
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

      {/* Chatbot launcher button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center group overflow-hidden ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--navy-light)) 100%)",
            boxShadow: "0 8px 32px hsl(var(--primary) / 0.35), 0 2px 8px hsl(var(--primary) / 0.2)"
          }}
          aria-label="Open chat assistant"
        >
          {/* Animated rings */}
          <span className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping" style={{ animationDuration: "2.5s" }} />
          {/* Shimmer sweep */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          {/* Icon */}
          <div className="relative flex flex-col items-center justify-center gap-0.5">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
            <span className="font-body text-[7px] sm:text-[8px] font-bold text-primary-foreground/70 uppercase tracking-widest leading-none">AI</span>
          </div>
          {/* Live badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center border-2 border-card">
            <span className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-pulse" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-border/50 bg-card ${isMinimized ? "h-auto" : "h-[72vh] sm:h-[560px] max-h-[calc(100vh-5rem)]"}`}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary to-primary/85 text-primary-foreground px-4 py-3.5 flex items-center justify-between shrink-0 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary -translate-y-1/2 translate-x-1/4 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white translate-y-1/2 -translate-x-1/4 blur-2xl" />
            </div>
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-body text-sm font-bold leading-tight">AI College Assistant</p>
                <p className="text-[10px] opacity-75 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse"></span>
                  Powered by Gemini AI
                </p>
              </div>
            </div>
            <div className="relative flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Minimize"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gradient-to-b from-muted/20 to-transparent">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                  >
                    {msg.role === "bot" && (
                      <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    {msg.typing ? (
                      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm font-body whitespace-pre-line leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card border border-border text-foreground rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-secondary-foreground">You</span>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick replies */}
              {messages.length <= 3 && (
                <div className="px-3 sm:px-4 pb-2.5 flex flex-wrap gap-1.5 shrink-0 border-t border-border/50 pt-2.5">
                  <p className="w-full font-body text-[10px] text-muted-foreground mb-1">Quick questions:</p>
                  {quickReplies.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.value)}
                      className="text-[11px] font-body px-2.5 py-1.5 rounded-full border border-border bg-muted/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 hover:scale-105"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input area */}
              <div className="p-3 border-t border-border flex items-center gap-2 shrink-0 bg-card">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1 bg-muted/60 border border-border rounded-xl px-3.5 py-2.5 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all duration-200 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
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
