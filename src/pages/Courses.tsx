import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Download, IndianRupee } from "lucide-react";

const courses = [
  {
    name: "BCA",
    full: "Bachelor of Computer Applications",
    icon: "🖥️",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 with Mathematics/Computer Science from a recognized board with minimum 45% marks.",
    fee: "₹35,000 / Year",
    overview: "The BCA program provides students with a strong foundation in computer science, programming, database management, networking, and software development.",
    highlights: ["C, C++, Java, Python Programming", "Database Management Systems", "Web Technologies & Development", "Data Structures & Algorithms", "Software Engineering", "Computer Networks"],
  },
  {
    name: "B.Com Regular",
    full: "Bachelor of Commerce (Regular)",
    icon: "📊",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹25,000 / Year",
    overview: "The B.Com Regular program equips students with comprehensive knowledge in accounting, finance, taxation, business law, and economics.",
    highlights: ["Financial Accounting", "Business Law & Ethics", "Income Tax & GST", "Cost & Management Accounting", "Business Statistics", "Corporate Finance"],
  },
  {
    name: "B.Com Professional",
    full: "Bachelor of Commerce (Professional)",
    icon: "📈",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "B.Com Professional is designed for students aspiring for CA, CS, and CMA. It includes exclusive coaching alongside regular degree curriculum.",
    highlights: ["CA Foundation Coaching", "CS Executive Preparation", "CMA Foundation Classes", "Advanced Accounting", "Auditing & Taxation", "Corporate Law"],
  },
  {
    name: "BBA",
    full: "Bachelor of Business Administration",
    icon: "💼",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "The BBA program develops managerial and entrepreneurial skills. The curriculum covers marketing, HR, finance, operations management, and strategic planning.",
    highlights: ["Principles of Management", "Marketing Management", "Human Resource Management", "Financial Management", "Entrepreneurship Development", "Business Communication"],
  },
  {
    name: "C.A Coaching",
    full: "Chartered Accountancy Foundation & Intermediate",
    icon: "⚖️",
    duration: "Integrated with B.Com",
    eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee",
    overview: "Exclusive coaching for CA Foundation and Intermediate exams conducted alongside the regular B.Com program by experienced CA faculty.",
    highlights: ["CA Foundation Papers 1-4", "Accounting & Auditing", "Business Laws", "Quantitative Aptitude", "Mock Tests & Practice Papers", "One-on-one Mentoring"],
  },
  {
    name: "C.S Coaching",
    full: "Company Secretary Foundation & Executive",
    icon: "📜",
    duration: "Integrated with B.Com",
    eligibility: "Students enrolled in B.Com Professional program.",
    fee: "Included in B.Com Professional fee",
    overview: "Dedicated coaching for CS Foundation and Executive modules with focus on corporate laws, governance, and compliance.",
    highlights: ["Business Environment & Law", "Company Law", "Securities Laws", "Corporate Governance", "Tax Laws", "Mock Exams"],
  },
];

export default function Courses() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Our Courses</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Courses</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-5xl space-y-10">
          {courses.map((c, i) => (
            <ScrollReveal key={c.name} delay={i * 80}>
              <div className="bg-card border border-border rounded-xl overflow-hidden hover-lift">
                <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">{c.name}</h2>
                    <p className="font-body text-sm text-muted-foreground">{c.full}</p>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <p className="font-body text-muted-foreground leading-relaxed">{c.overview}</p>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                      <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Duration</p>
                        <p className="font-body text-sm font-medium text-foreground">{c.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Eligibility</p>
                        <p className="font-body text-sm font-medium text-foreground">{c.eligibility}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                      <IndianRupee className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-xs text-muted-foreground">Fee Structure</p>
                        <p className="font-body text-sm font-medium text-foreground">{c.fee}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display text-base font-semibold text-foreground mb-3">Course Highlights</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {c.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="font-body">
                    <Download className="w-4 h-4 mr-2" /> Download Syllabus
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
