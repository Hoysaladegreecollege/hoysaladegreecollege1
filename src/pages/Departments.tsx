import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Monitor, TrendingUp, Briefcase, Award } from "lucide-react";

const departments = [
  {
    name: "Department of Computer Applications",
    icon: Monitor,
    course: "BCA",
    hod: "Dr. Meena Sharma",
    desc: "Offering cutting-edge education in computer science, programming, and IT. Students learn through hands-on lab sessions, industry projects, and workshops.",
    facilities: ["Computer Lab with 60+ systems", "Internet & Wi-Fi enabled campus", "Programming contests & hackathons"],
    color: "from-primary/8 to-primary/3",
  },
  {
    name: "Department of Commerce",
    icon: TrendingUp,
    course: "BCom",
    hod: "Prof. Suresh Babu",
    desc: "Providing comprehensive knowledge in accounting, finance, and business operations. Our Commerce department prepares students for CA, ICWA, and MBA pathways.",
    facilities: ["Dedicated commerce library", "Tally & accounting software lab", "Industry guest lectures"],
    color: "from-secondary/8 to-secondary/3",
  },
  {
    name: "Department of Business Administration",
    icon: Briefcase,
    course: "BBA",
    hod: "Dr. Priya Nair",
    desc: "Focused on developing future business leaders with practical exposure through case studies, internships, and entrepreneurship programs.",
    facilities: ["Seminar hall for presentations", "Business simulation tools", "Corporate tie-ups for internships"],
    color: "from-primary/8 to-secondary/3",
  },
];

export default function Departments() {
  return (
    <div className="page-enter">
      <PageHeader title="Departments" subtitle="Specialized education and skill development" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container max-w-5xl px-4 space-y-6 sm:space-y-8">
          <SectionHeading title="Our Departments" subtitle="Each department is dedicated to providing specialized education and skill development." />
          {departments.map((d, i) => (
            <ScrollReveal key={d.name} delay={i * 150}>
              <div className="premium-card overflow-hidden group">
                <div className={`bg-gradient-to-r ${d.color} px-6 sm:px-8 py-5 border-b border-border flex items-center gap-4`}>
                  <div className="icon-glow w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <d.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">{d.name}</h2>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">Course: {d.course} | HOD: {d.hod}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="font-body text-muted-foreground leading-relaxed mb-5">{d.desc}</p>
                  <h4 className="font-body text-sm font-semibold text-foreground mb-3">Key Facilities</h4>
                  <ul className="space-y-2">
                    {d.facilities.map((f) => (
                      <li key={f} className="flex items-center gap-3 font-body text-sm text-muted-foreground p-2 rounded-lg hover:bg-muted/30 transition-colors">
                        <Award className="w-4 h-4 text-secondary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
