import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, IndianRupee, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const courses = [
  {
    name: "BCA", full: "Bachelor of Computer Applications", icon: "🖥️",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 with Mathematics/Computer Science from a recognized board with minimum 45% marks.",
    fee: "₹35,000 / Year",
    overview: "The BCA program provides students with a strong foundation in computer science, programming, database management, networking, and software development.",
    highlights: ["C, C++, Java, Python Programming", "Database Management Systems", "Web Technologies & Development", "Data Structures & Algorithms", "Software Engineering", "Computer Networks"],
  },
  {
    name: "B.Com Regular", full: "Bachelor of Commerce (Regular)", icon: "📊",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹25,000 / Year",
    overview: "The B.Com Regular program equips students with comprehensive knowledge in accounting, finance, taxation, business law, and economics.",
    highlights: ["Financial Accounting", "Business Law & Ethics", "Income Tax & GST", "Cost & Management Accounting", "Business Statistics", "Corporate Finance"],
  },
  {
    name: "B.Com Professional", full: "Bachelor of Commerce (Professional)", icon: "📈",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "B.Com Professional is designed for students aspiring for CA, CS, and CMA. It includes exclusive coaching alongside regular degree curriculum.",
    highlights: ["CA Foundation Coaching", "CS Executive Preparation", "CMA Foundation Classes", "Advanced Accounting", "Auditing & Taxation", "Corporate Law"],
  },
  {
    name: "BBA", full: "Bachelor of Business Administration", icon: "💼",
    duration: "3 Years (6 Semesters)", eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "The BBA program develops managerial and entrepreneurial skills. The curriculum covers marketing, HR, finance, operations management, and strategic planning.",
    highlights: ["Principles of Management", "Marketing Management", "Human Resource Management", "Financial Management", "Entrepreneurship Development", "Business Communication"],
  },
  {
    name: "C.A Coaching", full: "Chartered Accountancy Foundation & Intermediate", icon: "⚖️",
    duration: "Integrated with B.Com", eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee",
    overview: "Exclusive coaching for CA Foundation and Intermediate exams conducted alongside the regular B.Com program by experienced CA faculty.",
    highlights: ["CA Foundation Papers 1-4", "Accounting & Auditing", "Business Laws", "Quantitative Aptitude", "Mock Tests & Practice Papers", "One-on-one Mentoring"],
  },
  {
    name: "C.S Coaching", full: "Company Secretary Foundation & Executive", icon: "📜",
    duration: "Integrated with B.Com", eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee",
    overview: "Dedicated coaching for CS Foundation and Executive modules with focus on corporate laws, governance, and compliance.",
    highlights: ["Business Environment & Law", "Company Law", "Securities Laws", "Corporate Governance", "Tax Laws", "Mock Exams"],
  },
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  return (
    <div className="page-enter">
      <PageHeader title="Our Courses" subtitle="Choose from our carefully designed programs" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <SectionHeading title="Choose Your Path" subtitle="Click on any course to view full details" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {courses.map((c, i) => (
              <ScrollReveal key={c.name} delay={i * 80}>
                <div
                  onClick={() => setSelectedCourse(c)}
                  className="premium-card p-6 sm:p-7 cursor-pointer group h-full"
                >
                  <span className="text-4xl sm:text-5xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300">{c.icon}</span>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">{c.full}</p>
                  <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-2">{c.overview}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] font-body text-secondary font-bold bg-secondary/10 px-3 py-1 rounded-full">{c.duration.split(" (")[0]}</span>
                    <span className="text-xs font-body font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-4xl shrink-0">{selectedCourse.icon}</div>
                  <div>
                    <DialogTitle className="font-display text-2xl">{selectedCourse.name}</DialogTitle>
                    <DialogDescription className="font-body">{selectedCourse.full}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-5 mt-4">
                <p className="font-body text-muted-foreground leading-relaxed">{selectedCourse.overview}</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: Clock, label: "Duration", value: selectedCourse.duration },
                    { icon: CheckCircle, label: "Eligibility", value: selectedCourse.eligibility },
                    { icon: IndianRupee, label: "Fee", value: selectedCourse.fee },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3 bg-muted/30 rounded-xl p-3 border border-border/50">
                      <item.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="font-body text-sm font-medium text-foreground">{item.value}</p>
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
                      <div key={h} className="flex items-center gap-2 font-body text-sm text-muted-foreground p-2 rounded-lg hover:bg-muted/30 transition-colors">
                        <CheckCircle className="w-4 h-4 text-secondary shrink-0" /> {h}
                      </div>
                    ))}
                  </div>
                </div>
                <Link to="/admissions">
                  <Button className="w-full font-body rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3 mt-2 hover:scale-[1.02] transition-transform">
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
