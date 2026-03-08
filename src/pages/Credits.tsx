import SEOHead from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";
import developerPhoto from "@/assets/developer-pavan.jpg";
import { Code2, GraduationCap, Globe, Heart, Sparkles, Github, Mail, ExternalLink, Cpu, Palette, Database, Shield, Rocket, Star, Zap, Layers, MessageCircle, Instagram, ArrowUpRight, Award, Terminal, Coffee } from "lucide-react";

const techStack = [
  { name: "React 18", icon: Code2, desc: "Component Library" },
  { name: "TypeScript", icon: Cpu, desc: "Type Safety" },
  { name: "Tailwind CSS", icon: Palette, desc: "Utility Styling" },
  { name: "Lovable Cloud", icon: Database, desc: "Backend & Auth" },
  { name: "Vite", icon: Rocket, desc: "Build Tool" },
  { name: "RLS Security", icon: Shield, desc: "Row-Level Security" },
  { name: "Web Push", icon: Zap, desc: "Notifications" },
  { name: "Recharts", icon: Layers, desc: "Data Visualization" },
];

const projectStats = [
  { label: "Pages Built", value: "40+", icon: Layers },
  { label: "Components", value: "80+", icon: Code2 },
  { label: "Database Tables", value: "25+", icon: Database },
  { label: "Edge Functions", value: "8+", icon: Zap },
];

const features = [
  "Multi-role dashboards (Admin, Teacher, Student, Principal)",
  "Real-time attendance tracking & analytics",
  "Fee management with email & WhatsApp reminders",
  "Push notifications for instant alerts",
  "Admission application portal with tracking",
  "Study materials & timetable management",
  "Birthday wishes automation",
  "Top ranker showcase with achievements",
];

const socialLinks = [
  { href: "https://pavan-05.framer.ai/", icon: Globe, label: "Portfolio" },
  { href: "https://github.com/pavana05", icon: Github, label: "GitHub" },
  { href: "https://www.instagram.com/_pavan_05._/", icon: Instagram, label: "Instagram" },
  { href: "https://api.whatsapp.com/send/?phone=9036048950&text=Hello+pavan+%F0%9F%91%8B&type=phone_number&app_absent=0", icon: MessageCircle, label: "WhatsApp" },
  { href: "mailto:pavan05@flash.co", icon: Mail, label: "Email" },
];

