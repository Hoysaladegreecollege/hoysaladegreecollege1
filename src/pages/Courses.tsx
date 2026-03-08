import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, IndianRupee, ArrowRight, GraduationCap, Sparkles, Users, BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumStatsStrip from "@/components/PremiumStatsStrip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const staticCourses = [
  {
    name: "BCA", full: "Bachelor of Computer Applications", icon: "🖥️",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 with Mathematics/Computer Science from a recognized board with minimum 45% marks.",
    fee: "₹80,000 / Year", overview: "The BCA program provides students with a strong foundation in computer science, programming, database management, networking, and software development.",
    highlights: ["C, C++, Java, Python Programming", "Database Management Systems", "Web Technologies & Development", "Data Structures & Algorithms", "Software Engineering", "Computer Networks"],
    color: "from-blue-500/10 to-cyan-500/5", accent: "text-blue-600", accentHsl: "217 72% 50%",
  },
  {
    name: "B.Com Regular", full: "Bachelor of Commerce (Regular)", icon: "📊",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹60,000 / Year", overview: "The B.Com Regular program equips students with comprehensive knowledge in accounting, finance, taxation, business law, and economics.",
    highlights: ["Financial Accounting", "Business Law & Ethics", "Income Tax & GST", "Cost & Management Accounting", "Business Statistics", "Corporate Finance"],
    color: "from-emerald-500/10 to-green-500/5", accent: "text-emerald-600", accentHsl: "142 70% 40%",
  },
  {
    name: "B.Com Professional", full: "Bachelor of Commerce (Professional)", icon: "📈",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹60,000 / Year", overview: "B.Com Professional is designed for students aspiring for CA, CS, and CMA. It includes exclusive coaching alongside regular degree curriculum.",
    highlights: ["CA Foundation Coaching", "CS Executive Preparation", "CMA Foundation Classes", "Advanced Accounting", "Auditing & Taxation", "Corporate Law"],
    color: "from-secondary/15 to-amber-500/5", accent: "text-secondary-foreground", accentHsl: "42 87% 55%",
  },
  {
    name: "BBA", full: "Bachelor of Business Administration", icon: "💼",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹70,000 / Year", overview: "The BBA program develops managerial and entrepreneurial skills. The curriculum covers marketing, HR, finance, operations management, and strategic planning.",
    highlights: ["Principles of Management", "Marketing Management", "Human Resource Management", "Financial Management", "Entrepreneurship Development", "Business Communication"],
    color: "from-purple-500/10 to-violet-500/5", accent: "text-purple-600", accentHsl: "280 60% 55%",
  },
  {
    name: "C.A Coaching", full: "Chartered Accountancy Foundation & Intermediate", icon: "⚖️",
    duration: "Integrated with B.Com", eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee", overview: "Exclusive coaching for CA Foundation and Intermediate exams conducted alongside the regular B.Com program by experienced CA faculty.",
    highlights: ["CA Foundation Papers 1-4", "Accounting & Auditing", "Business Laws", "Quantitative Aptitude", "Mock Tests & Practice Papers", "One-on-one Mentoring"],
    color: "from-rose-500/10 to-red-500/5", accent: "text-rose-600", accentHsl: "0 84% 60%",
  },
  {
    name: "C.S Coaching", full: "Company Secretary Foundation & Executive", icon: "📜",
    duration: "Integrated with B.Com", eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee", overview: "Dedicated coaching for CS Foundation and Executive modules with focus on corporate laws, governance, and compliance.",
    highlights: ["Business Environment & Law", "Company Law", "Securities Laws", "Corporate Governance", "Tax Laws", "Mock Exams"],
    color: "from-indigo-500/10 to-blue-500/5", accent: "text-indigo-600", accentHsl: "240 60% 55%",
  },
];

