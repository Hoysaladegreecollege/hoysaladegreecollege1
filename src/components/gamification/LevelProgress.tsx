import { Zap, Medal, TrendingUp, Flame } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface Props {
  level: number;
  levelProgress: number;
  totalPoints: number;
  badgeCount: number;
  currentRank: number;
  streak: number;
  pointsToNext: number;
}

export default function LevelProgress({ level, levelProgress, totalPoints, badgeCount, currentRank, streak, pointsToNext }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3" style={{ animationDelay: "0.1s" }}>
      {/* Level Card - Larger */}
      <div className="bg-card border border-border/40 rounded-3xl p-5 text-center col-span-2 sm:col-span-1 gamify-card-enter relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center mx-auto mb-3 shadow-xl shadow-secondary/20 gamify-glow-pulse">
            <span className="font-display text-2xl font-black text-secondary-foreground">{level}</span>
          </div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-2.5">Level</p>
          <div className="h-2 bg-muted/40 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full gamify-progress-fill relative overflow-hidden"
              style={{
                width: `${levelProgress}%`,
                background: "linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--secondary) / 0.7))",
              }}
            >
              <div className="absolute inset-0 gamify-progress-bar bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
          <p className="font-body text-[10px] text-muted-foreground mt-1.5">
            <AnimatedCounter value={pointsToNext} className="font-semibold text-foreground" /> / 500 to next
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {[
        { label: "Total Points", value: totalPoints, icon: Zap, gradient: "from-primary to-primary/60", glow: "shadow-primary/20" },
        { label: "Badges", value: badgeCount, icon: Medal, gradient: "from-purple-500 to-purple-600", glow: "shadow-purple-500/20" },
        { label: "Rank", value: currentRank > 0 ? currentRank : 0, displayValue: currentRank > 0 ? `#${currentRank}` : "—", icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600", glow: "shadow-emerald-500/20" },
        { label: "Streak", value: streak, icon: Flame, gradient: "from-orange-500 to-red-500", glow: "shadow-orange-500/20", isStreak: true },
      ].map((s, i) => (
        <div
          key={s.label}
          className={`bg-card border border-border/40 rounded-3xl p-5 text-center gamify-card-enter relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${s.isStreak && streak >= 7 ? "ring-1 ring-orange-500/20" : ""}`}
          style={{ animationDelay: `${0.15 + i * 0.08}s` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-2.5 shadow-lg ${s.glow}`}>
              <s.icon className={`w-5 h-5 text-white ${s.isStreak && streak >= 7 ? "gamify-streak-fire" : ""}`} />
            </div>
            {s.displayValue ? (
              <p className="font-display text-2xl font-black text-foreground">{s.displayValue}</p>
            ) : (
              <AnimatedCounter value={s.value} className="font-display text-2xl font-black text-foreground" />
            )}
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
