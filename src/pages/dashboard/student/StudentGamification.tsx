import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Award, Flame, Target, Star, Zap, Crown, Medal, TrendingUp, CheckCircle, BookOpen, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Badge definitions
const BADGE_DEFINITIONS = [
  { type: "perfect_week", name: "Perfect Week", desc: "100% attendance for 7 consecutive days", icon: Star, color: "from-amber-400 to-amber-600", requirement: "7-day perfect attendance streak" },
  { type: "streak_master", name: "Streak Master", desc: "Maintained a 14+ day study streak", icon: Flame, color: "from-orange-400 to-red-500", requirement: "14+ day study streak" },
  { type: "top_performer", name: "Top Performer", desc: "Scored 90%+ average in marks", icon: Crown, color: "from-purple-400 to-purple-600", requirement: "90%+ average marks" },
  { type: "consistent_learner", name: "Consistent Learner", desc: "Maintained 85%+ attendance overall", icon: Target, color: "from-emerald-400 to-emerald-600", requirement: "85%+ overall attendance" },
  { type: "high_achiever", name: "High Achiever", desc: "Scored 80%+ average in marks", icon: Award, color: "from-blue-400 to-blue-600", requirement: "80%+ average marks" },
  { type: "attendance_hero", name: "Attendance Hero", desc: "Never missed a class for 30+ records", icon: CheckCircle, color: "from-teal-400 to-teal-600", requirement: "30+ consecutive present records" },
  { type: "bookworm", name: "Bookworm", desc: "Logged study streak 7+ days", icon: BookOpen, color: "from-indigo-400 to-indigo-600", requirement: "7+ day study streak" },
  { type: "early_bird", name: "Early Bird", desc: "Achieved 75%+ attendance", icon: Clock, color: "from-cyan-400 to-cyan-600", requirement: "75%+ overall attendance" },
];

