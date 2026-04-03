import { Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  icon: React.ElementType;
  color: string;
}

interface Props {
  attendancePct: number;
  presentCount: number;
  avgMarks: number;
  streak: number;
  totalMarksEntries: number;
}

export default function WeeklyChallenges({ attendancePct, presentCount, avgMarks, streak, totalMarksEntries }: Props) {
  const challenges: Challenge[] = [
    {
      id: "attend_5",
      title: "Attendance Champion",
      description: "Attend 5 classes this week",
      target: 5,
      current: Math.min(presentCount, 5),
      reward: 50,
      icon: Target,
      color: "from-emerald-400 to-emerald-600",
    },
    {
      id: "streak_3",
      title: "Study Warrior",
      description: "Maintain a 3-day study streak",
      target: 3,
      current: Math.min(streak, 3),
      reward: 75,
      icon: TrendingUp,
      color: "from-orange-400 to-red-500",
    },
    {
      id: "marks_80",
      title: "Score High",
      description: "Score 80%+ average marks",
      target: 80,
      current: Math.min(avgMarks, 80),
      reward: 100,
      icon: Target,
      color: "from-blue-400 to-blue-600",
    },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.35s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Target className="w-3.5 h-3.5 text-primary" />
        </div>
        Weekly Challenges
        <span className="ml-auto font-body text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> Resets weekly
        </span>
      </h3>

      <div className="space-y-3">
        {challenges.map((ch, i) => {
          const pct = ch.target > 0 ? Math.min((ch.current / ch.target) * 100, 100) : 0;
          const completed = pct >= 100;
          const Icon = ch.icon;

          return (
            <div
              key={ch.id}
              className={`p-4 rounded-2xl border transition-all duration-300 ${
                completed
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-muted/5 border-border/20 hover:border-border/40"
              }`}
              style={{ animationDelay: `${0.4 + i * 0.08}s` }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center shrink-0 ${completed ? "opacity-100" : "opacity-70"}`}>
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <Icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-sm font-semibold ${completed ? "text-emerald-500" : "text-foreground"}`}>
                    {ch.title}
                    {completed && <span className="ml-1.5 text-[10px]">✓</span>}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">{ch.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display text-xs font-bold text-secondary">+{ch.reward}</span>
                  <p className="font-body text-[10px] text-muted-foreground">pts</p>
                </div>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full gamify-progress-fill relative overflow-hidden transition-all duration-700 ${completed ? "bg-emerald-500" : ""}`}
                  style={{
                    width: `${pct}%`,
                    background: completed ? undefined : `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))`,
                  }}
                >
                  <div className="absolute inset-0 gamify-progress-bar bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
              </div>
              <p className="font-body text-[10px] text-muted-foreground mt-1.5 text-right">
                {ch.current}/{ch.target}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
