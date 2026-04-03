import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Flame, CheckCircle, Zap } from "lucide-react";
import confetti from "canvas-confetti";

interface Props {
  streak: number;
  lastDate: string | null;
  onCheckedIn?: () => void;
}

export default function DailyCheckIn({ streak, lastDate, onCheckedIn }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];
  const alreadyCheckedIn = lastDate === today;

  const multiplier = streak >= 30 ? 3 : streak >= 14 ? 2.5 : streak >= 7 ? 2 : streak >= 3 ? 1.5 : 1;

  const checkIn = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not logged in");

      const { data: existing } = await supabase
        .from("study_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (existing) {
        const isConsecutive = existing.last_date === yesterdayStr;
        const newStreak = isConsecutive ? existing.streak + 1 : 1;

        const { error } = await supabase
          .from("study_streaks")
          .update({ streak: newStreak, last_date: today, updated_at: new Date().toISOString() })
          .eq("user_id", user.id);
        if (error) throw error;
        return newStreak;
      } else {
        const { error } = await supabase
          .from("study_streaks")
          .insert({ user_id: user.id, streak: 1, last_date: today });
        if (error) throw error;
        return 1;
      }
    },
    onSuccess: (newStreak) => {
      queryClient.invalidateQueries({ queryKey: ["gamification-streak"] });
      toast.success(`🔥 Study streak: ${newStreak} days!`, { duration: 3000 });
      if (newStreak >= 7) {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 }, colors: ["#FF6B35", "#FFD700", "#FF4500"] });
      }
      onCheckedIn?.();
    },
    onError: () => toast.error("Failed to check in. Try again."),
  });

  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.2s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
          </div>
          Daily Study Check-In
        </h3>
        {multiplier > 1 && (
          <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1">
            <Zap className="w-3 h-3 text-orange-500" />
            <span className="font-display text-xs font-bold text-orange-500">{multiplier}x</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => checkIn.mutate()}
          disabled={alreadyCheckedIn || checkIn.isPending}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-display text-sm font-bold transition-all duration-300 ${
            alreadyCheckedIn
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 cursor-default"
              : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {alreadyCheckedIn ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Checked In Today ✓
            </>
          ) : checkIn.isPending ? (
            <span className="animate-pulse">Checking in...</span>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              Check In Now
            </>
          )}
        </button>
      </div>

      {/* XP Multiplier tiers */}
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        {[
          { days: 3, mult: "1.5x", active: streak >= 3 },
          { days: 7, mult: "2x", active: streak >= 7 },
          { days: 14, mult: "2.5x", active: streak >= 14 },
          { days: 30, mult: "3x", active: streak >= 30 },
        ].map((tier) => (
          <div
            key={tier.days}
            className={`text-center py-2 rounded-xl border text-[10px] font-body transition-all ${
              tier.active
                ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                : "bg-muted/5 border-border/20 text-muted-foreground"
            }`}
          >
            <span className="font-display font-bold block">{tier.mult}</span>
            <span>{tier.days}d+</span>
          </div>
        ))}
      </div>
    </div>
  );
}
