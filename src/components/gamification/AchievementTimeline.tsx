import { Trophy, Star, Sparkles } from "lucide-react";
import { format } from "date-fns";

interface Badge {
  badge_type: string;
  badge_name: string;
  earned_at: string;
}

interface Props {
  earnedBadges: Badge[];
  totalPoints: number;
}

const MILESTONES = [
  { points: 100, label: "Rookie", icon: "🌱" },
  { points: 250, label: "Rising Star", icon: "⭐" },
  { points: 500, label: "Scholar", icon: "📚" },
  { points: 1000, label: "Champion", icon: "🏆" },
  { points: 2000, label: "Legend", icon: "👑" },
  { points: 5000, label: "Master", icon: "💎" },
];

export default function AchievementTimeline({ earnedBadges, totalPoints }: Props) {
  const currentMilestone = MILESTONES.filter(m => totalPoints >= m.points).pop();
  const nextMilestone = MILESTONES.find(m => totalPoints < m.points);

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.5s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-secondary" />
        </div>
        Milestones
      </h3>

      {/* Current title */}
      {currentMilestone && (
        <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-secondary/5 border border-secondary/20">
          <span className="text-2xl">{currentMilestone.icon}</span>
          <div>
            <p className="font-display text-sm font-bold text-secondary">{currentMilestone.label}</p>
            <p className="font-body text-[10px] text-muted-foreground">Current Title</p>
          </div>
          {nextMilestone && (
            <div className="ml-auto text-right">
              <p className="font-body text-[10px] text-muted-foreground">Next: {nextMilestone.icon} {nextMilestone.label}</p>
              <p className="font-display text-xs font-bold text-foreground">{nextMilestone.points - totalPoints} pts away</p>
            </div>
          )}
        </div>
      )}

      {/* Milestone progress */}
      <div className="flex items-center gap-1 mb-5">
        {MILESTONES.map((m, i) => {
          const reached = totalPoints >= m.points;
          return (
            <div key={m.points} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all ${
                reached
                  ? "bg-secondary/20 border-secondary/40 shadow-sm shadow-secondary/20"
                  : "bg-muted/10 border-border/30"
              }`}>
                {reached ? m.icon : <Star className="w-3 h-3 text-muted-foreground/40" />}
              </div>
              {i < MILESTONES.length - 1 && (
                <div className={`w-full h-0.5 rounded ${reached ? "bg-secondary/40" : "bg-border/20"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Recent achievements */}
      {earnedBadges.length > 0 && (
        <div className="space-y-2">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-2">Recent Achievements</p>
          {earnedBadges.slice(-3).reverse().map((badge) => (
            <div key={badge.badge_type} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/5 border border-border/10">
              <Sparkles className="w-4 h-4 text-secondary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs font-semibold text-foreground truncate">{badge.badge_name}</p>
              </div>
              <p className="font-body text-[10px] text-muted-foreground shrink-0">
                {format(new Date(badge.earned_at), "MMM d")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
