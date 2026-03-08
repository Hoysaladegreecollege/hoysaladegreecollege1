import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Calendar, ArrowRight, Sparkles, GraduationCap, Phone, Shield, Upload, Award, BookOpen, Users, Clock, Star, ChevronRight, BadgeCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { step: "01", title: "Check Eligibility", desc: "Verify you meet the eligibility criteria for your chosen course. Review prerequisites and minimum qualifications.", icon: Shield, accent: "220, 80%, 55%" },
  { step: "02", title: "Fill Application Form", desc: "Complete the online application form with accurate personal and academic details.", icon: FileText, accent: "42, 87%, 55%" },
  { step: "03", title: "Submit Documents", desc: "Submit required documents: 10th & 12th marksheets, ID proof, passport photos.", icon: Upload, accent: "155, 65%, 45%" },
  { step: "04", title: "Pay Registration Fee", desc: "Pay the non-refundable registration fee to confirm and secure your application.", icon: CheckCircle, accent: "145, 65%, 42%" },
  { step: "05", title: "Admission Confirmation", desc: "Receive your admission confirmation letter, welcome kit, and onboarding details.", icon: GraduationCap, accent: "280, 60%, 55%" },
];

const documents = [
  "10th & 12th Marksheets (Original + 2 copies)",
  "Transfer Certificate from previous institution",
  "Migration Certificate (if applicable)",
  "Aadhar Card / ID Proof",
  "Passport size photographs (6 copies)",
  "Caste Certificate (if applicable)",
  "Income Certificate (for scholarship applicants)",
];

const defaultCourses = [
  { name: "BCA", code: "BCA", seats: 60, fee: "₹80,000/yr", icon: "🖥️", duration: "3 Years", color: "220, 80%, 55%" },
  { name: "B.Com Regular", code: "BCOM", seats: 120, fee: "₹60,000/yr", icon: "📊", duration: "3 Years", color: "155, 65%, 45%" },
  { name: "B.Com Professional", code: "BCOM_PROF", seats: 60, fee: "₹60,000/yr", icon: "📈", duration: "3 Years", color: "42, 87%, 55%" },
  { name: "BBA", code: "BBA", seats: 60, fee: "₹70,000/yr", icon: "💼", duration: "3 Years", color: "280, 60%, 55%" },
];

const highlights = [
  { icon: Award, label: "University Affiliated", desc: "Bangalore University" },
  { icon: Users, label: "500+ Alumni", desc: "Strong network" },
  { icon: Star, label: "90% Placement", desc: "Industry ready" },
  { icon: Clock, label: "Flexible Timing", desc: "Morning batches" },
];

