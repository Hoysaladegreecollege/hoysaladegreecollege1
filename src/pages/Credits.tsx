import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import developerPhoto from "@/assets/developer-pavan.jpg";
import { Code2, GraduationCap, Globe, Heart, Sparkles, Github, Mail, ExternalLink, Cpu, Palette, Database, Shield, Rocket, Star, Zap, Layers, MessageCircle, Instagram, Phone } from "lucide-react";

const techStack = [
  { name: "React 18", icon: Code2, color: "from-blue-500/20 to-cyan-500/10", desc: "Component Library" },
  { name: "TypeScript", icon: Cpu, color: "from-blue-600/20 to-indigo-500/10", desc: "Type Safety" },
  { name: "Tailwind CSS", icon: Palette, color: "from-teal-500/20 to-emerald-500/10", desc: "Utility Styling" },
  { name: "Lovable Cloud", icon: Database, color: "from-purple-500/20 to-pink-500/10", desc: "Backend & Auth" },
  { name: "Vite", icon: Rocket, color: "from-amber-500/20 to-orange-500/10", desc: "Build Tool" },
  { name: "RLS Security", icon: Shield, color: "from-red-500/20 to-rose-500/10", desc: "Row-Level Security" },
  { name: "Web Push", icon: Zap, color: "from-yellow-500/20 to-amber-500/10", desc: "Notifications" },
  { name: "Recharts", icon: Layers, color: "from-indigo-500/20 to-violet-500/10", desc: "Data Visualization" },
];

const projectStats = [
  { label: "Pages Built", value: "40+" },
  { label: "Components", value: "80+" },
  { label: "Database Tables", value: "25+" },
  { label: "Edge Functions", value: "8+" },
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

export default function Credits() {
  return (
    <>
      <SEOHead
        title="Website Credits | Hoysala Degree College"
        description="Credits and acknowledgments for the Hoysala Degree College website."
      />

      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-secondary/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="container relative px-5">
          <SectionHeading
            title="Website Credits"
            subtitle="Acknowledging the talent and dedication behind this digital experience"
          />
        </div>
      </section>

      {/* Developer Card */}
      <section className="pb-20 sm:pb-28">
        <div className="container px-5">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="group relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-700">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                <div className="relative p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    {/* Photo */}
                    <div className="relative shrink-0">
                      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-secondary/30 via-primary/20 to-secondary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden border-4 border-secondary/20 shadow-lg group-hover:border-secondary/40 transition-colors duration-500">
                        <img src={developerPhoto} alt="Pavan A - Developer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                        <Code2 className="w-3 h-3" /> Full-Stack Developer
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                      <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">PAVAN A</h2>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                          <span className="flex items-center gap-1.5 text-muted-foreground font-body text-sm">
                            <GraduationCap className="w-4 h-4 text-secondary" /> BCA Department
                          </span>
                          <span className="flex items-center gap-1.5 text-muted-foreground font-body text-sm">
                            <Globe className="w-4 h-4 text-secondary" /> Web Developer
                          </span>
                        </div>
                      </div>

                      <p className="text-muted-foreground font-body text-sm leading-relaxed">
                        Designed and developed the entire Hoysala Degree College web portal — from the public-facing website to the comprehensive admin, teacher, and student dashboards — with passion, precision, and modern best practices.
                      </p>

                      {/* Social Links */}
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        {[
                          { href: "https://pavan-05.framer.ai/", icon: Globe, label: "Portfolio", color: "hover:bg-blue-500/15 hover:border-blue-500/30 hover:text-blue-500" },
                          { href: "https://github.com/pavana05", icon: Github, label: "GitHub", color: "hover:bg-foreground/10 hover:border-foreground/20 hover:text-foreground" },
                          { href: "https://www.instagram.com/_pavan_05._/", icon: Instagram, label: "Instagram", color: "hover:bg-pink-500/15 hover:border-pink-500/30 hover:text-pink-500" },
                          { href: "https://api.whatsapp.com/send/?phone=9036048950&text=Hello+pavan+%F0%9F%91%8B&type=phone_number&app_absent=0", icon: MessageCircle, label: "WhatsApp", color: "hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-500" },
                          { href: "mailto:pavan05@flash.co", icon: Mail, label: "Email", color: "hover:bg-amber-500/15 hover:border-amber-500/30 hover:text-amber-500" },
                        ].map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className={`group/social flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/50 border border-border/50 text-muted-foreground transition-all duration-300 ${social.color}`}
                          >
                            <social.icon className="w-4 h-4" />
                            <span className="font-body text-xs font-medium">{social.label}</span>
                          </a>
                        ))}
                      </div>

                      {/* Portfolio Link */}
                      <a
                        href="https://pavan-05.framer.ai/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 hover:border-secondary/40 text-foreground font-semibold text-sm transition-all duration-300"
                      >
                        <Globe className="w-4 h-4 text-secondary" />
                        View Portfolio
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/link:text-secondary transition-colors" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Project Stats */}
          <ScrollReveal delay={100}>
            <div className="max-w-3xl mx-auto mt-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {projectStats.map((stat) => (
                  <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    <p className="font-display text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Key Features */}
          <ScrollReveal delay={200}>
            <div className="max-w-3xl mx-auto mt-10">
              <h3 className="text-center font-display text-lg sm:text-xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" /> Key Features Built
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/50 hover:border-secondary/30 transition-all duration-300">
                    <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Star className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="font-body text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Tech Stack */}
          <ScrollReveal delay={300}>
            <div className="max-w-3xl mx-auto mt-10">
              <h3 className="text-center font-display text-lg sm:text-xl font-semibold text-foreground mb-6 flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5 text-secondary" /> Built With
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {techStack.map((tech, i) => (
                  <div
                    key={tech.name}
                    className="group/tech flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shrink-0 group-hover/tech:scale-110 transition-transform duration-300`}>
                      <tech.icon className="w-6 h-6 text-foreground/80" />
                    </div>
                    <span className="font-body text-sm font-medium text-foreground">{tech.name}</span>
                    <span className="font-body text-[10px] text-muted-foreground">{tech.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Footer note */}
          <ScrollReveal delay={400}>
            <div className="max-w-lg mx-auto mt-14 text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/5 border border-secondary/10 text-muted-foreground text-xs sm:text-sm font-body">
                Made with <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" /> by Pavan A
                <span className="text-secondary/40">•</span>
                <Star className="w-3.5 h-3.5 text-secondary" /> 2024–2025
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
