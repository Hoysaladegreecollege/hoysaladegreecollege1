import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "bot" | "user";
  text: string;
}

const initialMessages: Message[] = [
  { role: "bot", text: "Welcome to Hoysala Degree College! 👋 I'm here to help you with admissions, courses, events, and more. How can I assist you today?" },
];

const quickReplies = ["Courses offered", "Admission process", "Fee structure", "Contact info"];

const botResponses: Record<string, string> = {
  "courses offered": "We offer three undergraduate programs:\n\n🖥️ **BCA** – Bachelor of Computer Applications (3 years)\n📊 **BCom** – Bachelor of Commerce (3 years)\n💼 **BBA** – Bachelor of Business Administration (3 years)\n\nWould you like to know more about any specific course?",
  "admission process": "Our admission process is simple:\n\n1️⃣ Visit the Admissions page or college office\n2️⃣ Fill out the application form\n3️⃣ Submit required documents (10th & 12th marksheets, ID proof)\n4️⃣ Pay the registration fee\n5️⃣ Receive your admission confirmation\n\nAdmissions are open now!",
  "fee structure": "Fee details vary by course. Please visit our Courses page for updated fee structures, or contact the admin office directly.\n\n📞 +91 80 XXXX XXXX\n📧 admissions@hoysalacollege.edu",
  "contact info": "📍 Nelamangala, Bangalore, Karnataka – 562123\n📞 +91 80 XXXX XXXX\n📧 info@hoysalacollege.edu\n\nOffice hours: Mon-Sat, 9:00 AM – 5:00 PM",
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const key = Object.keys(botResponses).find((k) =>
        text.toLowerCase().includes(k)
      );
      const reply = key
        ? botResponses[key]
        : "Thank you for your question! For detailed information, please visit our relevant pages or contact us at info@hoysalacollege.edu. Is there anything else I can help with?";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold">College Assistant</p>
                <p className="text-[10px] opacity-70">Online • Ready to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 rounded-full p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm font-body whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs font-body px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
                >
                  {q}
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
              className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={() => handleSend(input)}
              className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-navy-light transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
