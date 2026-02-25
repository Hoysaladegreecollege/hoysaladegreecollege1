import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Target, Eye, BookOpen, Users, Award, Heart, MapPin, Phone, Mail, Clock, GraduationCap, Shield, Globe, Briefcase, Wifi, Coffee, TrendingUp, Star, Sparkles, ChevronRight } from "lucide-react";
import principalImage from "@/assets/principal.jpg";

const tocSections = [
  { id: "about-intro", label: "About", icon: BookOpen },
  { id: "quick-facts", label: "Quick Facts", icon: Star },
  { id: "principals-message", label: "Principal's Message", icon: GraduationCap },
  { id: "vision-mission", label: "Vision & Mission", icon: Eye },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "core-values", label: "Core Values", icon: Heart },
  { id: "facilities", label: "Facilities", icon: Shield },
  { id: "contact", label: "Reach Us", icon: MapPin },
];

const values = [
  { icon: BookOpen, title: "Academic Excellence", desc: "Rigorous curriculum designed to meet industry standards and foster innovation.", color: "from-blue-500/15 to-blue-500/5", iconColor: "text-blue-600", accent: "bg-blue-500/10" },
  { icon: Users, title: "Holistic Development", desc: "Focus on sports, cultural activities, and life skills alongside academics.", color: "from-emerald-500/15 to-emerald-500/5", iconColor: "text-emerald-600", accent: "bg-emerald-500/10" },
  { icon: Award, title: "Qualified Faculty", desc: "Experienced educators dedicated to student success and mentorship.", color: "from-secondary/20 to-secondary/5", iconColor: "text-secondary-foreground", accent: "bg-secondary/15" },
  { icon: Heart, title: "Inclusive Environment", desc: "A welcoming campus that celebrates diversity and equal opportunity.", color: "from-rose-500/15 to-rose-500/5", iconColor: "text-rose-500", accent: "bg-rose-500/10" },
];

const facilities = [
  { icon: GraduationCap, title: "Smart Classrooms", desc: "Modern classrooms equipped with digital projectors and audio systems." },
  { icon: BookOpen, title: "Well-Stocked Library", desc: "Thousands of books, journals, and digital resources for research." },
  { icon: Globe, title: "Computer Lab", desc: "State-of-the-art lab with latest software and high-speed internet." },
  { icon: Shield, title: "Safe Campus", desc: "CCTV surveillance and dedicated security for a safe learning environment." },
  { icon: Clock, title: "Flexible Timings", desc: "Morning & afternoon sessions to accommodate all students." },
  { icon: Users, title: "Student Clubs", desc: "NSS, Eco Club, Tech Club, Language Club, and many more." },
  { icon: Wifi, title: "Wi-Fi Campus", desc: "High-speed internet across the campus for research and learning." },
  { icon: Coffee, title: "Canteen", desc: "Hygienic and affordable food options available on campus." },
  { icon: Briefcase, title: "Placement Cell", desc: "Dedicated cell ensuring 90% placement rate with top companies." },
];

const quickFacts = [
  { label: "Established", value: "2017" },
  { label: "Affiliated To", value: "Bangalore University" },
  { label: "College Code", value: "BU 26" },
  { label: "Approved By", value: "AICTE" },
  { label: "Programs", value: "BCA, B.Com, BBA" },
  { label: "Placement Rate", value: "90%" },
];

const achievements = [
  { icon: TrendingUp, title: "90% Placement Record", desc: "Our students are placed in top companies across India.", color: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/15", iconColor: "text-emerald-600" },
  { icon: Star, title: "University Rank Holders", desc: "Multiple students securing university ranks every year.", color: "from-secondary/25 to-secondary/5", iconBg: "bg-secondary/20", iconColor: "text-secondary-foreground" },
  { icon: Award, title: "Best College Award", desc: "Recognized for academic excellence in Bengaluru Rural.", color: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15", iconColor: "text-blue-600" },
  { icon: GraduationCap, title: "CA/CS Toppers", desc: "Students clearing CA/CS exams in their first attempt.", color: "from-primary/15 to-primary/5", iconBg: "bg-primary/10", iconColor: "text-primary" },
];

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.set(id, entry.intersectionRatio);
          } else {
            visibleSections.delete(id);
          }
          // Pick the section with highest ratio
          let best = sectionIds[0];
          let bestRatio = 0;
          visibleSections.forEach((ratio, sid) => {
            if (ratio > bestRatio) { best = sid; bestRatio = ratio; }
          });
          if (visibleSections.size > 0) setActive(best);
        },
        { threshold: [0, 0.2, 0.4, 0.6], rootMargin: "-80px 0px -40% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);
  return active;
}

