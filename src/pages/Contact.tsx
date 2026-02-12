import SectionHeading from "@/components/SectionHeading";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

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
            {/* Info */}
            <div>
              <SectionHeading title="Get in Touch" centered={false} subtitle="We'd love to hear from you. Reach out to us anytime." />
              <div className="space-y-6 mt-6">
                {[
                  { icon: MapPin, label: "Address", value: "Nelamangala, Bangalore, Karnataka – 562123" },
                  { icon: Phone, label: "Phone", value: "+91 80 XXXX XXXX" },
                  { icon: Mail, label: "Email", value: "info@hoysalacollege.edu" },
                  { icon: Clock, label: "Office Hours", value: "Mon – Sat: 9:00 AM – 5:00 PM" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="font-body text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-xl font-bold text-foreground mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Full Name</label>
                  <input className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your name" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Email</label>
                  <input type="email" className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Subject</label>
                  <input className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Subject" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Message</label>
                  <textarea rows={4} className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" placeholder="Your message..." />
                </div>
                <Button className="w-full font-body bg-primary text-primary-foreground">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
