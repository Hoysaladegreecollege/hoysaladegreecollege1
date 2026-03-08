import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { GraduationCap, Briefcase, Mail, Phone, Award, BookOpen, Star, Sparkles, ChevronRight, Users, X, Crown, Shield } from "lucide-react";
import { createPortal } from "react-dom";
import PremiumStatsStrip from "@/components/PremiumStatsStrip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useEffect } from "react";

const staticFaculty = [
  { id: "s1", name: "Sri Gopal H.R", role: "Principal", department: "Administration", qualification: "M.Sc, M.Ed, TET, KSET, Ph.D", experience: "20+ years", photo_url: "", email: "", phone: "", subjects: [] },
  { id: "s2", name: "Dr. Meena Sharma", role: "HOD & Professor", department: "Computer Applications", qualification: "Ph.D. in Computer Science", experience: "18 years", photo_url: "", email: "", phone: "", subjects: [] },
  { id: "s3", name: "Prof. Suresh Babu", role: "HOD & Associate Professor", department: "Commerce", qualification: "M.Com, NET", experience: "15 years", photo_url: "", email: "", phone: "", subjects: [] },
  { id: "s4", name: "Dr. Priya Nair", role: "HOD & Professor", department: "Business Administration", qualification: "Ph.D. in Management", experience: "20 years", photo_url: "", email: "", phone: "", subjects: [] },
];

const deptConfig: Record<string, { accentHsl: string }> = {
  "Administration":         { accentHsl: "280, 60%, 55%" },
  "Computer Applications":  { accentHsl: "220, 80%, 55%" },
  "Commerce":               { accentHsl: "155, 65%, 45%" },
  "Business Administration":{ accentHsl: "25, 85%, 55%" },
};

const defaultAccent = "220, 80%, 55%";

function isLeadership(role: string) {
  const r = role.toLowerCase();
  return r.includes("principal") || r.includes("hod") || r.includes("head") || r.includes("director") || r.includes("dean");
}

