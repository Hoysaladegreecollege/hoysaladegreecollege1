import developerPhoto from "@/assets/developer-pavan.jpg";
import { Code2, GraduationCap, Globe, Award, ArrowUpRight, MessageCircle, Instagram, Mail, Github } from "lucide-react";

const socialLinks = [
  { href: "https://pavan-05.framer.ai/", icon: Globe, label: "Portfolio" },
  { href: "https://github.com/pavana05", icon: Github, label: "GitHub" },
  { href: "https://www.instagram.com/_pavan_05._/", icon: Instagram, label: "Instagram" },
  { href: "https://api.whatsapp.com/send/?phone=9036048950&text=Hello+pavan+%F0%9F%91%8B&type=phone_number&app_absent=0", icon: MessageCircle, label: "WhatsApp" },
  { href: "mailto:pavan05@flash.co", icon: Mail, label: "Email" },
];

export function DeveloperShowcase() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="group relative rounded-[2rem] overflow-hidden bg-card/60 backdrop-blur-2xl border border-border/30 shadow-2xl hover:shadow-[0_30px_80px_-20px_hsl(var(--secondary)/0.2)] transition-all duration-700">
        {/* Top accent bar with animation */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.8s] ease-in-out" />

        {/* Ambient inner glow — intensifies on hover */}
        <div className="absolute -top-24 right-0 w-72 h-72 rounded-full bg-secondary/[0.04] blur-[80px] group-hover:bg-secondary/[0.12] group-hover:w-80 group-hover:h-80 transition-all duration-1000" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-primary/[0.03] blur-[60px] group-hover:bg-primary/[0.08] transition-all duration-1000" />

        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-[2rem] border-2 border-secondary/0 group-hover:border-secondary/10 transition-all duration-700 pointer-events-none" />

        <div className="relative p-8 sm:p-12 lg:p-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Photo with premium hover */}
            <div className="relative shrink-0">
              <div className="absolute -inset-3 rounded-[1.8rem] bg-gradient-to-br from-secondary/20 via-secondary/5 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative group/photo">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[1.5rem] overflow-hidden border-2 border-secondary/15 shadow-2xl group-hover:border-secondary/30 group-hover/photo:shadow-[0_20px_60px_-15px_hsl(var(--secondary)/0.3)] transition-all duration-700">
                  <img
                    src={developerPhoto}
                    alt="Pavan A - Developer"
                    className="w-full h-full object-cover group-hover:scale-[1.05] group-hover/photo:brightness-110 transition-all duration-700"
                  />
                  {/* Photo overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent opacity-0 group-hover/photo:opacity-100 transition-opacity duration-500" />
                </div>
                {/* Badge with bounce */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-secondary text-secondary-foreground px-5 py-2 rounded-full text-xs font-bold shadow-xl whitespace-nowrap border border-secondary/30 group-hover:-translate-y-1 transition-transform duration-500">
                  <Code2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-500" />
                  Full-Stack Developer
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left space-y-5">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Award className="w-5 h-5 text-secondary animate-[creditsPulseGlow_3s_ease-in-out_infinite]" />
                  <span className="font-body text-xs text-secondary font-semibold tracking-widest uppercase">Lead Developer</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight group-hover:tracking-wide transition-all duration-700">
                  PAVAN A
                </h2>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-muted-foreground font-body text-sm">
                    <GraduationCap className="w-4 h-4 text-secondary/80" /> BCA Department
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5 text-muted-foreground font-body text-sm">
                    <Globe className="w-4 h-4 text-secondary/80" /> Web Developer
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed max-w-lg">
                Designed and developed the entire Hoysala Degree College web portal — from the public-facing website to the comprehensive admin, teacher, and student dashboards — with passion, precision, and modern best practices.
              </p>

              {/* Social Links with stagger animation */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                {socialLinks.map((social, i) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group/s relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/40 text-muted-foreground overflow-hidden hover:bg-secondary/10 hover:border-secondary/25 hover:text-foreground hover:shadow-[0_4px_20px_hsl(var(--secondary)/0.1)] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {/* Ripple glow */}
                    <span className="absolute inset-0 bg-gradient-to-r from-secondary/0 via-secondary/5 to-secondary/0 opacity-0 group-hover/s:opacity-100 transition-opacity duration-500" />
                    <social.icon className="relative w-4 h-4 group-hover/s:text-secondary group-hover/s:scale-110 transition-all duration-300" />
                    <span className="relative font-body text-xs font-medium">{social.label}</span>
                  </a>
                ))}
              </div>

              {/* Portfolio CTA with magnetic hover */}
              <a
                href="https://pavan-05.framer.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-secondary/15 to-secondary/5 hover:from-secondary/25 hover:to-secondary/15 border border-secondary/20 hover:border-secondary/40 text-foreground font-semibold text-sm overflow-hidden transition-all duration-500 shadow-lg shadow-secondary/5 hover:shadow-[0_10px_40px_-10px_hsl(var(--secondary)/0.3)] hover:-translate-y-1"
              >
                {/* Sweep light */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                <Globe className="relative w-4 h-4 text-secondary group-hover/cta:rotate-[360deg] transition-transform duration-700" />
                <span className="relative">View Full Portfolio</span>
                <ArrowUpRight className="relative w-4 h-4 text-muted-foreground group-hover/cta:text-secondary group-hover/cta:-translate-y-1 group-hover/cta:translate-x-1 transition-all duration-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
