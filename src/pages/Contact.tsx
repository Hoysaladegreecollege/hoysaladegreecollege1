import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
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
    { icon: MapPin, label: "Address", value: "K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123", link: undefined },
    { icon: Phone, label: "Phone Numbers", value: "7676272167 • 7975344252 • 8618181383 • 7892508243", link: "tel:7676272167" },
    { icon: Mail, label: "Email", value: "principal.hoysaladegreecollege@gmail.com", link: "mailto:principal.hoysaladegreecollege@gmail.com" },
    { icon: Clock, label: "Office Hours", value: "Mon – Sat: 9:00 AM – 5:00 PM", link: undefined },
  ];

  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Contact</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <SectionHeading title="Get in Touch" centered={false} subtitle="We'd love to hear from you." />
                <div className="space-y-6 mt-6">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                        {item.link ? (
                          <a href={item.link} className="font-body text-sm text-primary hover:underline">{item.value}</a>
                        ) : (
                          <p className="font-body text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["7676272167", "7975344252", "8618181383", "7892508243"].map((num) => (
                    <a key={num} href={`tel:${num}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-border font-body text-xs text-primary hover:bg-primary/10 transition-colors">
                      <Phone className="w-3 h-3" /> {num}
                    </a>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">Send us a Message</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-1">Full Name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-1">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-1">Subject</label>
                    <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow" placeholder="Subject" />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-foreground block mb-1">Message *</label>
                    <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-shadow" placeholder="Your message..." />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full font-body bg-primary text-primary-foreground">
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
