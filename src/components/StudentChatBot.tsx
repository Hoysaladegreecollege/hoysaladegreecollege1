import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Send, ChevronDown, Bot, Sparkles, Image as ImageIcon,
  BookOpen, Code, Calculator, GraduationCap, Lightbulb, FileText,
  Trash2, Maximize2, Minimize2, Copy, Check, RotateCcw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  imagePreview?: string;
  timestamp: Date;
}

const quickPrompts = [
  { icon: BookOpen, label: "Explain a concept", prompt: "Explain the concept of ", color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-500" },
  { icon: Code, label: "Help with code", prompt: "Help me write code for ", color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-500" },
  { icon: Calculator, label: "Solve math", prompt: "Solve this math problem step by step: ", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-500" },
  { icon: GraduationCap, label: "Exam prep", prompt: "Help me prepare for my exam on ", color: "from-amber-500/20 to-amber-600/10", iconColor: "text-amber-500" },
  { icon: Lightbulb, label: "Study tips", prompt: "Give me effective study tips for ", color: "from-cyan-500/20 to-cyan-600/10", iconColor: "text-cyan-500" },
  { icon: FileText, label: "Write essay", prompt: "Help me write an essay on ", color: "from-rose-500/20 to-rose-600/10", iconColor: "text-rose-500" },
];

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content: "Hey there! 👋 I'm your **HDC Study Buddy** — your personal AI assistant.\n\nI can help you with:\n- 📚 **Any subject** — Math, CS, Commerce, English & more\n- 📷 **Image analysis** — Share photos of problems or notes\n- 💻 **Code help** — Debug, explain, or write code\n- 📝 **Exam prep** — Practice questions & study plans\n- 🎯 **Career guidance** — Future planning & advice\n\nAsk me anything or tap a quick action below!",
  timestamp: new Date(),
};

export default function StudentChatBot() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be under 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
      setImageType(file.type);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    setImageType(null);
  };

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if ((!msg && !imageBase64) || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: msg || "What's in this image?",
      imagePreview: imagePreview || undefined,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    const sentImage = imageBase64;
    const sentImageType = imageType;
    clearImage();
    setIsLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      const history = newMessages
        .filter(m => m.role !== "assistant" || m !== welcomeMessage)
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("student-chat", {
        body: {
          message: userMessage.content,
          history,
          imageBase64: sentImage,
          imageType: sentImageType,
        },
      });

      if (error) throw error;

      const reply = data?.reply || data?.error || "Sorry, I couldn't process that. Please try again!";
      setMessages(prev => [...prev, { role: "assistant", content: reply, timestamp: new Date() }]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment! 🔄", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    clearImage();
    toast.success("Chat cleared");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        aria-label="Open Study Buddy"
      >
        <span className="absolute inset-0 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] border border-primary/20" />
        <span
          className="relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-active:scale-95"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))",
            boxShadow: "0 8px 32px hsla(var(--primary), 0.35)",
            animation: "chatbot-float 4.5s ease-in-out infinite",
          }}
        >
          <Sparkles className="w-6 h-6 text-primary-foreground" />
        </span>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-background">
          <span className="text-[8px] font-bold text-white">AI</span>
        </span>
      </button>
    );
  }

  const chatWidth = isExpanded ? "w-[calc(100vw-2rem)] sm:w-[680px]" : "w-[calc(100vw-2rem)] sm:w-[440px]";
  const chatHeight = isExpanded ? "h-[calc(100vh-2rem)] sm:h-[85vh]" : "h-[75vh] sm:h-[600px]";

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 ${chatWidth} ${chatHeight} rounded-3xl flex flex-col overflow-hidden border border-border/30`}
      style={{
        animation: "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        background: "hsl(var(--card))",
        boxShadow: "0 25px 80px -12px rgba(0,0,0,0.45), 0 0 0 1px hsla(var(--border), 0.1)",
        backdropFilter: "blur(20px)",
        transition: "width 0.3s ease, height 0.3s ease",
      }}
    >
      {/* Header */}
      <div className="relative px-5 py-4 flex items-center justify-between shrink-0 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85))" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-foreground tracking-wide">HDC Study Buddy</p>
            <p className="text-[10px] text-primary-foreground/60 flex items-center gap-1.5 mt-0.5 uppercase tracking-widest">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              AI Powered
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 relative z-10">
          <button onClick={handleClearChat} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary-foreground/10 transition-all" title="Clear chat">
            <Trash2 className="w-3.5 h-3.5 text-primary-foreground/60" />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary-foreground/10 transition-all" title={isExpanded ? "Minimize" : "Expand"}>
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5 text-primary-foreground/60" /> : <Maximize2 className="w-3.5 h-3.5 text-primary-foreground/60" />}
          </button>
          <button onClick={() => { setIsOpen(false); setIsExpanded(false); }} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary-foreground/10 transition-all">
            <X className="w-4 h-4 text-primary-foreground/60" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted) / 0.1) 100%)" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            style={{ animation: `fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 40, 200)}ms both` }}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1"
                style={{ background: "linear-gradient(135deg, hsla(var(--primary), 0.15), hsla(var(--primary), 0.05))", border: "1px solid hsla(var(--primary), 0.1)" }}
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] group relative ${msg.role === "user" ? "" : ""}`}>
              {/* Image preview in user message */}
              {msg.imagePreview && (
                <div className="mb-2 rounded-xl overflow-hidden border border-border/30" style={{ maxWidth: "240px" }}>
                  <img src={msg.imagePreview} alt="Uploaded" className="w-full h-auto" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm text-primary-foreground"
                    : "rounded-bl-sm text-foreground"
                }`}
                style={{
                  ...(msg.role === "user"
                    ? {
                        background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85))",
                        boxShadow: "0 4px 16px hsla(var(--primary), 0.2)",
                      }
                    : {
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border) / 0.3)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                      }),
                }}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:my-2 prose-pre:my-2 prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/30 prose-pre:rounded-xl prose-strong:text-foreground">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-line">{msg.content}</span>
                )}
              </div>
              {/* Copy button for assistant messages */}
              {msg.role === "assistant" && i > 0 && (
                <button
                  onClick={() => handleCopy(msg.content, i)}
                  className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 w-7 h-7 rounded-lg bg-card border border-border/40 flex items-center justify-center hover:bg-muted/50"
                  title="Copy response"
                >
                  {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                </button>
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1 bg-primary text-primary-foreground"
                style={{ boxShadow: "0 2px 8px hsla(var(--primary), 0.2)" }}
              >
                <span className="text-[8px] font-bold tracking-wider">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-2.5 justify-start" style={{ animation: "fade-in 0.3s ease both" }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-1"
              style={{ background: "linear-gradient(135deg, hsla(var(--primary), 0.15), hsla(var(--primary), 0.05))", border: "1px solid hsla(var(--primary), 0.1)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="rounded-2xl rounded-bl-sm px-5 py-3.5 flex items-center gap-2"
              style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border) / 0.3)" }}
            >
              {[0, 1, 2].map(d => (
                <span key={d} className="w-2 h-2 rounded-full bg-primary/40"
                  style={{ animation: `typing-bounce 1.2s ease-in-out ${d * 0.15}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 pt-3 shrink-0" style={{ borderTop: "1px solid hsl(var(--border) / 0.15)", background: "hsl(var(--card))" }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-2">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                onClick={() => { setInput(q.prompt); inputRef.current?.focus(); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-border/20 hover:border-border/40"
                style={{ background: "hsl(var(--muted) / 0.2)", animation: `fade-in 0.3s ease ${i * 50}ms both` }}
              >
                <q.icon className={`w-3.5 h-3.5 ${q.iconColor} shrink-0`} />
                <span className="text-[11px] font-medium text-foreground/80 truncate">{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image preview strip */}
      {imagePreview && (
        <div className="px-4 py-2 flex items-center gap-3 shrink-0 border-t border-border/15 bg-card">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-border/30" />
            <button onClick={clearImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:scale-110 transition-transform">
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Image attached — ask your question!</p>
        </div>
      )}

      {/* Input area */}
      <div className="p-3 sm:p-4 flex items-end gap-2 shrink-0" style={{ borderTop: "1px solid hsl(var(--border) / 0.15)", background: "hsl(var(--card))" }}>
        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 hover:bg-muted/50 transition-all border border-border/20 hover:border-primary/30"
          title="Upload image"
        >
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex items-end rounded-2xl px-4 py-2.5 transition-all duration-300"
          style={{ background: "hsl(var(--muted) / 0.25)", border: "1px solid hsl(var(--border) / 0.2)" }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-[13px] outline-none disabled:opacity-40 text-foreground placeholder:text-muted-foreground/50 resize-none max-h-24 leading-relaxed"
            style={{ minHeight: "20px" }}
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={isLoading || (!input.trim() && !imageBase64)}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 disabled:opacity-20 hover:scale-105 active:scale-95 text-primary-foreground"
          style={{
            background: (input.trim() || imageBase64) && !isLoading
              ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8))"
              : "hsl(var(--muted) / 0.4)",
            boxShadow: (input.trim() || imageBase64) && !isLoading ? "0 4px 16px hsla(var(--primary), 0.25)" : "none",
          }}
        >
          {isLoading ? (
            <div className="w-4 h-4 rounded-full" style={{ border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "rgba(255,255,255,0.8)", animation: "spin 0.8s linear infinite" }} />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes chatbot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
