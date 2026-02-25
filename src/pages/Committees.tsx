import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Globe, Briefcase, Monitor, Award, Users, Heart, Shield, BookOpen, Leaf, Scale, Sparkles, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react";

const committees = [
  { name: "Language Club", icon: Globe, desc: "Promoting linguistic skills and cultural appreciation through literary events.", color: "from-blue-500/15 to-blue-500/5", iconBg: "bg-blue-500/10", iconColor: "text-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "Commerce Forum", icon: Briefcase, desc: "Business quizzes, seminars, and industry interactions for commerce students.", color: "from-secondary/18 to-secondary/5", iconBg: "bg-secondary/15", iconColor: "text-secondary-foreground", badge: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "Management Forum", icon: Users, desc: "Case studies, leadership workshops, and management games.", color: "from-emerald-500/15 to-emerald-500/5", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { name: "Tech Club", icon: Monitor, desc: "Hackathons, coding bootcamps, and tech workshops for BCA students.", color: "from-primary/12 to-primary/4", iconBg: "bg-primary/10", iconColor: "text-primary", badge: "bg-blue-50 text-blue-700 border-blue-100" },
  { name: "NSS Unit", icon: Award, desc: "Community service, blood donation drives, and social awareness campaigns.", color: "from-rose-500/15 to-rose-500/5", iconBg: "bg-rose-500/10", iconColor: "text-rose-600", badge: "bg-rose-50 text-rose-700 border-rose-100" },
  { name: "Mentoring Cell", icon: Heart, desc: "Academic and personal guidance for every student through dedicated mentors.", color: "from-pink-500/15 to-pink-500/5", iconBg: "bg-pink-500/10", iconColor: "text-pink-600", badge: "bg-pink-50 text-pink-700 border-pink-100" },
  { name: "Placement Cell", icon: Sparkles, desc: "Career guidance, resume building, mock interviews, and campus recruitments.", color: "from-secondary/18 to-primary/5", iconBg: "bg-secondary/15", iconColor: "text-secondary-foreground", badge: "bg-amber-50 text-amber-700 border-amber-100" },
  { name: "Student Counselling Cell", icon: MessageSquare, desc: "Professional counseling support for student well-being and mental health.", color: "from-indigo-500/15 to-indigo-500/5", iconBg: "bg-indigo-500/10", iconColor: "text-indigo-600", badge: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { name: "Eco Club", icon: Leaf, desc: "Environmental awareness programs, tree planting, and green initiatives.", color: "from-emerald-500/15 to-teal-500/5", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-600", badge: "bg-teal-50 text-teal-700 border-teal-100" },
  { name: "Anti-Ragging Cell", icon: Shield, desc: "Ensuring a safe and ragging-free campus for all students.", color: "from-primary/12 to-secondary/5", iconBg: "bg-primary/10", iconColor: "text-primary", badge: "bg-slate-50 text-slate-700 border-slate-100" },
  { name: "Anti-Sexual Harassment Cell", icon: AlertTriangle, desc: "Providing a safe environment and addressing harassment complaints promptly.", color: "from-orange-500/15 to-orange-500/5", iconBg: "bg-orange-500/10", iconColor: "text-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-100" },
  { name: "Women Empowerment Cell", icon: Scale, desc: "Programs promoting gender equality, women's safety and empowerment.", color: "from-purple-500/15 to-purple-500/5", iconBg: "bg-purple-500/10", iconColor: "text-purple-600", badge: "bg-purple-50 text-purple-700 border-purple-100" },
  { name: "Grievance & Redressal Cell", icon: BookOpen, desc: "Addressing student and staff grievances promptly and fairly.", color: "from-teal-500/15 to-teal-500/5", iconBg: "bg-teal-500/10", iconColor: "text-teal-600", badge: "bg-teal-50 text-teal-700 border-teal-100" },
];

export default function Committees() {
  return (
    <div className="page-enter">
      <SEOHead title="Committees & Clubs" description="Explore 13+ committees and clubs at Hoysala Degree College – NSS, Tech Club, Placement Cell, Eco Club, and more for holistic student development." canonical="/committees" />
      <PageHeader title="Committees & Clubs" subtitle="Driving holistic student development" />

      {/* Stats strip */}
      <section className="py-10 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/80 to-primary" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative container px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-primary-foreground text-center">
            {[
              { emoji: "🎭", value: "13+", label: "Active Committees" },
              { emoji: "🤝", value: "500+", label: "Student Members" },
              { emoji: "📅", value: "50+", label: "Annual Events" },
              { emoji: "🏆", value: "10+", label: "Awards Won" },
            ].map((s, i) => (
              <div key={s.label} className="group cursor-default" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl mb-1.5 group-hover:scale-125 transition-transform duration-400">{s.emoji}</div>
                <div className="font-display text-2xl sm:text-3xl font-bold">{s.value}</div>
                <div className="font-body text-[10px] opacity-50 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Our Committees & Clubs" subtitle="Active committees and clubs shaping well-rounded graduates" />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {committees.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 50}>
                <div className={`relative premium-card p-6 group h-full overflow-hidden border-glow card-stack cursor-default`}>
                  {/* Hover bg gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Bottom shimmer line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/25 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`icon-glow w-13 h-13 w-12 h-12 rounded-2xl ${c.iconBg} border border-border/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 shadow-sm`}>
                      <c.icon className={`w-6 h-6 ${c.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                    </div>

                    {/* Title + badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">{c.name}</h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300 shrink-0 mt-0.5" />
                    </div>

                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 section-pattern opacity-40" />
        <div className="container max-w-2xl px-4 text-center relative">
          <ScrollReveal>
            <div className="premium-card p-8 sm:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
              <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
              <Sparkles className="w-12 h-12 text-secondary mx-auto mb-4 animate-float relative z-10" />
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 relative z-10">Join a Committee</h3>
              <p className="font-body text-muted-foreground text-sm mb-6 leading-relaxed relative z-10">
                Get involved beyond academics. Develop leadership, creativity, and social responsibility by joining one of our vibrant committees.
              </p>
              <a href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-body font-bold text-sm text-primary-foreground hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 shadow-lg relative z-10"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))", boxShadow: "0 4px 20px hsl(var(--primary) / 0.3)" }}>
                <Users className="w-4 h-4" /> Get in Touch
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
