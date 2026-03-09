import { MapPin, Navigation } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const MAPS_LINK = "https://maps.app.goo.gl/TrQbMQQB5kqVueQAA";

export default function ContactMap() {
  return (
    <section className="relative overflow-hidden">
      {/* Divider */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      {/* Map header */}
      <div className="bg-background py-10 sm:py-14">
        <div className="container max-w-5xl px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/15 mb-4">
                <Navigation className="w-3.5 h-3.5 text-secondary" />
                <span className="font-body text-[11px] font-bold text-secondary uppercase tracking-[0.15em]">Find Us</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Our Location</h2>
              <p className="font-body text-sm text-muted-foreground/60 mt-2">Visit our campus in Nelamangala, Bengaluru</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Map embed with glassmorphism frame */}
      <div className="container max-w-6xl px-4 -mt-2 pb-10 sm:pb-14">
        <ScrollReveal>
          <div className="relative rounded-[2rem] overflow-hidden border border-border/20 bg-card/40 backdrop-blur-sm"
            style={{ boxShadow: "0 16px 64px -16px rgba(0,0,0,0.12)" }}>
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent z-10" />
            
            <iframe
              src="https://maps.google.com/maps?q=Hoysala+Degree+College+Nelamangala&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%" height="420" style={{ border: 0, display: "block" }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full opacity-90 hover:opacity-100 transition-opacity duration-700"
            />
            
            {/* Gradient overlays for blending */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-card/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card/30 to-transparent pointer-events-none" />
          </div>

          {/* Get Directions CTA */}
          <div className="flex justify-center mt-8">
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-body font-bold text-sm text-primary-foreground overflow-hidden transition-all duration-400 hover:scale-105 hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))",
                boxShadow: "0 8px 32px -8px hsl(var(--primary) / 0.35)",
              }}>
              {/* Shimmer */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <MapPin className="w-4.5 h-4.5 relative z-10 group-hover:scale-110 transition-transform" />
              <span className="relative z-10">Get Directions</span>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