export default function StudentGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch student record
  const { data: student } = useQuery({
    queryKey: ["student-record-gamification", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, courses(name, code)")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch attendance data for points
  const { data: attendanceData } = useQuery({
    queryKey: ["gamification-attendance", student?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("attendance")
        .select("status, date")
        .eq("student_id", student!.id)
        .order("date", { ascending: true });
      return data || [];
    },
    enabled: !!student?.id,
  });

  // Fetch marks data
  const { data: marksData } = useQuery({
    queryKey: ["gamification-marks", student?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("marks")
        .select("obtained_marks, max_marks")
        .eq("student_id", student!.id);
      return data || [];
    },
    enabled: !!student?.id,
  });

  // Fetch study streak
  const { data: streakData } = useQuery({
    queryKey: ["gamification-streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("study_streaks")
        .select("streak")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch earned badges
  const { data: earnedBadges = [], isLoading: badgesLoading } = useQuery({
    queryKey: ["student-badges", student?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("student_badges")
        .select("*")
        .eq("student_id", student!.id);
      return data || [];
    },
    enabled: !!student?.id,
  });

  // Fetch leaderboard (top students by attendance points)
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ["gamification-leaderboard"],
    queryFn: async () => {
      // Get all students with their attendance and profiles
      const { data: students } = await supabase
        .from("students")
        .select("id, user_id, roll_number, courses(name, code)")
        .eq("is_active", true);
      if (!students) return [];

      const userIds = students.map(s => s.user_id);
      const studentIds = students.map(s => s.id);

      const [profilesRes, attendanceRes, marksRes, badgesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", userIds),
        supabase.from("attendance").select("student_id, status").in("student_id", studentIds),
        supabase.from("marks").select("student_id, obtained_marks, max_marks").in("student_id", studentIds),
        supabase.from("student_badges").select("student_id").in("student_id", studentIds),
      ]);

      const profiles = profilesRes.data || [];
      const allAttendance = attendanceRes.data || [];
      const allMarks = marksRes.data || [];
      const allBadges = badgesRes.data || [];

      return students.map(s => {
        const profile = profiles.find(p => p.user_id === s.user_id);
        const att = allAttendance.filter(a => a.student_id === s.id);
        const marks = allMarks.filter(m => m.student_id === s.id);
        const badges = allBadges.filter(b => b.student_id === s.id);

        const presentCount = att.filter(a => a.status === "present").length;
        const attPoints = presentCount * 10;
        const marksPoints = marks.reduce((sum, m) => sum + Math.round((m.obtained_marks / m.max_marks) * 50), 0);
        const badgePoints = badges.length * 100;
        const totalPoints = attPoints + marksPoints + badgePoints;

        return {
          id: s.id,
          name: profile?.full_name || "Unknown",
          avatar: profile?.avatar_url,
          course: (s as any).courses?.code || "",
          totalPoints,
          attPoints,
          marksPoints,
          badgePoints,
          isCurrentUser: s.user_id === user?.id,
        };
      }).sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 20);
    },
    enabled: !!user,
  });

  // Calculate points
  const totalAttendance = attendanceData?.length || 0;
  const presentCount = attendanceData?.filter(a => a.status === "present").length || 0;
  const attendancePct = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
  const attendancePoints = presentCount * 10;

  const avgMarks = marksData && marksData.length > 0
    ? Math.round(marksData.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marksData.length)
    : 0;
  const marksPoints = marksData?.reduce((sum, m) => sum + Math.round((m.obtained_marks / m.max_marks) * 50), 0) || 0;

  const streak = streakData?.streak || 0;
  const streakPoints = streak * 15;
  const badgePoints = earnedBadges.length * 100;
  const totalPoints = attendancePoints + marksPoints + streakPoints + badgePoints;

  // Calculate longest attendance streak
  const longestStreak = (() => {
    if (!attendanceData) return 0;
    let max = 0, current = 0;
    attendanceData.forEach(a => {
      if (a.status === "present") { current++; max = Math.max(max, current); }
      else current = 0;
    });
    return max;
  })();

  // Auto-award badges
  const awardBadge = useMutation({
    mutationFn: async ({ type, name, desc }: { type: string; name: string; desc: string }) => {
      const { error } = await supabase.from("student_badges").insert({
        student_id: student!.id,
        badge_type: type,
        badge_name: name,
        badge_description: desc,
      });
      if (error && !error.message.includes("duplicate")) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-badges"] }),
  });

  // Check and auto-award badges
  useEffect(() => {
    if (!student?.id || badgesLoading || !attendanceData || !marksData) return;
    const earned = earnedBadges.map(b => b.badge_type);

    if (attendancePct >= 75 && !earned.includes("early_bird"))
      awardBadge.mutate({ type: "early_bird", name: "Early Bird", desc: "Achieved 75%+ attendance" });
    if (attendancePct >= 85 && !earned.includes("consistent_learner"))
      awardBadge.mutate({ type: "consistent_learner", name: "Consistent Learner", desc: "Maintained 85%+ attendance overall" });
    if (avgMarks >= 80 && !earned.includes("high_achiever"))
      awardBadge.mutate({ type: "high_achiever", name: "High Achiever", desc: "Scored 80%+ average in marks" });
    if (avgMarks >= 90 && !earned.includes("top_performer"))
      awardBadge.mutate({ type: "top_performer", name: "Top Performer", desc: "Scored 90%+ average in marks" });
    if (longestStreak >= 30 && !earned.includes("attendance_hero"))
      awardBadge.mutate({ type: "attendance_hero", name: "Attendance Hero", desc: "Never missed a class for 30+ records" });
    if (streak >= 7 && !earned.includes("bookworm"))
      awardBadge.mutate({ type: "bookworm", name: "Bookworm", desc: "Logged study streak 7+ days" });
    if (streak >= 14 && !earned.includes("streak_master"))
      awardBadge.mutate({ type: "streak_master", name: "Streak Master", desc: "Maintained a 14+ day study streak" });
  }, [student?.id, attendanceData, marksData, earnedBadges, badgesLoading]);

  const currentRank = leaderboard.findIndex(l => l.isCurrentUser) + 1;

  // Level system
  const level = Math.floor(totalPoints / 500) + 1;
  const levelProgress = ((totalPoints % 500) / 500) * 100;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-purple-500/[0.04]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none bg-amber-500/10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Gamification Hub</h2>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Earn points, unlock badges, climb the leaderboard!</p>
            </div>
          </div>
          {currentRank > 0 && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="font-display text-lg font-bold text-amber-500">#{currentRank}</span>
            </div>
          )}
        </div>
      </div>

      {/* Level & Points Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border/40 rounded-3xl p-5 text-center col-span-2 sm:col-span-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
            <span className="font-display text-xl font-bold text-white">{level}</span>
          </div>
          <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-2">Level</p>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000" style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="font-body text-[10px] text-muted-foreground mt-1">{totalPoints % 500}/500 to next level</p>
        </div>
        {[
          { label: "Total Points", value: totalPoints, icon: Zap, gradient: "from-primary to-primary/70" },
          { label: "Badges Earned", value: earnedBadges.length, icon: Medal, gradient: "from-purple-500 to-purple-600" },
          { label: "Rank", value: currentRank > 0 ? `#${currentRank}` : "—", icon: TrendingUp, gradient: "from-emerald-500 to-emerald-600" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/40 rounded-3xl p-5 text-center hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mx-auto mb-2`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.15em] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Points Breakdown */}
      <div className="bg-card border border-border/40 rounded-3xl p-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Points Breakdown
        </h3>
        <div className="space-y-3">
          {[
            { label: "Attendance", detail: `${presentCount} present × 10 pts`, value: attendancePoints, color: "bg-emerald-500", pct: totalPoints > 0 ? (attendancePoints / totalPoints) * 100 : 0 },
            { label: "Marks", detail: `Performance-based scoring`, value: marksPoints, color: "bg-blue-500", pct: totalPoints > 0 ? (marksPoints / totalPoints) * 100 : 0 },
            { label: "Study Streak", detail: `${streak} days × 15 pts`, value: streakPoints, color: "bg-orange-500", pct: totalPoints > 0 ? (streakPoints / totalPoints) * 100 : 0 },
            { label: "Badges", detail: `${earnedBadges.length} badges × 100 pts`, value: badgePoints, color: "bg-purple-500", pct: totalPoints > 0 ? (badgePoints / totalPoints) * 100 : 0 },
          ].map(item => (
            <div key={item.label} className="space-y-1.5 p-3 rounded-2xl bg-muted/20 border border-border/20">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-body text-sm font-semibold text-foreground">{item.label}</span>
                  <span className="font-body text-xs text-muted-foreground ml-2">{item.detail}</span>
                </div>
                <span className="font-display text-sm font-bold text-foreground">{item.value} pts</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${Math.min(item.pct, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card border border-border/40 rounded-3xl p-6">
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Medal className="w-4 h-4 text-purple-500" /> Badges ({earnedBadges.length}/{BADGE_DEFINITIONS.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGE_DEFINITIONS.map(badge => {
            const earned = earnedBadges.find(b => b.badge_type === badge.type);
            const Icon = badge.icon;
            return (
              <div key={badge.type} className={`relative rounded-2xl p-4 text-center border transition-all duration-300 ${
                earned
                  ? "bg-card border-amber-500/30 hover:-translate-y-1 hover:shadow-lg"
                  : "bg-muted/20 border-border/20 opacity-50 grayscale"
              }`}>
                {earned && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-2 shadow-md ${!earned && "opacity-40"}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-body text-xs font-bold text-foreground">{badge.name}</p>
                <p className="font-body text-[10px] text-muted-foreground mt-0.5 leading-tight">{badge.requirement}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card border border-border/40 rounded-3xl p-6">
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" /> Leaderboard
        </h3>
        {leaderboardLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-2xl" />)}</div>
        ) : leaderboard.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-8">No data yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 15).map((entry, i) => (
              <div key={entry.id} className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                entry.isCurrentUser
                  ? "bg-primary/[0.05] border-primary/20 ring-1 ring-primary/10"
                  : "bg-card border-border/20 hover:border-border/40"
              }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-display text-sm font-bold ${
                  i === 0 ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white" :
                  i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
                  i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-body text-sm font-semibold truncate ${entry.isCurrentUser ? "text-primary" : "text-foreground"}`}>
                      {entry.name} {entry.isCurrentUser && <span className="text-[10px] text-primary/60">(You)</span>}
                    </p>
                  </div>
                  <p className="font-body text-[10px] text-muted-foreground">{entry.course}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-sm font-bold text-foreground">{entry.totalPoints}</p>
                  <p className="font-body text-[10px] text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
