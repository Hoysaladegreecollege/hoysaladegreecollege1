import SectionHeading from "@/components/SectionHeading";
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
    overview: "The BCA program is designed to provide students with a strong foundation in computer science, programming, database management, networking, and software development. Students gain hands-on experience through lab sessions and projects.",
    highlights: ["C, C++, Java, Python Programming", "Database Management Systems", "Web Technologies & Development", "Data Structures & Algorithms", "Software Engineering", "Computer Networks"],
  },
  {
    name: "BCom",
    full: "Bachelor of Commerce",
    icon: "📊",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹25,000 / Year",
    overview: "The BCom program equips students with comprehensive knowledge in accounting, finance, taxation, business law, and economics. It prepares students for careers in banking, accounting, and business management.",
    highlights: ["Financial Accounting", "Business Law & Ethics", "Income Tax & GST", "Cost & Management Accounting", "Business Statistics", "Corporate Finance"],
  },
  {
    name: "BBA",
    full: "Bachelor of Business Administration",
    icon: "💼",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 in any stream from a recognized board with minimum 40% marks.",
    fee: "₹30,000 / Year",
    overview: "The BBA program develops managerial and entrepreneurial skills in students. The curriculum covers marketing, HR, finance, operations management, and strategic planning with real-world case studies.",
    highlights: ["Principles of Management", "Marketing Management", "Human Resource Management", "Financial Management", "Entrepreneurship Development", "Business Communication"],
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
        <div className="container max-w-5xl space-y-12">
          {courses.map((c) => (
            <div key={c.name} className="bg-card border border-border rounded-xl overflow-hidden">
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
          ))}
        </div>
      </section>
    </div>
  );
}
