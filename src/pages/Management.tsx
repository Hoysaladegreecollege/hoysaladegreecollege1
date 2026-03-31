import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Crown, Shield, BookOpen, GraduationCap, Building2, Landmark } from "lucide-react";
import { LucideIcon } from "lucide-react";

import ramakrishnappaImg from "@/assets/management/ramakrishnappa.jpeg";
import gopalImg from "@/assets/management/gopal.jpeg";
import sureshImg from "@/assets/management/suresh.jpeg";
import jyothiImg from "@/assets/management/jyothi.jpeg";
import gowrishankarImg from "@/assets/management/gowrishankar.jpeg";
import annapurnaImg from "@/assets/management/annapurna.jpeg";

interface Member {
  name: string;
  qualification: string;
  role: string;
  photo: string;
  icon: LucideIcon;
  accent: string;
  isTop?: boolean;
}

const committee: Member[] = [
  { name: "Dr. Ramakrishnappa T", qualification: "M.Sc, Ph.D, Post Doc.", role: "President", photo: ramakrishnappaImg, icon: Crown, accent: "45 80% 55%", isTop: true },
  { name: "Sri Suresh B.V", qualification: "", role: "Treasurer", photo: sureshImg, icon: Shield, accent: "160 60% 45%" },
  { name: "Smt Jyothi N", qualification: "", role: "Secretary", photo: jyothiImg, icon: BookOpen, accent: "280 60% 55%" },
  { name: "Prof. Gowrishankar K.V", qualification: "M.Sc, Trustee – Principal of Hoysala PU College", role: "Trustee", photo: gowrishankarImg, icon: Landmark, accent: "200 70% 50%" },
  { name: "Sri Gopal H.R", qualification: "M.Sc, M.Ed, TET, KSET, Ph.D – Principal of Hoysala Degree College", role: "Principal", photo: gopalImg, icon: GraduationCap, accent: "340 65% 55%", isTop: true },
  { name: "Smt Annapurna T", qualification: "MA, B.Ed", role: "Trustee", photo: annapurnaImg, icon: Building2, accent: "25 70% 50%" },
];

const topMembers = committee.filter(m => m.isTop);
const otherMembers = committee.filter(m => !m.isTop);

export default function Management() {
  return (
    <div>
      <SEOHead title="Top Management Committee" description="Meet the leadership committee of Hoysala Degree College under Shri Shirdi Sai Educational Trust." canonical="/management" />

      {/* Hero */}
      <section className="relative py-20 text-center overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(230,12%,6%) 0%, hsl(228,14%,9%) 50%, hsl(230,10%,5%) 100%)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--gold)), transparent 70%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.25) 50%, transparent 90%)" }} />
        <div className="container relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-6">
            <Crown className="w-3.5 h-3.5" style={{ color: "hsl(var(--gold))" }} />
            <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-white/50">Leadership</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white/95">Top Management Committee</h1>
          <p className="font-body text-sm mt-3 text-white/40">Shri Shirdi Sai Educational Trust (R)</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.15) 50%, transparent 90%)" }} />
      </section>

      {/* Top Leadership */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl">
          <SectionHeading title="Key Leadership" subtitle="The visionary leaders steering the institution towards excellence" />
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {topMembers.map((m, i) => {
              const Icon = m.icon;
              return (
                <ScrollReveal key={m.name} delay={i * 150}>
                  <div className="relative group rounded-3xl overflow-hidden border border-border/50 bg-card transition-all duration-500 hover:shadow-2xl hover:border-border">
                    {/* Accent glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 blur-3xl" style={{ background: `hsl(${m.accent})` }} />
                    {/* Gold top bar */}
                    <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, hsl(${m.accent}), transparent)` }} />

                    <div className="p-8 flex flex-col items-center text-center">
                      {/* Avatar circle */}
                      <div className="relative mb-5">
                        <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl" style={{ borderColor: `hsl(${m.accent} / 0.4)`, boxShadow: `0 0 0 0 hsl(${m.accent} / 0)` }}>
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-10 h-10 rounded-xl flex items-center justify-center border border-border/60 bg-card shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <Icon className="w-4.5 h-4.5" style={{ color: `hsl(${m.accent})` }} />
                        </div>
                      </div>

                      {/* Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border" style={{ borderColor: `hsl(${m.accent} / 0.2)`, background: `hsl(${m.accent} / 0.08)`, color: `hsl(${m.accent})` }}>
                        <Icon className="w-3 h-3" />
                        {m.role}
                      </span>

                      <h3 className="font-display text-xl font-bold text-foreground">{m.name}</h3>
                      {m.qualification && (
                        <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed max-w-xs italic">{m.qualification}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Other Members */}
          <SectionHeading title="Trust Members" subtitle="Dedicated trustees and officers serving the institution" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherMembers.map((m, i) => {
              const Icon = m.icon;
              return (
                <ScrollReveal key={m.name} delay={i * 100}>
                  <div className="relative group rounded-2xl overflow-hidden border border-border/40 bg-card transition-all duration-400 hover:shadow-xl hover:border-border/80 hover:-translate-y-1">
                    <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, hsl(${m.accent} / 0.6), transparent)` }} />
                    <div className="p-6 text-center">
                      <div className="relative mx-auto mb-4">
                        <div className="w-28 h-28 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full mx-auto overflow-hidden transition-all duration-500 group-hover:scale-115 group-hover:shadow-xl" style={{ border: `2px solid hsl(${m.accent} / 0.25)` }}>
                          <img src={m.photo} alt={m.name} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="absolute -bottom-1 right-1/2 translate-x-7 w-8 h-8 rounded-lg flex items-center justify-center border border-border/50 bg-card shadow transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                          <Icon className="w-3.5 h-3.5" style={{ color: `hsl(${m.accent})` }} />
                        </div>
                      </div>

                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase mb-2" style={{ background: `hsl(${m.accent} / 0.08)`, color: `hsl(${m.accent})` }}>
                        {m.role}
                      </span>

                      <h3 className="font-display text-base font-bold text-foreground">{m.name}</h3>
                      {m.qualification && (
                        <p className="font-body text-[11px] text-muted-foreground mt-1.5 leading-relaxed italic">{m.qualification}</p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