export default function Faculty() {
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDept, setSelectedDept] = useState("All");

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedFaculty(null);
      setIsClosing(false);
    }, 250);
  };

  useEffect(() => {
    if (selectedFaculty) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedFaculty]);

  const { data: dbFaculty = [], isLoading } = useQuery({
    queryKey: ["public-faculty"],
    queryFn: async () => {
      const { data } = await supabase.from("faculty_members").select("*").eq("is_active", true).order("sort_order").order("created_at");
      return data || [];
    },
  });

  const faculty = dbFaculty.length > 0 ? dbFaculty : staticFaculty;
  const departments = useMemo(() => {
    const depts = Array.from(new Set(faculty.map((f: any) => f.department)));
    return ["All", ...depts];
  }, [faculty]);
  const filteredFaculty = selectedDept === "All" ? faculty : faculty.filter((f: any) => f.department === selectedDept);

  // Separate leadership (Principal/HOD) from regular faculty
  const leaders = filteredFaculty.filter((f: any) => isLeadership(f.role));
  const regularFaculty = filteredFaculty.filter((f: any) => !isLeadership(f.role));

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
        {/* Ambient glows */}
        <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none" style={{ background: "hsla(var(--secondary), 0.03)" }} />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none" style={{ background: "hsla(var(--primary), 0.04)" }} />

        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading title="Meet Our Educators" subtitle="Experienced professors and industry experts shaping the future" />
          </ScrollReveal>

          {/* Department Filter Tabs */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`relative px-5 py-2.5 rounded-full text-xs font-body font-semibold border transition-all duration-400 overflow-hidden group ${
                    selectedDept === dept
                      ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary/50 shadow-[0_4px_20px_-4px_hsla(var(--primary),0.3)]"
                      : "bg-card text-muted-foreground border-border/40 hover:border-border/70 hover:text-foreground hover:shadow-[0_4px_20px_-8px_hsla(var(--secondary),0.1)]"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    {dept === "All" && <Users className="w-3 h-3" />}
                    {dept}
                  </span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border/30 rounded-3xl p-6 flex flex-col items-center gap-4">
                  <Skeleton className="w-24 h-24 rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Leadership Section — Principal & HODs */}
              {leaders.length > 0 && (
                <div className="mb-14">
                  <ScrollReveal>
                    <div className="flex items-center justify-center gap-3 mb-8">
                      <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-primary/30" />
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15">
                        <Crown className="w-3.5 h-3.5 text-primary" />
                        <span className="font-body text-[11px] text-primary font-bold uppercase tracking-[0.15em]">Leadership</span>
                      </div>
                      <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-primary/30" />
                    </div>
                  </ScrollReveal>

                  <div className={`grid gap-6 max-w-5xl mx-auto ${leaders.length === 1 ? "max-w-lg" : leaders.length === 2 ? "sm:grid-cols-2 max-w-3xl" : leaders.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
                    {leaders.map((f: any, i: number) => {
                      const accent = deptConfig[f.department]?.accentHsl || defaultAccent;
                      const isPrincipal = f.role.toLowerCase().includes("principal");
                      return (
                        <ScrollReveal key={f.id} delay={i * 80}>
                          <div
                            onClick={() => setSelectedFaculty(f)}
                            className={`relative bg-card rounded-3xl text-center group h-full flex flex-col cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                              isPrincipal
                                ? "p-8 border-2 border-primary/20 shadow-[0_8px_40px_-12px_hsla(var(--primary),0.15)] hover:shadow-[0_24px_60px_-15px_hsla(var(--primary),0.25)] hover:border-primary/40"
                                : "p-7 border border-border/40 hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_hsla(var(--secondary),0.15)]"
                            }`}
                          >
                            {/* Background radial glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, hsla(${accent}, 0.06), transparent 60%)` }} />

                            {/* Top accent gradient bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 10%, hsla(${accent}, 0.4) 50%, transparent 90%)` }} />

                            {/* Crown badge for Principal */}
                            {isPrincipal && (
                              <div className="absolute top-4 right-4 z-20">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, hsla(${accent}, 0.2), hsla(${accent}, 0.1))`, border: `1px solid hsla(${accent}, 0.2)` }}>
                                  <Crown className="w-4 h-4" style={{ color: `hsla(${accent}, 0.9)` }} />
                                </div>
                              </div>
                            )}

                            {/* HOD Shield badge */}
                            {!isPrincipal && (
                              <div className="absolute top-4 right-4 z-20">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `hsla(${accent}, 0.1)`, border: `1px solid hsla(${accent}, 0.15)` }}>
                                  <Shield className="w-3.5 h-3.5" style={{ color: `hsla(${accent}, 0.8)` }} />
                                </div>
                              </div>
                            )}

                            {/* Photo */}
                            <div className={`relative mx-auto flex items-center justify-center mb-5 group-hover:scale-105 transition-all duration-500 overflow-hidden z-10 ${
                              isPrincipal ? "w-32 h-32 sm:w-36 sm:h-36 rounded-[28px]" : "w-28 h-28 sm:w-32 sm:h-32 rounded-2xl"
                            }`} style={{ background: `linear-gradient(135deg, hsla(${accent}, 0.15), hsla(${accent}, 0.04))`, border: `2px solid hsla(${accent}, 0.15)`, boxShadow: `0 12px 40px -10px hsla(${accent}, 0.2)` }}>
                              {f.photo_url ? (
                                <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />
                              ) : (
                                <GraduationCap className={isPrincipal ? "w-14 h-14" : "w-11 h-11"} style={{ color: `hsla(${accent}, 0.6)` }} />
                              )}
                            </div>

                            <h3 className={`font-display font-bold text-foreground group-hover:text-primary transition-colors duration-300 relative z-10 ${isPrincipal ? "text-xl" : "text-lg"}`}>{f.name}</h3>
                            <p className="font-body text-xs font-bold mt-1.5 relative z-10" style={{ color: `hsla(${accent}, 1)` }}>{f.role}</p>

                            {/* Department badge */}
                            <span className="inline-block mt-3 mx-auto font-body text-[10px] font-semibold px-4 py-1.5 rounded-full border relative z-10" style={{ background: `hsla(${accent}, 0.08)`, color: `hsla(${accent}, 1)`, borderColor: `hsla(${accent}, 0.15)` }}>
                              {f.department}
                            </span>

                            <div className="mt-5 pt-4 border-t border-border/30 space-y-2 flex-1 relative z-10">
                              <p className="font-body text-xs text-muted-foreground leading-relaxed">{f.qualification}</p>
                              <div className="flex items-center justify-center gap-1.5 font-body text-xs text-muted-foreground">
                                <Briefcase className="w-3.5 h-3.5 shrink-0" /> {f.experience}
                              </div>
                            </div>

                            {(f.email || f.phone) && (
                              <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border/20 relative z-10" onClick={e => e.stopPropagation()}>
                                {f.email && (
                                  <a href={`mailto:${f.email}`} className="p-2.5 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                                    <Mail className="w-4 h-4" />
                                  </a>
                                )}
                                {f.phone && (
                                  <a href={`tel:${f.phone}`} className="p-2.5 rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200 hover:scale-110">
                                    <Phone className="w-4 h-4" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Regular Faculty */}
              {regularFaculty.length > 0 && (
                <>
                  {leaders.length > 0 && (
                    <ScrollReveal>
                      <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-border/50" />
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/30">
                          <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-body text-[11px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Faculty Members</span>
                        </div>
                        <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-border/50" />
                      </div>
                    </ScrollReveal>
                  )}

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 max-w-6xl mx-auto">
                    {regularFaculty.map((f: any, i: number) => {
                      const accent = deptConfig[f.department]?.accentHsl || defaultAccent;
                      return (
                        <ScrollReveal key={f.id} delay={i * 60}>
                          <div
                            onClick={() => setSelectedFaculty(f)}
                            className="relative bg-card rounded-3xl p-6 text-center group h-full flex flex-col cursor-pointer overflow-hidden border border-border/30 hover:border-border/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_hsla(var(--secondary),0.12)]"
                          >
                            {/* Ambient glow orb */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none" style={{ background: `hsla(${accent}, 0.12)` }} />
                            {/* Top accent line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-2/3 transition-all duration-600 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent, hsla(${accent}, 0.5), transparent)` }} />

                            {/* Photo */}
                            <div className="relative w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-1 transition-all duration-500 overflow-hidden border border-border/20 shadow-md z-10" style={{ background: `linear-gradient(135deg, hsla(${accent}, 0.12), hsla(${accent}, 0.04))` }}>
                              {f.photo_url ? (
                                <img src={f.photo_url} alt={f.name} className="w-full h-full object-cover" />
                              ) : (
                                <GraduationCap className="w-10 h-10" style={{ color: `hsla(${accent}, 0.8)` }} />
                              )}
                            </div>

                            <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 relative z-10">{f.name}</h3>
                            <p className="font-body text-xs font-semibold mt-1 relative z-10" style={{ color: `hsla(${accent}, 1)` }}>{f.role}</p>

                            <span className="inline-block mt-2.5 mx-auto font-body text-[10px] font-semibold px-3 py-1 rounded-full border border-border/20 relative z-10" style={{ background: `hsla(${accent}, 0.08)`, color: `hsla(${accent}, 1)` }}>
                              {f.department}
                            </span>

                            <div className="mt-4 pt-3 border-t border-border/30 space-y-1.5 flex-1 relative z-10">
                              <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{f.qualification}</p>
                              <div className="flex items-center justify-center gap-1.5 font-body text-[11px] text-muted-foreground">
                                <Briefcase className="w-3 h-3 shrink-0" /> {f.experience} experience
                              </div>
                            </div>

                            {(f.email || f.phone) && (
                              <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-border/20 relative z-10" onClick={e => e.stopPropagation()}>
                                {f.email && (
                                  <a href={`mailto:${f.email}`} className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110">
                                    <Mail className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {f.phone && (
                                  <a href={`tel:${f.phone}`} className="p-2 rounded-xl text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-all duration-200 hover:scale-110">
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            )}

                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-60 transition-opacity duration-300 z-10">
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Faculty Detail Modal */}
      {selectedFaculty && createPortal(
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-3 sm:p-4 animate-modal-backdrop" onClick={() => setSelectedFaculty(null)}>
          {/* Ambient glow behind card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full blur-[80px] animate-modal-glow" style={{ background: `hsl(var(--gold))` }} />
          </div>
          <div className="w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl animate-modal-card relative [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-card rounded-3xl border border-border/30 w-full shadow-[0_30px_80px_-20px_hsla(var(--secondary),0.25)] overflow-hidden">
              {(() => {
                const accent = deptConfig[selectedFaculty.department]?.accentHsl || defaultAccent;
                const isLeader = isLeadership(selectedFaculty.role);
                const isPrincipal = selectedFaculty.role.toLowerCase().includes("principal");
                return (
                  <>
                    <div className="relative p-6 sm:p-8 overflow-hidden">
                      {/* Background gradient */}
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsla(${accent}, ${isLeader ? "0.12" : "0.08"}), hsla(${accent}, 0.02))` }} />
                      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: `hsla(${accent}, 0.1)` }} />
                      <div className="absolute top-0 left-0 right-0 h-1 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 10%, hsla(${accent}, ${isLeader ? "0.5" : "0.3"}) 50%, transparent 90%)` }} />

                      <button onClick={() => setSelectedFaculty(null)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-background/50 backdrop-blur-sm border border-border/30 flex items-center justify-center hover:bg-background/80 transition-all duration-200 hover:scale-110 z-20 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>

                      {/* Leader badge in modal */}
                      {isLeader && (
                        <div className="flex justify-center mb-4 relative z-10">
                          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border" style={{ background: `hsla(${accent}, 0.1)`, borderColor: `hsla(${accent}, 0.2)` }}>
                            {isPrincipal ? <Crown className="w-3.5 h-3.5" style={{ color: `hsla(${accent}, 0.9)` }} /> : <Shield className="w-3.5 h-3.5" style={{ color: `hsla(${accent}, 0.9)` }} />}
                            <span className="font-body text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: `hsla(${accent}, 0.9)` }}>
                              {isPrincipal ? "Principal" : "Head of Department"}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center gap-4 relative z-10">
                        {selectedFaculty.photo_url ? (
                          <div className={`overflow-hidden border shadow-[0_12px_40px_-10px_hsla(var(--secondary),0.2)] shrink-0 ${isLeader ? "w-44 h-44 sm:w-52 sm:h-52 rounded-[28px] border-2" : "w-40 h-40 sm:w-48 sm:h-48 rounded-2xl"}`} style={{ borderColor: isLeader ? `hsla(${accent}, 0.25)` : 'hsl(var(--border) / 0.2)' }}>
                            <img src={selectedFaculty.photo_url} alt={selectedFaculty.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className={`flex items-center justify-center shrink-0 shadow-lg ${isLeader ? "w-44 h-44 sm:w-52 sm:h-52 rounded-[28px] border-2" : "w-40 h-40 sm:w-48 sm:h-48 rounded-2xl border"}`} style={{ background: `linear-gradient(135deg, hsla(${accent}, 0.12), hsla(${accent}, 0.03))`, borderColor: `hsla(${accent}, 0.2)` }}>
                            <GraduationCap className={isLeader ? "w-20 h-20" : "w-16 h-16 sm:w-20 sm:h-20"} style={{ color: `hsla(${accent}, 0.6)` }} />
                          </div>
                        )}
                        <div>
                          <h3 className={`font-display font-bold text-foreground leading-tight ${isLeader ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>{selectedFaculty.name}</h3>
                          <p className="font-body text-sm font-bold mt-1.5" style={{ color: `hsla(${accent}, 1)` }}>{selectedFaculty.role}</p>
                          <span className="inline-block mt-2 font-body text-[11px] font-semibold px-4 py-1.5 rounded-full border" style={{ background: `hsla(${accent}, 0.08)`, color: `hsla(${accent}, 1)`, borderColor: `hsla(${accent}, 0.15)` }}>
                            {selectedFaculty.department}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-2.5">
                      {[
                        { icon: Award, label: "Qualification", value: selectedFaculty.qualification },
                        { icon: Briefcase, label: "Experience", value: selectedFaculty.experience },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-3 p-3.5 rounded-2xl bg-muted/30 border border-border/20 group hover:border-border/40 transition-all duration-300">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-border/20" style={{ background: `linear-gradient(135deg, hsla(${accent}, 0.1), hsla(${accent}, 0.03))` }}>
                            <row.icon className="w-4 h-4" style={{ color: `hsla(${accent}, 0.8)` }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.12em]">{row.label}</p>
                            <p className="font-body text-sm font-semibold text-foreground break-words">{row.value}</p>
                          </div>
                        </div>
                      ))}

                      {selectedFaculty.subjects?.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/20">
                          <div className="flex items-center gap-2 mb-2.5">
                            <BookOpen className="w-4 h-4" style={{ color: `hsla(${accent}, 0.8)` }} />
                            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.12em]">Subjects</p>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedFaculty.subjects.map((s: string) => (
                              <span key={s} className="font-body text-xs px-3 py-1 rounded-full border" style={{ background: `hsla(${accent}, 0.06)`, color: `hsla(${accent}, 1)`, borderColor: `hsla(${accent}, 0.12)` }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(selectedFaculty.email || selectedFaculty.phone) && (
                        <div className="flex gap-2.5 pt-2">
                          {selectedFaculty.email && (
                            <a href={`mailto:${selectedFaculty.email}`} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/30 hover:border-primary/30 hover:bg-primary/5 font-body text-xs font-semibold transition-all duration-300 group text-muted-foreground hover:text-primary">
                              <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Email
                            </a>
                          )}
                          {selectedFaculty.phone && (
                            <a href={`tel:${selectedFaculty.phone}`} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border/30 hover:border-emerald-500/30 hover:bg-emerald-500/5 font-body text-xs font-semibold transition-all duration-300 group text-muted-foreground hover:text-emerald-500">
                              <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Call
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
