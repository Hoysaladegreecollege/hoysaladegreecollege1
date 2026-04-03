import { Trophy, Crown, Sparkles } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface Props {
  currentRank: number;
  totalPoints: number;
}

export default function GamificationHeader({ currentRank, totalPoints }: Props) {
  return (
    <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8 gamify-card-enter">
      {/* Ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.08] via-transparent to-primary/[0.06]" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px] pointer-events-none bg-secondary/10" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-[80px] pointer-events-none bg-primary/10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg shadow-secondary/20 gamify-glow-pulse">
              <Trophy className="w-7 h-7 text-secondary-foreground" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-secondary animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Gamification Hub
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Earn points • Unlock badges • Climb ranks
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {currentRank > 0 && (
            <div className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-2xl px-5 py-2.5 gamify-glow-pulse">
              <Crown className="w-5 h-5 text-secondary" />
              <span className="font-display text-xl font-black text-secondary">#{currentRank}</span>
            </div>
          )}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-2.5">
            <AnimatedCounter value={totalPoints} className="font-display text-xl font-black text-primary" suffix=" pts" />
          </div>
        </div>
      </div>
    </div>
  );
}
