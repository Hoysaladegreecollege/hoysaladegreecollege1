import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Trophy, Medal, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultAchievers = [
  { name: "Anusha C.H", usn: "U03EF22C0068", percentage: "98.14%", course: "Bachelor of Commerce", batch: "2022–2025", rank: 1 },
  { name: "SIMRAN B", usn: "UO3EF22C0007", percentage: "94.14%", course: "Bachelor of Commerce", batch: "2022–2025", rank: 2 },
];

export default function Achievements() {
  const { data: topStudents = [] } = useQuery({
    queryKey: ["achievements-top-students"],
    queryFn: async () => {
      const { data } = await supabase.from("top_students").select("*").eq("is_active", true).order("rank");
      return data || [];
    },
  });

  return (
    <div className="page-enter">
      <PageHeader title="Student Achievements" subtitle="Celebrating excellence and hard work" />

      <section className="py-16 sm:py-24 bg-background">
        <div className="container px-4">
          <SectionHeading title="🏆 Top Rank Holders 2022–2025" subtitle="Our brightest stars who achieved outstanding university results" />
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {defaultAchievers.map((a, i) => (
              <ScrollReveal key={a.name} delay={i * 150}>
                <div className="premium-card p-8 sm:p-10 text-center group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gradient-to-bl from-secondary to-secondary/80 text-secondary-foreground px-5 py-1.5 rounded-bl-2xl font-display text-sm font-bold shadow-lg">
                    Rank #{a.rank}
                  </div>
                  <div className="w-24 h-24 rounded-full mx-auto mb-5 bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Medal className="w-12 h-12 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{a.name}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">USN: {a.usn}</p>
                  <p className="font-display text-4xl font-bold text-secondary mt-4 animate-scale-bounce">{a.percentage}</p>
                  <p className="font-body text-sm text-foreground mt-3 font-medium">{a.course}</p>
                  <p className="font-body text-xs text-muted-foreground">Batch: {a.batch}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {topStudents.length > 0 && (
        <section className="py-16 sm:py-20 bg-cream">
          <div className="container px-4">
            <SectionHeading title="More Top Achievers" subtitle="Students uploaded by the administration" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto">
              {topStudents.map((s: any, i: number) => (
                <ScrollReveal key={s.id} delay={i * 100}>
                  <div className="premium-card p-6 text-center group">
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.student_name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-secondary/40 shadow-lg group-hover:scale-110 group-hover:border-secondary transition-all duration-300" />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Medal className="w-10 h-10 text-secondary" />
                      </div>
                    )}
                    <div className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary-foreground font-body text-xs font-bold mb-2">
                      Rank #{s.rank}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{s.student_name}</h3>
                    <p className="font-body text-sm text-secondary font-semibold">{s.course}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{s.year}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