export default function Credits() {
  return (
    <>
      <SEOHead
        title="Website Credits | Hoysala Degree College"
        description="Credits and acknowledgments for the Hoysala Degree College website."
      />

      {/* ─── HERO ─── */}
      <section className="relative pt-28 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
        <div className="absolute top-16 right-[15%] w-[420px] h-[420px] rounded-full bg-secondary/[0.04] blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] rounded-full bg-primary/[0.03] blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/[0.02] blur-[150px]" />

        {/* Floating grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "radial-gradient(hsl(var(--secondary)/0.3) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="container relative px-5 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-xs font-body font-medium mb-6 backdrop-blur-sm">
              <Terminal className="w-3.5 h-3.5" />
              Crafted with passion & precision
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
              Website <span className="text-secondary">Credits</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-5 text-muted-foreground font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Acknowledging the talent, dedication, and modern craft behind this digital experience.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-secondary/40" />
              <Sparkles className="w-4 h-4 text-secondary/60" />
              <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-secondary/40" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── DEVELOPER SHOWCASE ─── */}
      <section className="pb-24 sm:pb-32">
        <div className="container px-5">

          {/* Developer Card */}
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="group relative rounded-[2rem] overflow-hidden bg-card/60 backdrop-blur-2xl border border-border/30 shadow-2xl hover:shadow-[0_30px_80px_-20px_hsl(var(--secondary)/0.15)] transition-all duration-700">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
                {/* Shimmer sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out" />
                {/* Ambient inner glow */}
                <div className="absolute -top-24 right-0 w-72 h-72 rounded-full bg-secondary/[0.04] blur-[80px] group-hover:bg-secondary/[0.08] transition-all duration-700" />
                <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-primary/[0.03] blur-[60px]" />

                <div className="relative p-8 sm:p-12 lg:p-14">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                    {/* Photo */}
                    <div className="relative shrink-0">
                      <div className="absolute -inset-3 rounded-[1.8rem] bg-gradient-to-br from-secondary/20 via-secondary/5 to-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative">
                        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[1.5rem] overflow-hidden border-2 border-secondary/15 shadow-2xl group-hover:border-secondary/30 transition-all duration-700">
                          <img
                            src={developerPhoto}
                            alt="Pavan A - Developer"
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          />
                        </div>
                        {/* Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-secondary text-secondary-foreground px-5 py-2 rounded-full text-xs font-bold shadow-xl whitespace-nowrap border border-secondary/30">
                          <Code2 className="w-3.5 h-3.5" />
                          Full-Stack Developer
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center lg:text-left space-y-5">
                      <div>
                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                          <Award className="w-5 h-5 text-secondary" />
                          <span className="font-body text-xs text-secondary font-semibold tracking-widest uppercase">Lead Developer</span>
                        </div>
                        <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
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

                      {/* Social Links */}
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                        {socialLinks.map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="group/s flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/40 text-muted-foreground hover:bg-secondary/10 hover:border-secondary/25 hover:text-foreground transition-all duration-300 backdrop-blur-sm"
                          >
                            <social.icon className="w-4 h-4 group-hover/s:text-secondary transition-colors duration-300" />
                            <span className="font-body text-xs font-medium">{social.label}</span>
                          </a>
                        ))}
                      </div>

                      {/* Portfolio CTA */}
                      <a
                        href="https://pavan-05.framer.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/cta inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-secondary/15 to-secondary/5 hover:from-secondary/25 hover:to-secondary/10 border border-secondary/20 hover:border-secondary/40 text-foreground font-semibold text-sm transition-all duration-300 shadow-lg shadow-secondary/5 hover:shadow-secondary/10"
                      >
                        <Globe className="w-4 h-4 text-secondary" />
                        View Full Portfolio
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover/cta:text-secondary group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 transition-all duration-300" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ─── PROJECT STATS ─── */}
          <ScrollReveal delay={100}>
            <div className="max-w-4xl mx-auto mt-12">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {projectStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="group/stat relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-xl p-6 text-center hover:border-secondary/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.03] to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/10 flex items-center justify-center mx-auto mb-3 group-hover/stat:scale-110 transition-transform duration-300">
                        <stat.icon className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="font-display text-3xl sm:text-4xl font-bold text-foreground tabular-nums">{stat.value}</p>
                      <p className="font-body text-xs text-muted-foreground mt-1 tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ─── KEY FEATURES ─── */}
          <ScrollReveal delay={200}>
            <div className="max-w-4xl mx-auto mt-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-xs font-body font-medium mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Feature Highlights
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  What's Inside
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="group/f relative flex items-start gap-4 p-4.5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-secondary/20 hover:bg-card/70 transition-all duration-300"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/f:scale-110 transition-transform duration-300">
                      <Star className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <span className="font-body text-sm text-foreground/90 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ─── TECH STACK ─── */}
          <ScrollReveal delay={300}>
            <div className="max-w-4xl mx-auto mt-16">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-xs font-body font-medium mb-3">
                  <Rocket className="w-3.5 h-3.5" />
                  Technology
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Built With
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="group/tech relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-secondary/20 hover:bg-card/70 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.02] to-transparent opacity-0 group-hover/tech:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/[0.02] border border-secondary/10 flex items-center justify-center group-hover/tech:scale-110 group-hover/tech:border-secondary/20 transition-all duration-300">
                      <tech.icon className="w-7 h-7 text-secondary/80 group-hover/tech:text-secondary transition-colors duration-300" />
                    </div>
                    <div className="relative">
                      <span className="font-body text-sm font-semibold text-foreground">{tech.name}</span>
                      <p className="font-body text-[10px] text-muted-foreground mt-0.5 tracking-wide">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ─── FOOTER NOTE ─── */}
          <ScrollReveal delay={400}>
            <div className="max-w-lg mx-auto mt-20 text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-border" />
                <Coffee className="w-4 h-4 text-muted-foreground/50" />
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-border" />
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-xl border border-border/30 text-muted-foreground text-xs sm:text-sm font-body shadow-lg">
                Made with <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" /> by Pavan A
                <span className="text-border">•</span>
                <Star className="w-3.5 h-3.5 text-secondary" /> 2024–2025
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
