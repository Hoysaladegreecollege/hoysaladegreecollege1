import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { GraduationCap, Briefcase, Mail, Phone, Award, BookOpen, Star, Sparkles } from "lucide-react";
import PremiumStatsStrip from "@/components/PremiumStatsStrip";
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

const deptConfig: Record<string, { grad: string; badge: string; iconColor: string }> = {
  "Administration":         { grad: "from-purple-500/12 to-purple-500/4", badge: "bg-purple-500/10 text-purple-700 border-purple-200", iconColor: "text-purple-600" },
  "Computer Applications":  { grad: "from-blue-500/12 to-blue-500/4",   badge: "bg-blue-500/10 text-blue-700 border-blue-200",     iconColor: "text-blue-600" },
  "Commerce":               { grad: "from-emerald-500/12 to-emerald-500/4", badge: "bg-emerald-500/10 text-emerald-700 border-emerald-200", iconColor: "text-emerald-600" },
  "Business Administration":{ grad: "from-orange-500/12 to-orange-500/4", badge: "bg-orange-500/10 text-orange-700 border-orange-200", iconColor: "text-orange-600" },
};

export default function Faculty() {
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [clickY, setClickY] = useState(0);

  const { data: dbFaculty = [], isLoading } = useQuery({
    queryKey: ["public-faculty"],
    queryFn: async () => {
      const { data } = await supabase.from("faculty_members").select("*").eq("is_active", true).order("sort_order").order("created_at");
      return data || [];
    },
  });

  const faculty = dbFaculty.length > 0 ? dbFaculty : staticFaculty;

  return (
    <div className="page-enter">
      <SEOHead title="Faculty Members" description="Meet the experienced faculty of Hoysala Degree College – qualified professors across Computer Applications, Commerce, and Business Administration departments." canonical="/faculty" />
      <PageHeader title="Our Faculty" subtitle="Dedicated professionals committed to your success" />

      <PremiumStatsStrip stats={[
        { icon: GraduationCap, value: "25+", label: "Faculty Members" },
        { icon: Award, value: "15+", label: "Years Avg. Exp" },
        { icon: Star, value: "90%", label: "Placement Rate" },
        { icon: BookOpen, value: "5", label: "Departments" },
      ]} />

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
                  <Skeleton className="w-24 h-24 rounded-2xl" />
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
                const cfg = deptConfig[f.department] || { grad: "from-primary/10 to-secondary/5", badge: "bg-muted text-muted-foreground border-border", iconColor: "text-primary" };
                return (
                  <ScrollReveal key={f.id} delay={i * 60}>
                    <div
                      onClick={(e) => { setClickY(e.clientY); setSelectedFaculty(f); }}
                      className="premium-card p-6 text-center group h-full flex flex-col cursor-pointer relative overflow-hidden card-stack"
                    >
                      {/* Hover gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${cfg.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Photo */}
                      <div className={`relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${cfg.grad} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-2 transition-all duration-500 overflow-hidden border-2 border-border group-hover:border-primary/25 shadow-md z-10`}>
                        {f.photo_url ? (
                          <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          <GraduationCap className={`w-10 h-10 ${cfg.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                        )}
                        {/* Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      </div>

                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 relative z-10">{f.name}</h3>
                      <p className="font-body text-xs text-secondary font-semibold mt-1 relative z-10">{f.role}</p>
                      <span className={`inline-block mt-2 font-body text-[10px] font-semibold px-3 py-1 rounded-full border ${cfg.badge} relative z-10`}>
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

                      {/* Click hint */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <Sparkles className="w-3.5 h-3.5 text-secondary animate-sparkle" />
                      </div>
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
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" onClick={() => setSelectedFaculty(null)}>
          <div className="my-auto">
          <div className="bg-card rounded-3xl border border-border w-full max-w-md shadow-2xl animate-scale-bounce overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header gradient */}
            <div className={`p-6 bg-gradient-to-br ${deptConfig[selectedFaculty.department]?.grad || "from-primary/10 to-secondary/5"} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-background/80 flex items-center justify-center shrink-0 overflow-hidden border-2 border-background shadow-md">
                  {selectedFaculty.photo_url
                    ? <img src={selectedFaculty.photo_url} alt={selectedFaculty.name} className="w-full h-full object-cover" />
                    : <GraduationCap className={`w-8 h-8 ${deptConfig[selectedFaculty.department]?.iconColor || "text-primary"}`} />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-bold text-foreground">{selectedFaculty.name}</h3>
                  <p className="font-body text-sm text-secondary font-semibold">{selectedFaculty.role}</p>
                  <span className={`inline-block mt-1.5 font-body text-xs font-semibold px-2.5 py-0.5 rounded-full border ${deptConfig[selectedFaculty.department]?.badge || "bg-muted text-muted-foreground border-border"}`}>
                    {selectedFaculty.department}
                  </span>
                </div>
                <button onClick={() => setSelectedFaculty(null)} className="p-1.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground text-sm font-bold hover:scale-110 transition-all duration-200">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/40 hover:bg-muted transition-colors duration-200">
                <Award className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Qualification</p>
                  <p className="font-body text-sm font-semibold text-foreground">{selectedFaculty.qualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/40 hover:bg-muted transition-colors duration-200">
                <Briefcase className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Experience</p>
                  <p className="font-body text-sm font-semibold text-foreground">{selectedFaculty.experience}</p>
                </div>
              </div>
              {selectedFaculty.subjects?.length > 0 && (
                <div className="p-3 rounded-xl bg-muted/50 border border-border/40">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Subjects</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaculty.subjects.map((s: string) => (
                      <span key={s} className="font-body text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {(selectedFaculty.email || selectedFaculty.phone) && (
                <div className="flex gap-2 pt-1">
                  {selectedFaculty.email && (
                    <a href={`mailto:${selectedFaculty.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border hover:bg-primary/5 hover:border-primary/30 font-body text-xs font-semibold transition-all duration-200 group">
                      <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Email
                    </a>
                  )}
                  {selectedFaculty.phone && (
                    <a href={`tel:${selectedFaculty.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border hover:bg-emerald-500/5 hover:border-emerald-300 font-body text-xs font-semibold transition-all duration-200 group">
                      <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Call
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
