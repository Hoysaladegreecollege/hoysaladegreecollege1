import SectionHeading from "@/components/SectionHeading";
import { Monitor, TrendingUp, Briefcase, BookOpen, Users, Award } from "lucide-react";

const departments = [
  {
    name: "Department of Computer Applications",
    icon: Monitor,
    course: "BCA",
    hod: "Dr. Meena Sharma",
    desc: "Offering cutting-edge education in computer science, programming, and IT. Students learn through hands-on lab sessions, industry projects, and workshops.",
    facilities: ["Computer Lab with 60+ systems", "Internet & Wi-Fi enabled campus", "Programming contests & hackathons"],
  },
  {
    name: "Department of Commerce",
    icon: TrendingUp,
    course: "BCom",
    hod: "Prof. Suresh Babu",
    desc: "Providing comprehensive knowledge in accounting, finance, and business operations. Our Commerce department prepares students for CA, ICWA, and MBA pathways.",
    facilities: ["Dedicated commerce library", "Tally & accounting software lab", "Industry guest lectures"],
  },
  {
    name: "Department of Business Administration",
    icon: Briefcase,
    course: "BBA",
    hod: "Dr. Priya Nair",
    desc: "Focused on developing future business leaders with practical exposure through case studies, internships, and entrepreneurship programs.",
    facilities: ["Seminar hall for presentations", "Business simulation tools", "Corporate tie-ups for internships"],
  },
];

export default function Departments() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Departments</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Departments</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-5xl space-y-8">
          <SectionHeading title="Our Departments" subtitle="Each department is dedicated to providing specialized education and skill development." />
          {departments.map((d) => (
            <div key={d.name} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <d.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{d.name}</h2>
                  <p className="font-body text-xs text-muted-foreground">Course: {d.course} | HOD: {d.hod}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="font-body text-muted-foreground leading-relaxed mb-4">{d.desc}</p>
                <h4 className="font-body text-sm font-semibold text-foreground mb-2">Key Facilities</h4>
                <ul className="space-y-1.5">
                  {d.facilities.map((f) => (
                    <li key={f} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                      <Award className="w-3.5 h-3.5 text-secondary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