const ICON_MAP: Record<string, string> = {
  "BCA": "🖥️", "B.Com Regular": "📊", "B.Com Professional": "📈", "BBA": "💼",
  "C.A Coaching": "⚖️", "C.S Coaching": "📜",
};
const COLOR_MAP: Record<string, string> = {
  "BCA": "from-blue-500/10 to-cyan-500/5",
  "B.Com Regular": "from-emerald-500/10 to-green-500/5",
  "B.Com Professional": "from-secondary/15 to-amber-500/5",
  "BBA": "from-purple-500/10 to-violet-500/5",
  "C.A Coaching": "from-rose-500/10 to-red-500/5",
  "C.S Coaching": "from-indigo-500/10 to-blue-500/5",
};
const ACCENT_MAP: Record<string, string> = {
  "BCA": "217 72% 50%", "B.Com Regular": "142 70% 40%", "B.Com Professional": "42 87% 55%",
  "BBA": "280 60% 55%", "C.A Coaching": "0 84% 60%", "C.S Coaching": "240 60% 55%",
};

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const { data: dbCourses = [], isLoading } = useQuery({
    queryKey: ["public-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*, departments(name)").eq("is_active", true).order("name");
      return data || [];
    },
  });

  const courses = dbCourses.length > 0
    ? dbCourses.map((c: any) => {
        const staticMatch = staticCourses.find(sc => sc.name === c.name || sc.name === c.code);
        const dbHighlights = (c.highlights as string[] | null) || [];
        return {
          name: c.code || c.name, full: c.name,
          icon: ICON_MAP[c.code] || ICON_MAP[c.name] || "📚",
          duration: c.duration || "3 Years", eligibility: c.eligibility || "Contact for details",
          fee: c.fee || "Contact for details", overview: c.overview || c.name,
          highlights: dbHighlights.length > 0 ? dbHighlights : (staticMatch?.highlights || []),
          color: COLOR_MAP[c.code] || COLOR_MAP[c.name] || "from-primary/10 to-primary/5",
          accent: staticMatch?.accent || "text-primary",
          accentHsl: ACCENT_MAP[c.code] || ACCENT_MAP[c.name] || "220 55% 48%",
        };
      })
    : staticCourses;

  return (
    <div className="page-enter">
      <SEOHead
        title="Courses - BCA, BCom, BBA, CA/CS"
        description="Explore undergraduate programs at Hoysala Degree College: BCA, B.Com Regular, B.Com Professional, BBA, CA & CS coaching. View fees, duration, eligibility."
        canonical="/courses"
      />
      <PageHeader title="Our Courses" subtitle="Choose from our carefully designed programs" />

      <PremiumStatsStrip
        stats={[
          { icon: BookOpen, value: String(courses.length), label: "Programs" },
          { icon: Users, value: "300+", label: "Students" },
          { icon: GraduationCap, value: "3", label: "Years Duration" },
          { icon: Sparkles, value: "90%", label: "Placement Rate" },
        ]}
      />

      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
        {/* Diagonal pattern */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--foreground) / 0.15) 0, hsl(var(--foreground) / 0.15) 1px, transparent 1px, transparent 60px)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading
              title="Choose Your Path"
              subtitle="Click on any course to view full details, fees, and highlights"
            />
          </ScrollReveal>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl mx-auto">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-card border border-border rounded-3xl p-8 space-y-4">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 max-w-5xl mx-auto">
              {courses.map((c: any, i: number) => (
                <ScrollReveal key={c.name} delay={i * 80}>
                  <div
                    onClick={() => setSelectedCourse(c)}
                    className="relative p-7 sm:p-8 cursor-pointer group h-full overflow-hidden rounded-3xl border border-border/30 bg-card backdrop-blur-sm active:scale-[0.97] touch-manipulation"
                    style={{
                      transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    {/* Multi-layer hover effects */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`} />
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 blur-[70px] pointer-events-none"
                      style={{ background: `hsla(${c.accentHsl || '220 55% 48%'}, 0.12)` }} />
                    
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"
                      style={{ background: `linear-gradient(90deg, transparent, hsla(${c.accentHsl || '220 55% 48%'}, 0.5), transparent)` }} />
                    
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] rounded-3xl pointer-events-none"
                      style={{ transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)" }} />

                    {/* Glass inner border */}
                    <div className="absolute inset-[1px] rounded-[23px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 0 1px hsla(${c.accentHsl || '220 55% 48%'}, 0.06)` }} />

                    <div className="relative z-10">
                      <span className="text-5xl sm:text-6xl mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 inline-block filter group-hover:drop-shadow-lg">
                        {c.icon}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {c.name}
                      </h3>
                      <p className="font-body text-[10px] text-muted-foreground mt-1.5 font-semibold tracking-[0.15em] uppercase opacity-50">{c.full}</p>
                      <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed line-clamp-2">
                        {c.overview}
                      </p>
                      <div className="mt-6 pt-4 border-t border-border/30 group-hover:border-border/50 transition-colors duration-500 flex items-center justify-between">
                        <span className="text-[10px] font-body font-semibold px-3 py-1.5 rounded-full border transition-all duration-500"
                          style={{ color: `hsl(${c.accentHsl || '220 55% 48%'})`, background: `hsla(${c.accentHsl || '220 55% 48%'}, 0.06)`, borderColor: `hsla(${c.accentHsl || '220 55% 48%'}, 0.12)` }}>
                          {(c.duration || "").split(" (")[0]}
                        </span>
                        <span className="text-xs font-body font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-300 opacity-40 group-hover:opacity-100">
                          View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(230,12%,6%), hsl(228,10%,3%))" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[hsl(var(--gold))]/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/20 to-transparent" />
        
        <div className="container text-center px-4 relative">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <Sparkles className="w-8 h-8 text-secondary mx-auto mb-4 animate-float" />
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Ready to Enroll?</h2>
              <p className="font-body text-white/40 mb-8 text-sm leading-relaxed">
                Apply today and secure your seat for the 2026–27 academic year.
              </p>
              <Link to="/admissions">
                <button
                  className="relative group overflow-hidden px-10 py-4 rounded-2xl font-body text-base font-bold text-foreground shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-0.5 btn-magnetic"
                  style={{
                    background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,48%))",
                    boxShadow: "0 8px 32px hsla(42,87%,52%,0.4)",
                  }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-2xl" />
                  <span className="relative flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" /> Apply for Admission <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-border/30 bg-card/95 backdrop-blur-2xl p-0 shadow-2xl">
          {selectedCourse && (
            <div className="relative overflow-hidden">
              {/* Dialog ambient glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none"
                style={{ background: `hsla(${selectedCourse.accentHsl || '220 55% 48%'}, 0.08)` }} />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary/[0.04] rounded-full blur-[80px] pointer-events-none" />

              {/* Hero header with gradient */}
              <div className={`relative p-6 sm:p-8 bg-gradient-to-br ${selectedCourse.color} border-b border-border/20 overflow-hidden`}>
                <div className="absolute inset-0 opacity-[0.02]"
                  style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 30px)" }} />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                
                <DialogHeader className="relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-background/90 backdrop-blur-xl flex items-center justify-center text-[2.5rem] shrink-0 shadow-xl border border-border/40 ring-2 ring-white/[0.03]">
                      {selectedCourse.icon}
                    </div>
                    <div>
                      <DialogTitle className="font-display text-2xl sm:text-[1.75rem] font-bold tracking-[-0.01em]">{selectedCourse.name}</DialogTitle>
                      <DialogDescription className="font-body text-xs sm:text-sm mt-1 opacity-70">{selectedCourse.full}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              {/* Content body */}
              <div className="p-6 sm:p-8 space-y-6 relative">
                <p className="font-body text-muted-foreground leading-relaxed text-sm">{selectedCourse.overview}</p>
                
                {/* Info cards */}
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: Clock, label: "Duration", value: selectedCourse.duration, hsl: "217 72% 50%" },
                    { icon: CheckCircle, label: "Eligibility", value: selectedCourse.eligibility, hsl: "142 70% 40%" },
                    { icon: IndianRupee, label: "Fee", value: selectedCourse.fee, hsl: "42 87% 55%" },
                  ].map((item) => (
                    <div key={item.label} className="relative flex items-start gap-3 rounded-2xl p-4 border border-border/40 bg-muted/20 hover:bg-muted/40 transition-all duration-400 group overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                        style={{ background: `linear-gradient(135deg, hsla(${item.hsl}, 0.04), transparent)` }} />
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border/30 group-hover:scale-110 transition-all duration-300 relative z-10"
                        style={{ background: `hsla(${item.hsl}, 0.08)` }}>
                        <item.icon className="w-4 h-4" style={{ color: `hsl(${item.hsl})` }} />
                      </div>
                      <div className="relative z-10">
                        <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{item.label}</p>
                        <p className="font-body text-xs font-semibold text-foreground mt-1 leading-snug">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                {selectedCourse.highlights?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/15">
                        <Star className="w-4 h-4 text-secondary" />
                      </div>
                      <h4 className="font-display text-base font-bold text-foreground">Course Highlights</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {selectedCourse.highlights.map((h: string, idx: number) => (
                        <div key={h} className="flex items-center gap-3 font-body text-sm text-muted-foreground p-3 rounded-xl border border-border/20 hover:bg-muted/30 hover:border-border/40 transition-all duration-300 group"
                          style={{ animationDelay: `${idx * 40}ms` }}>
                          <div className="w-5 h-5 rounded-md bg-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
                            <CheckCircle className="w-3 h-3 text-secondary" />
                          </div>
                          <span className="group-hover:text-foreground transition-colors duration-200">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Premium Apply Button */}
                <Link to="/apply" className="block mt-3">
                  <button
                    className="relative w-full group overflow-hidden px-6 py-4 rounded-2xl font-body text-sm font-bold transition-all duration-500 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] touch-manipulation"
                    style={{
                      background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,50%), hsl(35,85%,45%))",
                      color: "hsl(30,10%,10%)",
                      boxShadow: "0 8px 32px hsla(42,87%,52%,0.35), inset 0 1px 0 hsla(50,100%,90%,0.3)",
                    }}
                  >
                    {/* Shimmer sweep */}
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-2xl" />
                    {/* Glowing border ring */}
                    <span className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                    <span className="relative flex items-center justify-center gap-2.5">
                      <GraduationCap className="w-5 h-5" />
                      Apply Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
