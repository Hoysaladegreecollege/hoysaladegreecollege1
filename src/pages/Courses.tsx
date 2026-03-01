import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, IndianRupee, ArrowRight, GraduationCap, Sparkles, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import PremiumStatsStrip from "@/components/PremiumStatsStrip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const courses = [
  {
    name: "BCA", full: "Bachelor of Computer Applications", icon: "🖥️",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 with Mathematics/Computer Science from a recognized board with minimum 45% marks.",
    fee: "₹35,000 / Year",
    overview: "The BCA program provides students with a strong foundation in computer science, programming, database management, networking, and software development.",
    highlights: ["C, C++, Java, Python Programming", "Database Management Systems", "Web Technologies & Development", "Data Structures & Algorithms", "Software Engineering", "Computer Networks"],
    color: "from-blue-500/10 to-cyan-500/5",
    accent: "text-blue-600",
  },
  {
    name: "B.Com Regular", full: "Bachelor of Commerce (Regular)", icon: "📊",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹25,000 / Year",
    overview: "The B.Com Regular program equips students with comprehensive knowledge in accounting, finance, taxation, business law, and economics.",
    highlights: ["Financial Accounting", "Business Law & Ethics", "Income Tax & GST", "Cost & Management Accounting", "Business Statistics", "Corporate Finance"],
    color: "from-emerald-500/10 to-green-500/5",
    accent: "text-emerald-600",
  },
  {
    name: "B.Com Professional", full: "Bachelor of Commerce (Professional)", icon: "📈",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "B.Com Professional is designed for students aspiring for CA, CS, and CMA. It includes exclusive coaching alongside regular degree curriculum.",
    highlights: ["CA Foundation Coaching", "CS Executive Preparation", "CMA Foundation Classes", "Advanced Accounting", "Auditing & Taxation", "Corporate Law"],
    color: "from-secondary/15 to-amber-500/5",
    accent: "text-secondary-foreground",
  },
  {
    name: "BBA", full: "Bachelor of Business Administration", icon: "💼",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "The BBA program develops managerial and entrepreneurial skills. The curriculum covers marketing, HR, finance, operations management, and strategic planning.",
    highlights: ["Principles of Management", "Marketing Management", "Human Resource Management", "Financial Management", "Entrepreneurship Development", "Business Communication"],
    color: "from-purple-500/10 to-violet-500/5",
    accent: "text-purple-600",
  },
  {
    name: "C.A Coaching", full: "Chartered Accountancy Foundation & Intermediate", icon: "⚖️",
    duration: "Integrated with B.Com", eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee",
    overview: "Exclusive coaching for CA Foundation and Intermediate exams conducted alongside the regular B.Com program by experienced CA faculty.",
    highlights: ["CA Foundation Papers 1-4", "Accounting & Auditing", "Business Laws", "Quantitative Aptitude", "Mock Tests & Practice Papers", "One-on-one Mentoring"],
    color: "from-rose-500/10 to-red-500/5",
    accent: "text-rose-600",
  },
  {
    name: "C.S Coaching", full: "Company Secretary Foundation & Executive", icon: "📜",
    duration: "Integrated with B.Com", eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee",
    overview: "Dedicated coaching for CS Foundation and Executive modules with focus on corporate laws, governance, and compliance.",
    highlights: ["Business Environment & Law", "Company Law", "Securities Laws", "Corporate Governance", "Tax Laws", "Mock Exams"],
    color: "from-indigo-500/10 to-blue-500/5",
    accent: "text-indigo-600",
  },
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  return (
    <div className="page-enter">
      <SEOHead title="Courses - BCA, BCom, BBA, CA/CS" description="Explore undergraduate programs at Hoysala Degree College: BCA, B.Com Regular, B.Com Professional, BBA, CA & CS coaching. View fees, duration, eligibility." canonical="/courses" />
      <PageHeader title="Our Courses" subtitle="Choose from our carefully designed programs" />

      {/* Stats strip */}
      <PremiumStatsStrip stats={[
        { icon: BookOpen, value: "6", label: "Programs" },
        { icon: Users, value: "300+", label: "Students" },
        { icon: GraduationCap, value: "3", label: "Years Duration" },
        { icon: Sparkles, value: "90%", label: "Placement Rate" },
      ]} />

      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal><SectionHeading title="Choose Your Path" subtitle="Click on any course to view full details, fees, and highlights" /></ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl mx-auto">
            {courses.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 80}>
                <div
                  onClick={() => setSelectedCourse(c)}
                  className="premium-card p-7 sm:p-8 cursor-pointer group h-full relative overflow-hidden border-glow"
                >
                  {/* Hover gradient bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

                  <div className="relative z-10">
                    <span className="text-5xl sm:text-6xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block filter group-hover:drop-shadow-lg">{c.icon}</span>
                    <h3 className="font-display text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-1.5 font-medium">{c.full}</p>
                    <p className="font-body text-sm text-muted-foreground mt-4 leading-relaxed line-clamp-2">{c.overview}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-[10px] font-body text-secondary font-bold bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">{c.duration.split(" (")[0]}</span>
                      <span className="text-xs font-body font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                        View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-cream">
        <div className="container text-center px-4">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to Enroll?</h2>
              <p className="font-body text-muted-foreground mb-8 text-sm">Apply today and secure your seat for the 2026–27 academic year.</p>
              <Link to="/admissions">
                <button className="relative group overflow-hidden px-10 py-4 rounded-2xl font-body text-base font-bold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))", boxShadow: "0 8px 32px hsl(var(--primary) / 0.3)" }}>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${selectedCourse.color} border border-border/30 mb-2`}>
                  <div className="w-16 h-16 rounded-2xl bg-background/80 flex items-center justify-center text-4xl shrink-0 shadow-sm">
                    {selectedCourse.icon}
                  </div>
                  <div>
                    <DialogTitle className="font-display text-2xl">{selectedCourse.name}</DialogTitle>
                    <DialogDescription className="font-body">{selectedCourse.full}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-5">
                <p className="font-body text-muted-foreground leading-relaxed text-sm">{selectedCourse.overview}</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: Clock, label: "Duration", value: selectedCourse.duration },
                    { icon: CheckCircle, label: "Eligibility", value: selectedCourse.eligibility },
                    { icon: IndianRupee, label: "Fee", value: selectedCourse.fee },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3 bg-muted/30 rounded-xl p-3 border border-border/50 hover:bg-muted/50 transition-colors duration-200">
                      <item.icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="font-body text-xs font-medium text-foreground mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-secondary" /> Course Highlights
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedCourse.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2.5 font-body text-sm text-muted-foreground p-2.5 rounded-xl hover:bg-muted/40 transition-colors duration-200 group">
                        <CheckCircle className="w-4 h-4 text-secondary shrink-0 group-hover:scale-110 transition-transform" /> {h}
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/apply">
                  <button className="relative w-full group overflow-hidden px-6 py-3 rounded-xl font-body text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] shadow-lg mt-2"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))", boxShadow: "0 4px 20px hsl(var(--primary) / 0.25)" }}>
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    <span className="relative flex items-center justify-center gap-2">
                      Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
