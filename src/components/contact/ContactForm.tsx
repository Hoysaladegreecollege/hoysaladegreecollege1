import { Send, CheckCircle, Sparkles, Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import ScrollReveal from "@/components/ScrollReveal";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name must be under 200 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be under 255 characters"),
  subject: z.string().max(300, "Subject must be under 300 characters").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000, "Message must be under 5000 characters"),
});

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      toast.error(firstError);
      return;
    }
    const validated = result.data;
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: validated.name, email: validated.email, subject: validated.subject || "", message: validated.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }, 4000);
    }
  };

  const inputClass =
    "w-full border border-border/40 rounded-xl px-5 py-4 font-body text-sm bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary/40 transition-all duration-400 placeholder:text-muted-foreground/25 hover:border-border/60 hover:bg-background/70";

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Your name", required: true, half: true },
    { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com", required: true, half: true },
    { key: "subject", label: "Subject", type: "text", placeholder: "How can we help?", required: false, half: false },
  ];

  return (
    <ScrollReveal delay={200}>
      <div className="relative rounded-[2rem] border border-border/20 bg-card/60 backdrop-blur-xl overflow-hidden"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.08), 0 0 0 1px hsla(228, 8%, 12%, 0.05)" }}>
        
        {/* Multiple ambient glows */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-secondary/[0.04] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-primary/[0.03] rounded-full blur-[60px] pointer-events-none" />
        
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
        
        {/* Side accent */}
        <div className="absolute top-8 left-0 w-[2px] h-16 bg-gradient-to-b from-secondary/40 to-transparent rounded-full" />

        <div className="relative z-10 p-7 sm:p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center min-h-[380px] text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 flex items-center justify-center border border-emerald-500/20"
                  style={{ boxShadow: "0 16px 48px -12px rgba(16, 185, 129, 0.2)" }}>
                  <CheckCircle className="w-12 h-12 text-emerald-400" />
                </div>
                <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-secondary animate-pulse" />
                <Star className="absolute -bottom-1 -left-2 w-4 h-4 text-secondary/60 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">Message Sent!</h3>
              <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <div className="mt-6 w-16 h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center border border-secondary/10">
                  <MessageSquare className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">Send a Message</h3>
                  <p className="font-body text-xs text-muted-foreground/60 mt-0.5">We typically respond within 24 hours</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-5">
                  {fields.filter(f => f.half).map(field => (
                    <div key={field.key} className="relative">
                      <label className="font-body text-[10px] font-bold text-muted-foreground/70 block mb-2 uppercase tracking-[0.2em]">
                        {field.label} {field.required && <span className="text-secondary">*</span>}
                      </label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        onFocus={() => setFocusedField(field.key)}
                        onBlur={() => setFocusedField(null)}
                        className={inputClass}
                        placeholder={field.placeholder}
                      />
                      {/* Focus indicator */}
                      <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-400 ${focusedField === field.key ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--secondary)), transparent)" }} />
                    </div>
                  ))}
                </div>

                {fields.filter(f => !f.half).map(field => (
                  <div key={field.key} className="relative">
                    <label className="font-body text-[10px] font-bold text-muted-foreground/70 block mb-2 uppercase tracking-[0.2em]">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      onFocus={() => setFocusedField(field.key)}
                      onBlur={() => setFocusedField(null)}
                      className={inputClass}
                      placeholder={field.placeholder}
                    />
                    <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-400 ${focusedField === field.key ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--secondary)), transparent)" }} />
                  </div>
                ))}

                <div className="relative">
                  <label className="font-body text-[10px] font-bold text-muted-foreground/70 block mb-2 uppercase tracking-[0.2em]">
                    Message <span className="text-secondary">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className={`${inputClass} resize-none`}
                    placeholder="Write your message here..."
                  />
                  <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-all duration-400 ${focusedField === "message" ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--secondary)), transparent)" }} />
                </div>

                {/* Submit button */}
                <button type="submit" disabled={submitting}
                  className="relative w-full group overflow-hidden px-6 py-4.5 rounded-2xl font-body text-sm font-bold text-primary-foreground transition-all duration-400 hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--gold)))",
                    boxShadow: "0 8px 32px -8px hsl(var(--secondary) / 0.35), 0 2px 8px -2px hsl(var(--secondary) / 0.2)",
                  }}>
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {/* Edge glow */}
                  <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)" }} />
                  <span className="relative flex items-center justify-center gap-2.5">
                    {submitting ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4.5 h-4.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        <span>Send Message</span>
                      </>
                    )}
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
