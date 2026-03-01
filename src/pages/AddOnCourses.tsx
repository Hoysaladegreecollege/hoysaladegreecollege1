import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { BookOpen, Monitor, Briefcase, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumStatsStrip from "@/components/PremiumStatsStrip";

const bcomBba = [
  { name: "CA (Chartered Accountancy)", desc: "Foundation & Intermediate coaching integrated with B.Com" },
  { name: "CS (Company Secretary)", desc: "Foundation & Executive level preparation" },
  { name: "CMA (Cost & Management Accountancy)", desc: "Professional cost accounting certification prep" },
  { name: "IBPS Banking Preparation", desc: "Complete preparation for banking competitive exams" },
  { name: "Tally ERP", desc: "Industry-standard accounting software training" },
  { name: "MS Excel Advanced", desc: "Data analysis, pivot tables, macros & formulas" },
  { name: "Aptitude Training", desc: "Quantitative, verbal, and logical reasoning" },
  { name: "Soft Skills Development", desc: "Communication, presentation & interview skills" },
];

const bca = [
  { name: "Artificial Intelligence", desc: "Introduction to AI concepts, applications & ethics" },
  { name: "Machine Learning", desc: "Hands-on ML models, algorithms & data science" },
  { name: "Web Designing", desc: "HTML, CSS, JavaScript, React & responsive design" },
  { name: "Data Science", desc: "Python for data analysis, visualization & statistics" },
  { name: "Python Programming", desc: "Advanced Python with frameworks like Django & Flask" },
  { name: "Java Development", desc: "Core Java, Spring Boot & enterprise applications" },
  { name: "Computer Networking", desc: "Network protocols, security & cloud infrastructure" },
];

export default function AddOnCourses() {
  return (
    <div className="page-enter">
      <SEOHead title="Add-on Courses" description="Value-added courses at Hoysala Degree College: AI, ML, Python, CA/CS/CMA coaching, Tally ERP, soft skills, aptitude training for BCA, BCom and BBA students." canonical="/addon-courses" />
      <PageHeader title="Add-on Courses" subtitle="Value-added certifications to boost your career" />

      <PremiumStatsStrip stats={[
        { value: "15+", label: "Add-on Courses" },
        { value: "100%", label: "Practical Based" },
        { value: "Free", label: "For Students" },
        { value: "Industry", label: "Certified" },
      ]} />

      <section className="py-14 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container max-w-5xl px-5 sm:px-4 space-y-16 relative">
          {/* B.Com & BBA */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center border border-border/50 shadow-sm">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">B.Com & BBA Add-ons</h2>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground">Professional certifications & skill development</p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {bcomBba.map((c, i) => (
                <ScrollReveal key={c.name} delay={i * 50}>
                  <div className="premium-card p-5 sm:p-6 group cursor-default border-glow active:scale-[0.98] touch-manipulation">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-secondary/15 group-hover:scale-110 transition-all duration-400">
                        <CheckCircle className="w-4 h-4 text-primary group-hover:text-secondary transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                        <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* BCA */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center border border-border/50 shadow-sm">
                  <Monitor className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">BCA Add-ons</h2>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground">Cutting-edge technology courses</p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {bca.map((c, i) => (
                <ScrollReveal key={c.name} delay={i * 50}>
                  <div className="premium-card p-5 sm:p-6 group cursor-default border-glow active:scale-[0.98] touch-manipulation">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/12 group-hover:scale-110 transition-all duration-400">
                        <CheckCircle className="w-4 h-4 text-secondary group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                        <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-16 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 section-pattern opacity-40" />
        <div className="container max-w-2xl px-5 sm:px-4 text-center relative">
          <ScrollReveal>
            <div className="premium-card p-8 sm:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-secondary mx-auto mb-4 animate-float relative z-10" />
              <h3 className="font-display text-xl sm:text-3xl font-bold text-foreground mb-3 relative z-10">Interested in Add-on Courses?</h3>
              <p className="font-body text-muted-foreground text-[13px] sm:text-sm mb-6 leading-relaxed relative z-10">
                These courses are offered free of cost to all enrolled students. Enroll during admissions to get started.
              </p>
              <Link to="/admissions"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-body font-bold text-sm text-primary-foreground hover:scale-105 active:scale-[0.97] transition-all duration-300 shadow-lg relative z-10 touch-manipulation"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))" }}>
                <BookOpen className="w-4 h-4" /> Apply for Admission <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
