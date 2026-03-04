import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import developerPhoto from "@/assets/developer-pavan.jpg";
import { Code2, GraduationCap, Globe, Heart, Sparkles, Github, Linkedin, Mail, ExternalLink, Cpu, Palette, Database, Shield, Rocket, Star } from "lucide-react";

const techStack = [
  { name: "React", icon: Code2, color: "from-blue-500/20 to-cyan-500/10" },
  { name: "TypeScript", icon: Cpu, color: "from-blue-600/20 to-indigo-500/10" },
  { name: "Tailwind CSS", icon: Palette, color: "from-teal-500/20 to-emerald-500/10" },
  { name: "Lovable Cloud", icon: Database, color: "from-purple-500/20 to-pink-500/10" },
  { name: "Vite", icon: Rocket, color: "from-amber-500/20 to-orange-500/10" },
  { name: "RLS Security", icon: Shield, color: "from-red-500/20 to-rose-500/10" },
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
            <div className="max-w-2xl mx-auto">
              {/* Main Card */}
              <div className="group relative rounded-3xl overflow-hidden bg-card border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-700">
                {/* Gradient top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary opacity-80 group-hover:opacity-100 transition-opacity" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

                <div className="relative p-8 sm:p-10">
                  {/* Photo + Info */}
                  <div className="flex flex-col items-center text-center gap-6">
                    {/* Photo with glow */}
                    <div className="relative">
                      <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-secondary/30 via-primary/20 to-secondary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-secondary/20 shadow-lg group-hover:border-secondary/40 transition-colors duration-500">
                        <img
                          src={developerPhoto}
                          alt="Pavan A - Developer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      {/* Badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        <Code2 className="w-3 h-3" />
                        Developer
                      </div>
                    </div>

                    {/* Name & Details */}
                    <div className="space-y-3">
                      <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                        PAVAN A
                      </h2>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <GraduationCap className="w-4 h-4 text-secondary" />
                        <span className="font-body text-sm sm:text-base">BCA Department</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Globe className="w-4 h-4 text-secondary" />
                        <span className="font-body text-sm sm:text-base">Full-Stack Web Developer</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full flex items-center gap-3">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-border" />
                      <Sparkles className="w-4 h-4 text-secondary/60" />
                      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-border" />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground font-body text-sm sm:text-base leading-relaxed max-w-md">
                      Designed and developed the entire Hoysala Degree College web portal — from the public-facing website to the comprehensive admin, teacher, and student dashboards — with passion and precision.
                    </p>

                    {/* Link */}
                    <a
                      href="https://hoysaladegreecollege1.lovable.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 hover:border-secondary/40 text-foreground font-semibold text-sm transition-all duration-300"
                    >
                      <Globe className="w-4 h-4 text-secondary" />
                      hoysaladegreecollege1.lovable.app
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover/link:text-secondary transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Tech Stack */}
          <ScrollReveal delay={200}>
            <div className="max-w-3xl mx-auto mt-16">
              <h3 className="text-center font-display text-lg sm:text-xl font-semibold text-foreground mb-8 flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5 text-secondary" />
                Built With
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {techStack.map((tech, i) => (
                  <div
                    key={tech.name}
                    className="group/tech flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-secondary/30 hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tech.color} flex items-center justify-center shrink-0 group-hover/tech:scale-110 transition-transform duration-300`}>
                      <tech.icon className="w-5 h-5 text-foreground/80" />
                    </div>
                    <span className="font-body text-sm font-medium text-foreground">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Footer note */}
          <ScrollReveal delay={400}>
            <div className="max-w-lg mx-auto mt-16 text-center">
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
