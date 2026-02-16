import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAPS_LINK = "https://maps.app.goo.gl/YGNgC5ev7v4pJWve9";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name, email: form.email, subject: form.subject, message: form.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  const contactInfo = [
    { icon: MapPin, label: "Address", value: "K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123", link: MAPS_LINK, external: true },
    { icon: Phone, label: "Phone Numbers", value: "7676272167 • 7975344252 • 8618181383 • 7892508243", link: "tel:7676272167" },
    { icon: Mail, label: "Email", value: "principal.hoysaladegreecollege@gmail.com", link: "mailto:principal.hoysaladegreecollege@gmail.com" },
    { icon: Clock, label: "Office Hours", value: "Mon – Sat: 9:00 AM – 5:00 PM", link: undefined },
  ];

  const inputClass = "w-full border border-border rounded-xl px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="page-enter">
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-12">
            <ScrollReveal>
              <div>
                <SectionHeading title="Get in Touch" centered={false} subtitle="Reach out for admissions, queries, or campus visits." />
                <div className="space-y-5 mt-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-4 items-start group">
                      <div className="icon-glow w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                        {item.link ? (
                          <a href={item.link} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}
                            className="font-body text-sm text-primary hover:underline transition-colors">{item.value}</a>
                        ) : (
                          <p className="font-body text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["7676272167", "7975344252", "8618181383", "7892508243"].map((num) => (
                    <a key={num} href={`tel:${num}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-border font-body text-xs text-primary hover:bg-primary/10 hover:scale-105 transition-all duration-300">
                      <Phone className="w-3 h-3" /> {num}
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="premium-card p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" /> Send us a Message
                </h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} placeholder="Subject" />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Message *</label>
                    <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} placeholder="Your message..." />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full font-body bg-primary text-primary-foreground rounded-xl hover:scale-[1.02] transition-transform">
                    {submitting ? "Sending..." : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Map embed */}
      <section className="py-0">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.8!2d77.38!3d13.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNelamangala!5e0!3m2!1sen!2sin!4v1"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="w-full"
        />
      </section>
    </div>
  );
}
