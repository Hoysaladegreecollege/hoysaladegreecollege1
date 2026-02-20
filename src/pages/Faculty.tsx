import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { GraduationCap, Briefcase, Mail, Phone, Award, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const staticFaculty = [
  { id: "s1", name: "Sri Gopal H.R", role: "Principal", department: "Administration", qualification: "M.Sc, M.Ed, TET, KSET, Ph.D", experience: "20+ years", photo_url: "", email: "", phone: "", subjects: [] },
  { id: "s2", name: "Dr. Meena Sharma", role: "HOD & Professor", department: "Computer Applications", qualification: "Ph.D. in Computer Science", experience: "18 years", photo_url: "", email: "", phone: "", subjects: [] },
  { id: "s3", name: "Prof. Suresh Babu", role: "HOD & Associate Professor", department: "Commerce", qualification: "M.Com, NET", experience: "15 years", photo_url: "", email: "", phone: "", subjects: [] },
  { id: "s4", name: "Dr. Priya Nair", role: "HOD & Professor", department: "Business Administration", qualification: "Ph.D. in Management", experience: "20 years", photo_url: "", email: "", phone: "", subjects: [] },
];

const deptColors: Record<string, string> = {
  "Administration": "from-purple-500/10 to-purple-500/5",
  "Computer Applications": "from-blue-500/10 to-blue-500/5",
  "Commerce": "from-emerald-500/10 to-emerald-500/5",
  "Business Administration": "from-orange-500/10 to-orange-500/5",
};

export default function Faculty() {
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);

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

      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Meet Our Educators" subtitle="Experienced professors and industry experts shaping the future" />
          </ScrollReveal>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
              {faculty.map((f: any, i: number) => {
                const deptGrad = deptColors[f.department] || "from-primary/10 to-secondary/5";
                return (
                  <ScrollReveal key={f.id} delay={i * 70}>
                    <div
                      onClick={() => setSelectedFaculty(f)}
                      className="premium-card p-6 text-center group h-full flex flex-col cursor-pointer relative overflow-hidden">
                      {/* Hover bg */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${deptGrad} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      {/* Top line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

                      {/* Photo */}
                      <div className={`relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${deptGrad} flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-400 overflow-hidden border-2 border-border group-hover:border-primary/30 shadow-md z-10`}>
                        {f.photo_url ? (
                          <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 relative z-10">{f.name}</h3>
                      <p className="font-body text-xs text-secondary font-semibold mt-1 relative z-10">{f.role}</p>
                      <span className="inline-block mt-2 font-body text-[10px] font-semibold px-3 py-1 rounded-full bg-muted/80 text-muted-foreground border border-border/50 relative z-10">
                        {f.department}
                      </span>

                      <div className="mt-4 pt-3 border-t border-border/60 space-y-1.5 flex-1 relative z-10">
                        <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{f.qualification}</p>
                        <div className="flex items-center justify-center gap-1 font-body text-[11px] text-muted-foreground">
                          <Briefcase className="w-3 h-3 shrink-0" /> {f.experience} experience
                        </div>
                      </div>

                      {(f.email || f.phone) && (
                        <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/40 relative z-10" onClick={e => e.stopPropagation()}>
                          {f.email && (
                            <a href={`mailto:${f.email}`} className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {f.phone && (
                            <a href={`tel:${f.phone}`} className="p-2 rounded-xl hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 transition-all duration-200 hover:scale-110">
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Faculty Detail Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedFaculty(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6 shadow-2xl animate-scale-bounce" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-border">
                {selectedFaculty.photo_url ? <img src={selectedFaculty.photo_url} alt={selectedFaculty.name} className="w-full h-full object-cover" /> : <GraduationCap className="w-8 h-8 text-primary" />}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground">{selectedFaculty.name}</h3>
                <p className="font-body text-sm text-secondary font-semibold">{selectedFaculty.role}</p>
                <span className="inline-block mt-1 font-body text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">{selectedFaculty.department}</span>
              </div>
              <button onClick={() => setSelectedFaculty(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground text-lg font-bold">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Qualification</p>
                  <p className="font-body text-sm font-semibold text-foreground">{selectedFaculty.qualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <Briefcase className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Experience</p>
                  <p className="font-body text-sm font-semibold text-foreground">{selectedFaculty.experience}</p>
                </div>
              </div>
              {selectedFaculty.subjects?.length > 0 && (
                <div className="p-3 rounded-xl bg-muted/40">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Subjects</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaculty.subjects.map((s: string) => <span key={s} className="font-body text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">{s}</span>)}
                  </div>
                </div>
              )}
              {(selectedFaculty.email || selectedFaculty.phone) && (
                <div className="flex gap-2 pt-1">
                  {selectedFaculty.email && <a href={`mailto:${selectedFaculty.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border hover:bg-primary/5 font-body text-xs font-semibold transition-colors"><Mail className="w-3.5 h-3.5" /> Email</a>}
                  {selectedFaculty.phone && <a href={`tel:${selectedFaculty.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border hover:bg-primary/5 font-body text-xs font-semibold transition-colors"><Phone className="w-3.5 h-3.5" /> Call</a>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
