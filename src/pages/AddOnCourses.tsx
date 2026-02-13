import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { BookOpen, Monitor, Briefcase } from "lucide-react";

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
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Add-on Courses</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Add-on Courses</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-5xl space-y-16">
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">B.Com & BBA Add-ons</h2>
                  <p className="font-body text-sm text-muted-foreground">Professional certifications & skill development</p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {bcomBba.map((c, i) => (
                <ScrollReveal key={c.name} delay={i * 60}>
                  <div className="bg-card border border-border rounded-xl p-5 hover-lift">
                    <h3 className="font-display text-base font-bold text-foreground">{c.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{c.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div>
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">BCA Add-ons</h2>
                  <p className="font-body text-sm text-muted-foreground">Cutting-edge technology courses</p>
                </div>
              </div>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {bca.map((c, i) => (
                <ScrollReveal key={c.name} delay={i * 60}>
                  <div className="bg-card border border-border rounded-xl p-5 hover-lift">
                    <h3 className="font-display text-base font-bold text-foreground">{c.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{c.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
