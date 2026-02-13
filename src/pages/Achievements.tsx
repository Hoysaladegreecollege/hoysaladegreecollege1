import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Trophy, Star, Medal, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const staticAchievements = [
  { name: "Ananya R.", course: "BCA", achievement: "University Gold Medalist – 2025", type: "Academic" },
  { name: "Rahul M.", course: "BBA", achievement: "State-level Business Plan Competition Winner", type: "Competition" },
  { name: "Priya S.", course: "B.Com", achievement: "CA Foundation – All India Rank 45", type: "Academic" },
  { name: "Vikram K.", course: "BCA", achievement: "National Level Hackathon – 1st Place", type: "Technical" },
  { name: "Sneha D.", course: "BBA", achievement: "Best Speaker – Inter-College Debate", type: "Cultural" },
  { name: "Arun P.", course: "B.Com", achievement: "District Cricket Championship MVP", type: "Sports" },
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
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Student Achievements</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Achievements</p>
        </div>
      </section>

      {/* Top Rank Holders from DB */}
      {topStudents.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container">
            <SectionHeading title="Top Rank Holders 2022–2025" subtitle="Our brightest stars who achieved outstanding results" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {topStudents.map((s: any, i: number) => (
                <ScrollReveal key={s.id} delay={i * 100}>
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover-lift">
                    {s.photo_url ? (
                      <img src={s.photo_url} alt={s.student_name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-3 border-secondary shadow-lg" />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-secondary/20 flex items-center justify-center">
                        <Medal className="w-10 h-10 text-secondary" />
                      </div>
                    )}
                    <div className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-body text-xs font-bold mb-2">
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

      {/* Static Achievements */}
      <section className="py-20 bg-background">
        <div className="container">
          <SectionHeading title="Our Stars" subtitle="Celebrating the accomplishments of our talented students" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {staticAchievements.map((a, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-card border border-border rounded-xl p-6 text-center hover-lift">
                  <div className="w-14 h-14 mx-auto rounded-full bg-secondary/15 flex items-center justify-center mb-4">
                    <Trophy className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{a.name}</h3>
                  <p className="font-body text-xs text-secondary font-semibold mt-1">{a.course}</p>
                  <p className="font-body text-sm text-muted-foreground mt-3">{a.achievement}</p>
                  <span className="inline-block mt-3 text-[10px] font-body px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{a.type}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
