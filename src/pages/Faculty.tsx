import SectionHeading from "@/components/SectionHeading";
import { Mail, GraduationCap } from "lucide-react";

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
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Our Faculty</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Faculty</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="Meet Our Educators" subtitle="Dedicated professionals committed to shaping the future of our students" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {faculty.map((f) => (
              <div key={f.name} className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">{f.name}</h3>
                <p className="font-body text-xs text-secondary font-semibold mt-1">{f.role}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{f.department}</p>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="font-body text-[11px] text-muted-foreground">{f.qualification}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{f.experience} experience</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
