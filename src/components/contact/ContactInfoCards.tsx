import { MapPin, Phone, Mail, Clock, ArrowUpRight, Globe } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const MAPS_LINK = "https://maps.app.goo.gl/TrQbMQQB5kqVueQAA";

const contactInfo = [
  {
    icon: MapPin, label: "Visit Us",
    value: "K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123",
    link: MAPS_LINK, external: true,
    accentHsl: "42 75% 55%",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: Phone, label: "Call Us",
    value: "7676272167 • 7975344252 • 8618181383 • 7892508243",
    link: "tel:7676272167",
    accentHsl: "142 70% 45%",
    gradient: "from-emerald-500/15 to-emerald-500/5",
  },
  {
    icon: Mail, label: "Email Us",
    value: "principal.hoysaladegreecollege@gmail.com",
    link: "mailto:principal.hoysaladegreecollege@gmail.com",
    accentHsl: "220 55% 48%",
    gradient: "from-primary/15 to-primary/5",
  },
  {
    icon: Clock, label: "Office Hours",
    value: "Monday – Saturday: 9:00 AM – 5:00 PM",
    link: undefined,
    accentHsl: "42 87% 55%",
    gradient: "from-secondary/15 to-secondary/5",
  },
];

export default function ContactInfoCards() {
  return (
    <ScrollReveal>
      <div className="space-y-4">
        {contactInfo.map((item, i) => (
          <div
            key={item.label}
            className="group relative rounded-[1.25rem] border border-border/30 bg-card/80 backdrop-blur-xl overflow-hidden active:scale-[0.98] touch-manipulation"
            style={{
              transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
              animationDelay: `${i * 100}ms`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.01)";
              (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px -15px hsla(${item.accentHsl}, 0.15), 0 0 0 1px hsla(${item.accentHsl}, 0.08)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "";
            }}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `linear-gradient(135deg, hsla(${item.accentHsl}, 0.06), transparent 60%)` }} />
            
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left"
              style={{ background: `linear-gradient(90deg, hsla(${item.accentHsl}, 0.6), hsla(${item.accentHsl}, 0.1))` }} />
            
            {/* Corner glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{ background: `radial-gradient(circle, hsla(${item.accentHsl}, 0.08), transparent 70%)` }} />

            <div className="relative z-10 flex gap-5 items-start p-6">
              {/* Icon container with glow */}
              <div className="relative shrink-0">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center border border-border/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  style={{ boxShadow: `0 8px 24px -8px hsla(${item.accentHsl}, 0.15)` }}>
                  <item.icon className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition-colors duration-300" />
                </div>
                {/* Pulse ring on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: `0 0 0 3px hsla(${item.accentHsl}, 0.08)` }} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-body text-[11px] font-bold text-secondary/80 uppercase tracking-[0.2em] mb-1.5">{item.label}</p>
                {item.link ? (
                  <a href={item.link} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}
                    className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 break-words inline-flex items-start gap-1.5 group/link leading-relaxed">
                    <span>{item.value}</span>
                    {item.external && <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all duration-300" />}
                  </a>
                ) : (
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.value}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Quick Dial Section */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-[2px] bg-gradient-to-r from-secondary to-secondary/20 rounded-full" />
            <p className="font-body text-[11px] font-bold text-secondary/80 uppercase tracking-[0.2em]">Quick Dial</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {["7676272167", "7975344252", "8618181383", "7892508243"].map((num) => (
              <a key={num} href={`tel:${num}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/30 font-body text-xs font-medium text-foreground/80 hover:bg-secondary/10 hover:text-secondary hover:border-secondary/30 hover:scale-105 hover:shadow-lg transition-all duration-400 active:scale-95 touch-manipulation"
                style={{ transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                <Phone className="w-3 h-3" /> {num}
              </a>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