export default function About() {
  const activeSection = useActiveSection(tocSections.map((s) => s.id));

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page-enter">
      <SEOHead title="About Us" description="Learn about Hoysala Degree College, Nelamangala – our history, vision, mission, principal's message, and world-class facilities. Affiliated to Bangalore University." canonical="/about" />
      <PageHeader title="About Us" subtitle="Discover the story of Hoysala Degree College" />

      <div className="relative">
        {/* Sticky TOC - desktop only */}
        <aside className="hidden lg:block fixed top-32 left-4 xl:left-8 z-30 w-52">
          <nav className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3 shadow-lg">
            <p className="font-display text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">On this page</p>
            <ul className="space-y-0.5">
              {tocSections.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => scrollTo(s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all duration-300 group ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <s.icon className={`w-3.5 h-3.5 shrink-0 transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"}`} />
                      <span className="font-body text-xs truncate">{s.label}</span>
                      {isActive && (
                        <ChevronRight className="w-3 h-3 ml-auto text-primary animate-fade-in" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="scroll-smooth">
          {/* About intro */}
          <section id="about-intro" className="py-20 sm:py-28 bg-background relative overflow-hidden scroll-mt-24">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
            <div className="container max-w-4xl px-4 relative">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 mb-8">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  <span className="font-body text-xs font-semibold text-primary tracking-wide">Est. 2017 · Nelamangala, Bengaluru</span>
                </div>
                <SectionHeading title="About Hoysala Degree College" subtitle="Building a legacy of knowledge and character" />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="relative mt-10 bg-gradient-to-br from-primary/3 to-secondary/3 rounded-3xl p-8 sm:p-10 border border-border/50">
                  <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                  <div className="font-body text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base">
                    <p>Hoysala Degree College, established in 2017 under Shri Shirdi Sai Educational Trust(R), is located in Nelamangala Town, Bengaluru Rural District. Affiliated to Bangalore University and approved by AICTE New Delhi, the college offers BCA, B.Com (Regular & Professional), and BBA programs.</p>
                    <p>Our institution combines modern teaching methodologies with traditional values, creating an environment where students develop both professionally and personally. With experienced faculty, state-of-the-art infrastructure, and a strong focus on placements, we ensure every student is career-ready.</p>
                  </div>
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Quick Facts */}
          <section id="quick-facts" className="py-16 sm:py-24 bg-cream relative overflow-hidden scroll-mt-24">
            <div className="absolute inset-0 section-pattern opacity-50" />
            <div className="container px-4 relative">
              <ScrollReveal><SectionHeading title="Quick Facts" subtitle="Numbers that define our institution" /></ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 max-w-5xl mx-auto">
                {quickFacts.map((f, i) => (
                  <ScrollReveal key={f.label} delay={i * 80}>
                    <div className="premium-card p-5 sm:p-6 text-center group relative overflow-hidden border-glow card-stack">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="font-display text-2xl sm:text-3xl font-bold text-primary group-hover:text-secondary transition-colors duration-400 relative">{f.value}</p>
                      <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-2 uppercase tracking-widest relative">{f.label}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Principal's Message */}
          <section id="principals-message" className="py-16 sm:py-24 bg-background scroll-mt-24">
            <div className="container max-w-5xl px-4">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                <ScrollReveal className="md:col-span-2">
                  <div className="relative group">
                    <div className="absolute -inset-5 bg-gradient-to-br from-secondary/20 to-primary/8 rounded-3xl blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                    <div className="absolute -top-2 -left-2 w-16 h-16 border-t-2 border-l-2 border-secondary/50 rounded-tl-2xl z-20 group-hover:border-secondary transition-colors duration-500" />
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-2 border-r-2 border-secondary/50 rounded-br-2xl z-20 group-hover:border-secondary transition-colors duration-500" />
                    <div className="relative overflow-hidden rounded-2xl z-10">
                      <img src={principalImage} alt="Principal Sri Gopal H.R" className="w-full shadow-2xl group-hover:scale-[1.03] transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <p className="font-display text-lg font-bold text-foreground">Sri Gopal H.R</p>
                    <p className="font-body text-xs text-muted-foreground">M.Sc, M.Ed, TET, KSET, Ph.D</p>
                    <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/25 text-xs font-body font-bold text-secondary-foreground">
                      <GraduationCap className="w-3 h-3" /> Principal
                    </span>
                  </div>
                </ScrollReveal>
                <ScrollReveal delay={200} className="md:col-span-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
                    <Star className="w-3.5 h-3.5 text-secondary" />
                    <span className="font-body text-xs font-semibold">From the Principal's Desk</span>
                  </div>
                  <SectionHeading title="Principal's Message" centered={false} />
                  <div className="mt-6 relative bg-gradient-to-br from-primary/3 to-secondary/3 rounded-2xl p-6 border border-border/40">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary via-primary/40 to-transparent rounded-l-2xl" />
                    <div className="pl-4 font-body text-muted-foreground leading-relaxed text-sm space-y-3">
                      <p className="text-base not-italic font-display text-foreground font-semibold italic">"Welcome to Hoysala Degree College"</p>
                      <p>It gives immense pleasure to welcome you to HOYSALA DEGREE COLLEGE, one of the best colleges in Nelamangala town.</p>
                      <p>Our experienced faculty, modern infrastructure, and student-centric approach ensure every student receives personalized attention and guidance.</p>
                      <p>I invite you to be part of the Hoysala family and experience excellence in education.</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>

          {/* Vision & Mission */}
          <section id="vision-mission" className="py-16 sm:py-24 bg-cream scroll-mt-24">
            <div className="container grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl px-4">
              {[
                { icon: Eye, color: "from-primary/12 to-primary/3", accent: "bg-primary/10", iconColor: "text-primary", title: "Our Vision", text: "To be a premier institution of higher learning, recognized for academic excellence, innovation, and producing socially responsible graduates who contribute to national development." },
                { icon: Target, color: "from-secondary/18 to-secondary/3", accent: "bg-secondary/15", iconColor: "text-secondary-foreground", title: "Our Mission", text: "To provide accessible, affordable, and quality education empowering students with knowledge, skills, and values for successful careers and meaningful lives." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 200}>
                  <div className="premium-card p-6 sm:p-8 h-full group relative overflow-hidden card-stack">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-secondary/3 blur-3xl opacity-60" />
                    <div className={`icon-glow w-14 h-14 rounded-2xl ${item.accent} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                      <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-3 relative z-10">{item.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed relative z-10">{item.text}</p>
                    <div className="mt-5 h-0.5 bg-gradient-to-r from-secondary/50 via-secondary/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 relative z-10" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Key Achievements */}
          <section id="achievements" className="py-16 sm:py-24 bg-background relative overflow-hidden scroll-mt-24">
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
            <div className="container px-4 relative">
              <ScrollReveal><SectionHeading title="Our Achievements" subtitle="Milestones that define our excellence" /></ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-5xl mx-auto">
                {achievements.map((a, i) => (
                  <ScrollReveal key={a.title} delay={i * 100}>
                    <div className="premium-card p-6 text-center group h-full relative overflow-hidden border-glow">
                      <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      <div className={`icon-glow w-14 h-14 mx-auto rounded-2xl ${a.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10`}>
                        <a.icon className={`w-6 h-6 ${a.iconColor}`} />
                      </div>
                      <h4 className="font-display text-base font-semibold text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">{a.title}</h4>
                      <p className="font-body text-xs text-muted-foreground relative z-10">{a.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Values */}
          <section id="core-values" className="py-16 sm:py-24 bg-cream relative overflow-hidden scroll-mt-24">
            <div className="absolute inset-0 section-pattern opacity-40" />
            <div className="container px-4 relative">
              <ScrollReveal><SectionHeading title="Our Core Values" subtitle="The principles that guide everything we do" /></ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {values.map((v, i) => (
                  <ScrollReveal key={v.title} delay={i * 100}>
                    <div className="premium-card p-6 text-center h-full group relative overflow-hidden spotlight card-stack">
                      <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      <div className={`icon-glow w-14 h-14 mx-auto rounded-2xl ${v.accent} border border-border/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 relative z-10`}>
                        <v.icon className={`w-6 h-6 ${v.iconColor}`} />
                      </div>
                      <h4 className="font-display text-lg font-semibold text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">{v.title}</h4>
                      <p className="font-body text-sm text-muted-foreground relative z-10">{v.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Facilities */}
          <section id="facilities" className="py-20 sm:py-28 bg-background scroll-mt-24">
            <div className="container px-4">
              <ScrollReveal><SectionHeading title="Campus Facilities" subtitle="Modern infrastructure for holistic learning" /></ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
                {facilities.map((f, i) => (
                  <ScrollReveal key={f.title} delay={i * 70}>
                    <div className="premium-card p-5 group relative overflow-hidden spotlight border-glow">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/4 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-start gap-4">
                        <div className="icon-glow w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary/15 transition-all duration-400">
                          <f.icon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors duration-300" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-body text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">{f.title}</h4>
                          <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section id="contact" className="py-16 bg-cream scroll-mt-24">
            <div className="container max-w-3xl px-4">
              <ScrollReveal><SectionHeading title="Reach Us" subtitle="We're always here to help" /></ScrollReveal>
              <ScrollReveal delay={150}>
                <div className="premium-card p-6 sm:p-8 space-y-3">
                  {[
                    { icon: MapPin, text: "K.R.P. Arcade, UCO Bank Building, Paramanna Layout, Nelamangala Town, Bengaluru Rural Dist. - 562 123", href: "https://maps.app.goo.gl/YGNgC5ev7v4pJWve9", external: true, color: "bg-blue-500/10", iconColor: "text-blue-600" },
                    { icon: Phone, text: "7676272167 / 7975344252 / 8618181383", href: "tel:7676272167", color: "bg-emerald-500/10", iconColor: "text-emerald-600" },
                    { icon: Mail, text: "principal.hoysaladegreecollege@gmail.com", href: "mailto:principal.hoysaladegreecollege@gmail.com", color: "bg-primary/10", iconColor: "text-primary" },
                    { icon: Clock, text: "Monday - Saturday: 9:00 AM - 5:00 PM", href: undefined, color: "bg-secondary/15", iconColor: "text-secondary-foreground" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 group p-3 rounded-xl hover:bg-muted/50 transition-all duration-300">
                      <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                      </div>
                      {item.href ? (
                        <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined}
                          className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200 pt-1.5">{item.text}</a>
                      ) : (
                        <p className="font-body text-sm text-muted-foreground pt-1.5">{item.text}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
