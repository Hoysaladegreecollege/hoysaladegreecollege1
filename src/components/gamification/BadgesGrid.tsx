import { CheckCircle, Medal, Star, Flame, Crown, Target, Award, BookOpen, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BadgeDef {
  type: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  requirement: string;
}

interface EarnedBadge {
  badge_type: string;
  earned_at: string;
}

const BADGE_DEFINITIONS: BadgeDef[] = [
  { type: "perfect_week", name: "Perfect Week", desc: "100% attendance for 7 consecutive days", icon: Star, color: "from-amber-400 to-amber-600", requirement: "7-day perfect attendance streak" },
  { type: "streak_master", name: "Streak Master", desc: "Maintained a 14+ day study streak", icon: Flame, color: "from-orange-400 to-red-500", requirement: "14+ day study streak" },
  { type: "top_performer", name: "Top Performer", desc: "Scored 90%+ average in marks", icon: Crown, color: "from-purple-400 to-purple-600", requirement: "90%+ average marks" },
  { type: "consistent_learner", name: "Consistent Learner", desc: "Maintained 85%+ attendance overall", icon: Target, color: "from-emerald-400 to-emerald-600", requirement: "85%+ overall attendance" },
  { type: "high_achiever", name: "High Achiever", desc: "Scored 80%+ average in marks", icon: Award, color: "from-blue-400 to-blue-600", requirement: "80%+ average marks" },
  { type: "attendance_hero", name: "Attendance Hero", desc: "Never missed a class for 30+ records", icon: CheckCircle, color: "from-teal-400 to-teal-600", requirement: "30+ consecutive present records" },
  { type: "bookworm", name: "Bookworm", desc: "Logged study streak 7+ days", icon: BookOpen, color: "from-indigo-400 to-indigo-600", requirement: "7+ day study streak" },
  { type: "early_bird", name: "Early Bird", desc: "Achieved 75%+ attendance", icon: Clock, color: "from-cyan-400 to-cyan-600", requirement: "75%+ overall attendance" },
];

export { BADGE_DEFINITIONS };

interface Props {
  earnedBadges: EarnedBadge[];
  newlyEarned?: string[];
}

export default function BadgesGrid({ earnedBadges, newlyEarned = [] }: Props) {
  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.45s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Medal className="w-3.5 h-3.5 text-purple-500" />
        </div>
        Badges
        <span className="ml-auto font-body text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full">
          {earnedBadges.length}/{BADGE_DEFINITIONS.length}
        </span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BADGE_DEFINITIONS.map((badge, i) => {
          const earned = earnedBadges.find(b => b.badge_type === badge.type);
          const isNew = newlyEarned.includes(badge.type);
          const Icon = badge.icon;
          return (
            <div
              key={badge.type}
              className={`relative rounded-2xl p-4 text-center border transition-all duration-500 group ${
                earned
                  ? `bg-card border-secondary/30 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/10 ${isNew ? "gamify-badge-unlock" : ""}`
                  : "bg-muted/10 border-border/20 opacity-40 grayscale"
              }`}
              style={{ animationDelay: `${0.5 + i * 0.06}s` }}
            >
              {earned && (
                <>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
                </>
              )}
              <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-2.5 shadow-lg transition-all duration-300 ${
                earned ? "group-hover:shadow-xl group-hover:scale-110" : "opacity-40"
              }`}>
                <Icon className="w-7 h-7 text-white drop-shadow-md" />
                {earned && (
                  <div className="absolute inset-0 rounded-xl gamify-medal-shine pointer-events-none" />
                )}
              </div>
              <p className="font-body text-xs font-bold text-foreground leading-tight">{badge.name}</p>
              <p className="font-body text-[10px] text-muted-foreground mt-1 leading-tight">{badge.requirement}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
