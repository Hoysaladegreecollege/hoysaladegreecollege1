import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { GraduationCap, Briefcase } from "lucide-react";

const faculty = [
  { name: "Dr. Rajesh Kumar", role: "Principal", department: "Administration", qualification: "Ph.D. in Education Management", experience: "25+ years" },
  { name: "Dr. Meena Sharma", role: "HOD & Professor", department: "Computer Applications", qualification: "Ph.D. in Computer Science", experience: "18 years" },
  { name: "Prof. Suresh Babu", role: "HOD & Associate Professor", department: "Commerce", qualification: "M.Com, NET", experience: "15 years" },
  { name: "Dr. Priya Nair", role: "HOD & Professor", department: "Business Administration", qualification: "Ph.D. in Management", experience: "20 years" },
  { name: "Prof. Anil Kumar", role: "Assistant Professor", department: "Computer Applications", qualification: "MCA, M.Tech", experience: "10 years" },
  { name: "Prof. Kavitha R.", role: "Assistant Professor", department: "Commerce", qualification: "M.Com, SET", experience: "8 years" },
  { name: "Prof. Deepak Gowda", role: "Assistant Professor", department: "Business Administration", qualification: "MBA, NET", experience: "12 years" },
  { name: "Prof. Sangeetha M.", role: "Assistant Professor", department: "Computer Applications", qualification: "MCA, Ph.D. (Pursuing)", experience: "7 years" },
];

export default function Faculty() {
  return (
    <div className="page-enter">
      <PageHeader title="Our Faculty" subtitle="Dedicated professionals committed to your success" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <SectionHeading title="Meet Our Educators" subtitle="Experienced professors and industry experts shaping the future" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {faculty.map((f, i) => (
              <ScrollReveal key={f.name} delay={i * 80}>
                <div className="premium-card p-6 text-center group h-full">
                  <div className="w-18 h-18 w-[72px] h-[72px] mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{f.name}</h3>
                  <p className="font-body text-xs text-secondary font-semibold mt-1">{f.role}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{f.department}</p>
                  <div className="mt-4 pt-3 border-t border-border space-y-1">
                    <p className="font-body text-[11px] text-muted-foreground">{f.qualification}</p>
                    <div className="flex items-center justify-center gap-1 font-body text-[11px] text-muted-foreground">
                      <Briefcase className="w-3 h-3" /> {f.experience} experience
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
