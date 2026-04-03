import { Trophy, Crown, Medal, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AnimatedCounter from "./AnimatedCounter";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  course: string;
  totalPoints: number;
  isCurrentUser: boolean;
}

interface Props {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
}

const rankConfig = [
  { bg: "bg-gradient-to-br from-amber-400 to-amber-600", shadow: "shadow-amber-500/30", icon: Crown, label: "🥇" },
  { bg: "bg-gradient-to-br from-gray-300 to-gray-500", shadow: "shadow-gray-400/30", icon: Medal, label: "🥈" },
  { bg: "bg-gradient-to-br from-orange-400 to-orange-600", shadow: "shadow-orange-500/30", icon: Award, label: "🥉" },
];

export default function LeaderboardSection({ leaderboard, loading }: Props) {
  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.55s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-secondary" />
        </div>
        Leaderboard
      </h3>

      {loading ? (
        <div className="space-y-2.5">{[1, 2, 3].map(i => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
      ) : leaderboard.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground text-center py-10">No data yet</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.slice(0, 15).map((entry, i) => {
            const isTop3 = i < 3;
            const rank = rankConfig[i];
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 gamify-rank-shift group hover:-translate-y-0.5 ${
                  entry.isCurrentUser
                    ? "bg-primary/[0.06] border-primary/25 ring-1 ring-primary/15 shadow-lg shadow-primary/5"
                    : isTop3
                    ? "bg-card border-secondary/15 hover:border-secondary/30"
                    : "bg-card border-border/20 hover:border-border/40"
                }`}
                style={{ animationDelay: `${0.6 + i * 0.05}s` }}
              >
                {/* Rank Badge */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-display text-sm font-black relative overflow-hidden ${
                  isTop3 && rank
                    ? `${rank.bg} text-white shadow-lg ${rank.shadow}`
                    : "bg-muted/50 text-muted-foreground"
                }`}>
                  {i + 1}
                  {isTop3 && <div className="absolute inset-0 gamify-medal-shine pointer-events-none" />}
                </div>

                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden ${
                  isTop3 ? "ring-2 ring-secondary/30" : "ring-1 ring-border/30"
                }`}>
                  {entry.avatar ? (
                    <img src={entry.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-display">
                      {entry.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Name & Course */}
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-sm font-semibold truncate ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-1.5 text-[10px] text-primary/50 bg-primary/10 px-1.5 py-0.5 rounded-full">You</span>
                    )}
                  </p>
                  <p className="font-body text-[10px] text-muted-foreground">{entry.course}</p>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <AnimatedCounter value={entry.totalPoints} className="font-display text-sm font-black text-foreground" />
                  <p className="font-body text-[10px] text-muted-foreground">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