export default function Admissions() {
  const { data: seatData } = useQuery({
    queryKey: ["admission-seats"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("admission_seats").select("course_code, total_seats");
      return data || [];
    },
  });

  const courses = defaultCourses.map(c => {
    const dbSeat = (seatData || []).find((s: any) => s.course_code === c.code);
    return { ...c, seats: dbSeat ? dbSeat.total_seats : c.seats };
  });

  return (
    <div className="page-enter">
      <SEOHead title="Admissions 2026-27" description="Apply for admission to Hoysala Degree College Nelamangala. BCA, B.Com, BBA programs. Online application, eligibility, fees, required documents." canonical="/admissions" />
      <PageHeader title="Admissions" subtitle="Join Hoysala Degree College and shape your future" />

      {/* Hero CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "hsla(var(--gold), 0.06)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: "hsla(var(--primary), 0.04)" }} />

        <div className="relative container px-4 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            {/* Status Badge */}
            <ScrollReveal>
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border/40 bg-card/60 backdrop-blur-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "hsl(145, 65%, 42%)" }} />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: "hsl(145, 65%, 42%)" }} />
                  </span>
                  <span className="font-body text-xs font-bold tracking-wide uppercase text-foreground">Admissions Open 2026–27</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Main CTA */}
            <ScrollReveal delay={80}>
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Your Future Starts <span className="text-secondary">Here</span>
                </h2>
                <p className="font-body text-base sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">
                  Apply for BCA, B.Com, BBA, CA & CS programs. Join a community of excellence with industry-ready education.
                </p>
              </div>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={160}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/apply"
                  className="relative group overflow-hidden px-8 py-4 rounded-2xl font-body text-sm sm:text-base font-bold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 w-full sm:w-auto text-center inline-block"
                  style={{ background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(38,92%,44%), hsl(var(--secondary)))", boxShadow: "0 12px 40px hsla(var(--secondary), 0.35), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" /> Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                <Link to="/application-status" className="w-full sm:w-auto">
                  <Button variant="outline" className="font-body rounded-2xl w-full h-full py-4 px-6 hover:bg-card hover:border-primary/30 transition-all duration-300 text-sm sm:text-base border-border/40">
                    <FileText className="w-4 h-4 mr-2" /> Track Application
                  </Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Highlight Strip */}
            <ScrollReveal delay={240}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
                {highlights.map((h, i) => (
                  <div key={h.label}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-border/60 transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${i * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <h.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold text-foreground">{h.label}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Course Seats Overview */}
      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: "hsla(var(--secondary), 0.04)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: "hsla(var(--primary), 0.03)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Available Programs" subtitle="Choose the right course for your future" />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {courses.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 100}>
                <Link to="/apply" className="group block">
                  <div className="relative overflow-hidden bg-card border border-border/30 rounded-3xl p-6 sm:p-7 text-center transition-all duration-500 hover:border-border/60 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_hsla(var(--secondary),0.15)]">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, hsla(${c.color}, 0.6), transparent)` }} />

                    {/* Ambient glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `hsla(${c.color}, 0.08)` }} />

                    <div className="relative z-10">
                      <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-400 inline-block filter group-hover:drop-shadow-lg">{c.icon}</div>
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                      <p className="font-body text-xs text-muted-foreground mt-1">{c.duration} · {c.seats} Seats</p>

                      <div className="mt-4 inline-flex items-center gap-1 px-4 py-1.5 rounded-full border font-body text-sm font-bold" style={{ background: `hsla(${c.color}, 0.08)`, borderColor: `hsla(${c.color}, 0.15)`, color: `hsla(${c.color}, 1)` }}>
                        {c.fee}
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-1 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        <span className="font-body text-xs font-semibold">Apply Now</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Steps */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "hsla(var(--gold), 0.04)" }} />

        <div className="container max-w-4xl px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Admission Process" subtitle="Follow these simple steps to join Hoysala Degree College" />
          </ScrollReveal>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100}>
                <div className="relative group">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-[2.25rem] top-[5rem] bottom-[-1rem] w-px z-20 pointer-events-none" style={{ background: `linear-gradient(to bottom, hsla(${s.accent}, 0.3), transparent)` }} />
                  )}

                  <div className="flex gap-5 items-start bg-card border border-border/30 rounded-3xl p-6 hover:border-border/60 hover:-translate-y-0.5 transition-all duration-400 relative overflow-hidden">
                    {/* Hover gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" style={{ background: `linear-gradient(135deg, hsla(${s.accent}, 0.06), transparent 60%)` }} />

                    {/* Step number */}
                    <div className="relative z-10 w-[3.5rem] h-[3.5rem] rounded-2xl flex items-center justify-center font-display font-bold text-lg shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white" style={{ background: `linear-gradient(135deg, hsla(${s.accent}, 0.9), hsla(${s.accent}, 0.7))`, boxShadow: `0 8px 24px hsla(${s.accent}, 0.25)` }}>
                      {s.step}
                    </div>

                    <div className="relative z-10 flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" style={{ color: `hsla(${s.accent}, 0.7)` }} />
                        <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                      </div>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    </div>

                    <BadgeCheck className="w-5 h-5 shrink-0 mt-1 relative z-10 transition-all duration-500 text-muted-foreground/20 group-hover:scale-110" style={{ color: undefined }} />
                    <style>{`.group:hover .lucide-badge-check { color: hsla(${s.accent}, 0.7) !important; }`}</style>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "hsla(var(--primary), 0.03)" }} />

        <div className="container max-w-3xl px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Required Documents" subtitle="Prepare these documents before applying" />
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="relative overflow-hidden bg-card border border-border/30 rounded-3xl p-8 sm:p-10">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none" style={{ background: "hsla(var(--gold), 0.06)" }} />

              <div className="relative z-10 grid sm:grid-cols-2 gap-3">
                {documents.map((d, i) => (
                  <div key={d}
                    className="flex items-start gap-3 p-3.5 rounded-2xl hover:bg-muted/30 border border-transparent hover:border-border/30 transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                    <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-card/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "hsla(var(--gold), 0.05)" }} />

        <div className="container text-center px-4 relative">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">Have Questions?</h2>
              <p className="font-body text-muted-foreground mb-8 text-sm leading-relaxed">Our admissions team is ready to guide you through every step of the process.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:7676272167" className="w-full sm:w-auto">
                  <Button variant="outline" className="font-body rounded-2xl hover:bg-card hover:border-primary/30 transition-all duration-300 group w-full py-3.5 border-border/40">
                    <Phone className="w-4 h-4 mr-2 group-hover:animate-pulse" /> Call: 7676272167
                  </Button>
                </a>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" className="font-body rounded-2xl hover:bg-card hover:border-primary/30 transition-all duration-300 group w-full py-3.5 border-border/40">
                    Contact Admissions <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
