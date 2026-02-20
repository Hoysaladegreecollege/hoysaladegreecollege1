import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Trophy, Medal, Star, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

const defaultAchievers = [
  { name: "Anusha C.H", usn: "U03EF22C0068", percentage: "98.14%", course: "Bachelor of Commerce", batch: "2022–2025", rank: 1 },
  { name: "SIMRAN B", usn: "UO3EF22C0007", percentage: "94.14%", course: "Bachelor of Commerce", batch: "2022–2025", rank: 2 },
];

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32", "#4ECDC4", "#FF6B6B", "#A855F7"];
const RANK_LABELS = ["🥇", "🥈", "🥉", "4th", "5th", "6th"];

function MedalAnimation({ rank, size = "lg" }: { rank: number; size?: "sm" | "lg" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let particles: { x: number; y: number; vx: number; vy: number; alpha: number; color: string; size: number; rot: number; rotV: number }[] = [];
    const W = canvas.width, H = canvas.height;
    const colors = rank === 1 ? ["#FFD700","#FFC107","#FFEB3B","#FF8F00"] : rank === 2 ? ["#E8E8E8","#BDBDBD","#9E9E9E","#CFD8DC"] : ["#CD7F32","#A0522D","#8B4513","#DEB887"];

    for (let i = 0; i < 18; i++) {
      particles.push({
        x: W / 2 + (Math.random() - 0.5) * 20,
        y: H / 2,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3 - 1,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles = particles.filter(p => p.alpha > 0.02);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06;
        p.alpha -= 0.012; p.rot += p.rotV;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (particles.length > 0) animId = requestAnimationFrame(draw);
    };
    draw();
    const interval = setInterval(() => {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: W / 2 + (Math.random() - 0.5) * 40,
          y: H / 2,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 4 - 2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.4,
        });
      }
    }, 800);
    return () => { cancelAnimationFrame(animId); clearInterval(interval); };
  }, [rank]);

  const s = size === "lg" ? 80 : 60;
  return <canvas ref={canvasRef} width={s} height={s} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

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
                  <div className="relative w-24 h-24 mx-auto mb-5">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary/30 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Medal className="w-12 h-12 text-secondary" />
                    </div>
                    <MedalAnimation rank={a.rank} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{a.name}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">USN: {a.usn}</p>
                  <p className="font-display text-4xl font-bold text-secondary mt-4">{a.percentage}</p>
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
            <SectionHeading title="🌟 More Top Achievers" subtitle="Hall of fame — students recognized by administration" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {topStudents.map((s: any, i: number) => (
                <ScrollReveal key={s.id} delay={i * 100}>
                  <div className="premium-card p-6 text-center group relative overflow-hidden">
                    {/* Rank badge */}
                    <div className={`absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${
                      s.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white" :
                      s.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
                      s.rank === 3 ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white" :
                      "bg-primary/10 text-primary"
                    }`}>
                      {RANK_LABELS[Math.min(s.rank - 1, 5)]}
                    </div>

                    {/* Photo with medal animation */}
                    <div className="relative w-28 h-28 mx-auto mb-4">
                      {s.photo_url ? (
                        <img
                          src={s.photo_url}
                          alt={s.student_name}
                          className="w-28 h-28 rounded-full object-cover border-4 shadow-xl group-hover:scale-105 transition-all duration-500 relative z-10"
                          style={{
                            borderColor: s.rank === 1 ? "#FFD700" : s.rank === 2 ? "#C0C0C0" : s.rank === 3 ? "#CD7F32" : "hsl(var(--secondary))"
                          }}
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative z-10 border-4 border-secondary/30">
                          <Award className="w-12 h-12 text-secondary" />
                        </div>
                      )}
                      {/* Medal sparkle animation */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <MedalAnimation rank={s.rank} />
                      </div>
                      {/* Glow ring */}
                      <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 ${
                        s.rank === 1 ? "bg-yellow-400" : s.rank === 2 ? "bg-gray-300" : s.rank === 3 ? "bg-amber-600" : "bg-secondary"
                      }`} />
                    </div>

                    <h3 className="font-display text-lg font-bold text-foreground">{s.student_name}</h3>
                    <p className="font-body text-sm text-secondary font-semibold mt-1">{s.course}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">Batch {s.year}</p>

                    {/* Bottom ribbon */}
                    <div className={`mt-4 py-1.5 rounded-xl text-xs font-body font-bold ${
                      s.rank === 1 ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800" :
                      s.rank === 2 ? "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700" :
                      s.rank === 3 ? "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800" :
                      "bg-primary/10 text-primary"
                    }`}>
                      Rank #{s.rank} — Top Achiever
                    </div>
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
