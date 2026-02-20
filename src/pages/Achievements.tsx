import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Trophy, Medal, Star, Award, Sparkles, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const defaultAchievers = [
  { name: "Anusha C.H", usn: "U03EF22C0068", percentage: "98.14%", course: "Bachelor of Commerce", batch: "2022–2025", rank: 1 },
  { name: "SIMRAN B", usn: "UO3EF22C0007", percentage: "94.14%", course: "Bachelor of Commerce", batch: "2022–2025", rank: 2 },
];

const RANK_LABELS = ["🥇", "🥈", "🥉", "4th", "5th", "6th"];
const RANK_RING_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

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
        x: W / 2 + (Math.random() - 0.5) * 20, y: H / 2,
        vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 3 - 1,
        alpha: 1, color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2, rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.3,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles = particles.filter(p => p.alpha > 0.02);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06;
        p.alpha -= 0.012; p.rot += p.rotV;
        ctx.save(); ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
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
          x: W / 2 + (Math.random() - 0.5) * 40, y: H / 2,
          vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 4 - 2,
          alpha: 1, color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2, rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.4,
        });
      }
    }, 800);
    return () => { cancelAnimationFrame(animId); clearInterval(interval); };
  }, [rank]);

  const s = size === "lg" ? 80 : 60;
  return <canvas ref={canvasRef} width={s} height={s} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function RankCard({ a, isDefault = false }: { a: any; isDefault?: boolean }) {
  const ringColor = a.rank <= 3 ? RANK_RING_COLORS[a.rank - 1] : "hsl(var(--secondary))";
  const bgGrad = a.rank === 1
    ? "from-yellow-50 via-amber-50/50 to-background"
    : a.rank === 2
    ? "from-gray-50 via-slate-50/50 to-background"
    : "from-orange-50 via-amber-50/50 to-background";

  return (
    <div className={`premium-card p-8 sm:p-10 text-center group relative overflow-hidden bg-gradient-to-br ${bgGrad}`}>
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(circle at 50% 30%, ${ringColor}18, transparent 70%)` }} />

      {/* Rank ribbon */}
      <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl font-display text-xs font-bold shadow-lg text-white"
        style={{ background: a.rank === 1 ? "linear-gradient(135deg, #FFD700, #FF8F00)" : a.rank === 2 ? "linear-gradient(135deg, #9E9E9E, #607D8B)" : "linear-gradient(135deg, #CD7F32, #8B4513)" }}>
        {RANK_LABELS[Math.min(a.rank - 1, 5)]} Rank #{a.rank}
      </div>

      {/* Photo / Medal */}
      <div className="relative w-28 h-28 mx-auto mb-5">
        {a.photo_url ? (
          <img src={a.photo_url} alt={a.student_name || a.name}
            className="w-28 h-28 rounded-full object-cover shadow-xl group-hover:scale-105 transition-all duration-500 relative z-10 border-4"
            style={{ borderColor: ringColor }} />
        ) : (
          <div className="w-28 h-28 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10 border-4 shadow-xl"
            style={{ borderColor: ringColor, background: `linear-gradient(135deg, ${ringColor}30, ${ringColor}10)` }}>
            <Medal className="w-12 h-12" style={{ color: ringColor }} />
          </div>
        )}
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"
          style={{ background: ringColor }} />
        <MedalAnimation rank={a.rank} />
      </div>

      <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
        {a.student_name || a.name}
      </h3>
      {(a.usn || isDefault) && <p className="font-body text-xs text-muted-foreground mt-1">USN: {a.usn}</p>}
      {a.percentage && (
        <p className="font-display text-4xl font-bold mt-4" style={{ color: ringColor }}>{a.percentage}</p>
      )}
      <p className="font-body text-sm text-foreground mt-3 font-medium">{a.course}</p>
      {(a.batch || a.year) && (
        <p className="font-body text-xs text-muted-foreground mt-1">Batch: {a.batch || a.year}</p>
      )}

      {/* Bottom shimmer bar */}
      <div className="mt-5 h-0.5 bg-gradient-to-r from-transparent via-secondary/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}

export default function Achievements() {
  const { data: topStudents = [], isLoading } = useQuery({
    queryKey: ["achievements-top-students"],
    queryFn: async () => {
      const { data } = await supabase.from("top_students").select("*").eq("is_active", true).order("rank");
      return data || [];
    },
  });

  return (
    <div className="page-enter">
      <PageHeader title="Student Achievements" subtitle="Celebrating excellence and hard work" />

      {/* Top Rank Holders (static default) */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal>
            <SectionHeading
              title="🏆 Top Rank Holders 2022–2025"
              subtitle="Our brightest stars who achieved outstanding university results"
            />
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {defaultAchievers.map((a, i) => (
              <ScrollReveal key={a.name} delay={i * 150}>
                <RankCard a={a} isDefault />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-10 sm:py-14 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark to-primary opacity-60" />
        <div className="relative container px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-primary-foreground text-center">
            {[
              { icon: TrendingUp, value: "90%", label: "Placement Rate" },
              { icon: Trophy, value: "15+", label: "Rank Holders" },
              { icon: Star, value: "250+", label: "Alumni" },
              { icon: Award, value: "100%", label: "Pass Rate" },
            ].map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 100}>
                <div className="group">
                  <s.icon className="w-7 h-7 text-secondary mx-auto mb-2 group-hover:scale-125 transition-transform duration-300" />
                  <div className="font-display text-3xl font-bold">{s.value}</div>
                  <div className="font-body text-xs opacity-50 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic top students from DB */}
      {(isLoading || topStudents.length > 0) && (
        <section className="py-16 sm:py-20 bg-cream relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(hsl(var(--secondary)) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="container px-4 relative">
            <ScrollReveal>
              <SectionHeading title="🌟 More Top Achievers" subtitle="Hall of fame — students recognized by administration" />
            </ScrollReveal>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
                    <Skeleton className="w-28 h-28 rounded-full mx-auto" />
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                    <Skeleton className="h-3 w-1/2 mx-auto" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {topStudents.map((s: any, i: number) => (
                  <ScrollReveal key={s.id} delay={i * 100}>
                    <RankCard a={s} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Inspiration CTA */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container max-w-2xl px-4 text-center">
          <ScrollReveal>
            <div className="premium-card p-8 sm:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl" />
              <Sparkles className="w-12 h-12 text-secondary mx-auto mb-4 animate-float" />
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">Be the Next Achiever</h3>
              <p className="font-body text-muted-foreground text-sm mb-6 leading-relaxed">
                Join Hoysala Degree College and write your own success story. Excellence is not just an aspiration — it's a tradition here.
              </p>
              <a href="/admissions"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-body font-bold text-sm text-primary-foreground hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))" }}>
                <Trophy className="w-4 h-4" /> Start Your Journey
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
