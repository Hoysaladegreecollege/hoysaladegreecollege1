import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { GraduationCap, Briefcase, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback static faculty data
const staticFaculty = [
  { id: "s1", name: "Dr. Rajesh Kumar", role: "Principal", department: "Administration", qualification: "Ph.D. in Education Management", experience: "25+ years", photo_url: "", email: "", phone: "" },
  { id: "s2", name: "Dr. Meena Sharma", role: "HOD & Professor", department: "Computer Applications", qualification: "Ph.D. in Computer Science", experience: "18 years", photo_url: "", email: "", phone: "" },
  { id: "s3", name: "Prof. Suresh Babu", role: "HOD & Associate Professor", department: "Commerce", qualification: "M.Com, NET", experience: "15 years", photo_url: "", email: "", phone: "" },
  { id: "s4", name: "Dr. Priya Nair", role: "HOD & Professor", department: "Business Administration", qualification: "Ph.D. in Management", experience: "20 years", photo_url: "", email: "", phone: "" },
];

export default function Faculty() {
  const { data: dbFaculty = [], isLoading } = useQuery({
    queryKey: ["public-faculty"],
    queryFn: async () => {
      const { data } = await supabase
        .from("faculty_members")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .order("created_at");
      return data || [];
    },
  });

  const faculty = dbFaculty.length > 0 ? dbFaculty : staticFaculty;

  return (
    <div className="page-enter">
      <PageHeader title="Our Faculty" subtitle="Dedicated professionals committed to your success" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <SectionHeading title="Meet Our Educators" subtitle="Experienced professors and industry experts shaping the future" />

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
              {faculty.map((f: any, i: number) => (
                <ScrollReveal key={f.id} delay={i * 80}>
                  <div className="premium-card p-6 text-center group h-full flex flex-col">
                    {/* Photo */}
                    <div className="w-[72px] h-[72px] mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 overflow-hidden border border-border">
                      {f.photo_url ? (
                        <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-foreground">{f.name}</h3>
                    <p className="font-body text-xs text-secondary font-semibold mt-1">{f.role}</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{f.department}</p>
                    <div className="mt-4 pt-3 border-t border-border space-y-1 flex-1">
                      <p className="font-body text-[11px] text-muted-foreground">{f.qualification}</p>
                      <div className="flex items-center justify-center gap-1 font-body text-[11px] text-muted-foreground">
                        <Briefcase className="w-3 h-3" /> {f.experience} experience
                      </div>
                    </div>
                    {(f.email || f.phone) && (
                      <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/50">
                        {f.email && (
                          <a href={`mailto:${f.email}`} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {f.phone && (
                          <a href={`tel:${f.phone}`} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

