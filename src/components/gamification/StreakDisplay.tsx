import { Flame, Zap } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface Props {
  streak: number;
  attendancePct: number;
  avgMarks: number;
  longestStreak: number;
}

export default function StreakDisplay({ streak, attendancePct, avgMarks, longestStreak }: Props) {
  const intensity = streak >= 14 ? "high" : streak >= 7 ? "medium" : "low";

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.25s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
      <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
        </div>
        Streak & Stats
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Active Streak */}
        <div className={`relative rounded-2xl p-4 text-center border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent ${
          intensity === "high" ? "ring-1 ring-orange-500/30" : ""
        }`}>
          <div className={`text-3xl mb-1 ${intensity !== "low" ? "gamify-streak-fire inline-block" : ""}`}>
            🔥
          </div>
          <AnimatedCounter value={streak} className="font-display text-2xl font-black text-foreground block" />
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Day Streak</p>
          {intensity === "high" && (
            <div className="absolute -top-1 -right-1">
              <Zap className="w-4 h-4 text-orange-500 gamify-streak-fire" />
            </div>
          )}
        </div>

        {/* Attendance */}
        <div className="rounded-2xl p-4 text-center border border-border/20 bg-muted/5">
          <div className="relative w-12 h-12 mx-auto mb-1.5">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity="0.3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="url(#attGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${attendancePct * 0.9738} 100`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="attGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(142, 70%, 45%)" />
                  <stop offset="100%" stopColor="hsl(142, 70%, 35%)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-black text-foreground">
              {attendancePct}%
            </span>
          </div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Attendance</p>
        </div>

        {/* Avg Marks */}
        <div className="rounded-2xl p-4 text-center border border-border/20 bg-muted/5">
          <div className="relative w-12 h-12 mx-auto mb-1.5">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" opacity="0.3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="url(#marksGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${avgMarks * 0.9738} 100`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="marksGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(220, 55%, 55%)" />
                  <stop offset="100%" stopColor="hsl(220, 55%, 40%)" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-black text-foreground">
              {avgMarks}%
            </span>
          </div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Avg Marks</p>
        </div>

        {/* Longest Streak */}
        <div className="rounded-2xl p-4 text-center border border-border/20 bg-muted/5">
          <div className="text-3xl mb-1">⚡</div>
          <AnimatedCounter value={longestStreak} className="font-display text-2xl font-black text-foreground block" />
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Best Streak</p>
        </div>
      </div>
    </div>
  );
}
