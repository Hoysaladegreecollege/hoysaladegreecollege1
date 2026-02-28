import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAPS_LINK = "https://maps.app.goo.gl/nqvvEX7kgB7wQVKb7";

const contactInfo = [
  {
    icon: MapPin,
    label: "Address",
    value: "K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123",
    link: MAPS_LINK,
    external: true,
    color: "from-blue-500/10 to-blue-500/3",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: Phone,
    label: "Phone Numbers",
    value: "7676272167 • 7975344252 • 8618181383 • 7892508243",
    link: "tel:7676272167",
    color: "from-emerald-500/10 to-emerald-500/3",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: Mail,
    label: "Email",
    value: "principal.hoysaladegreecollege@gmail.com",
    link: "mailto:principal.hoysaladegreecollege@gmail.com",
    color: "from-primary/10 to-primary/3",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Sat: 9:00 AM – 5:00 PM",
    link: undefined,
    color: "from-secondary/12 to-secondary/3",
    iconBg: "bg-secondary/15",
    iconColor: "text-secondary-foreground",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 4000);
    }
  };

  const inputClass =
    "w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-primary/25 hover:shadow-sm";

  return (
    <div className="page-enter">
      <SEOHead
        title="Contact Us"
        description="Contact Hoysala Degree College Nelamangala. Phone: 7676272167, Email: principal.hoysaladegreecollege@gmail.com. Visit us at K.R.P. Arcade, Nelamangala."
        canonical="/contact"
      />
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-5xl px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Get in Touch" subtitle="Reach out for admissions, queries, or campus visits." />
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-10 sm:gap-12 mt-10">
            {/* Contact Info */}
            <ScrollReveal>
              <div className="space-y-3">
                {contactInfo.map((item, i) => (
                  <div
                    key={item.label}
                    className={`flex gap-4 items-start p-4 rounded-2xl bg-gradient-to-br ${item.color} border border-border/40 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-300 group spotlight`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 shadow-sm`}
                    >
                      <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-body text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200 break-words"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Quick dial chips */}
                <div className="pt-2">
                  <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                    Quick Dial
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["7676272167", "7975344252", "8618181383", "7892508243"].map((num) => (
                      <a
                        key={num}
                        href={`tel:${num}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border font-body text-xs text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 hover:shadow-md transition-all duration-300"
                      >
                        <Phone className="w-3 h-3" /> {num}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Message Form */}
            <ScrollReveal delay={200}>
              <div className="premium-card p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-secondary/6 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-72 animate-scale-bounce text-center">
                    <div className="relative w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5 shadow-lg border border-emerald-100">
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                      <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-secondary animate-sparkle" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-2">Message Sent! 🎉</h3>
                    <p className="font-body text-sm text-muted-foreground max-w-xs">
                      We'll get back to you soon. Thank you for reaching out!
                    </p>
                    <div className="mt-5 flex gap-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-secondary animate-bounce"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2 relative z-10">
                      <Send className="w-5 h-5 text-primary" /> Send us a Message
                    </h3>
                    <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-xs font-semibold text-foreground block mb-1.5">
                            Full Name *
                          </label>
                          <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="font-body text-xs font-semibold text-foreground block mb-1.5">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={inputClass}
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Subject</label>
                        <input
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className={inputClass}
                          placeholder="How can we help?"
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs font-semibold text-foreground block mb-1.5">
                          Message *
                        </label>
                        <textarea
                          rows={4}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className={`${inputClass} resize-none`}
                          placeholder="Write your message here..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="relative w-full group overflow-hidden px-6 py-3.5 rounded-xl font-body text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 disabled:opacity-60 shadow-lg btn-magnetic"
                        style={{
                          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))",
                          boxShadow: "0 4px 20px hsl(var(--primary) / 0.3)",
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <span className="relative flex items-center justify-center gap-2">
                          {submitting ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />{" "}
                              Send Message
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="relative overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        <div className="relative overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.8!2d77.38!3d13.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNelamangala!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="340"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            className="w-full opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
          {/* Map overlay gradient */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
