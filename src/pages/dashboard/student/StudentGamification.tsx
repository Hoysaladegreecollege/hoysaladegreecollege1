import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import GamificationHeader from "@/components/gamification/GamificationHeader";
import LevelProgress from "@/components/gamification/LevelProgress";
import DailyCheckIn from "@/components/gamification/DailyCheckIn";
import PointsBreakdown from "@/components/gamification/PointsBreakdown";
import BadgesGrid, { BADGE_DEFINITIONS } from "@/components/gamification/BadgesGrid";
import LeaderboardSection from "@/components/gamification/LeaderboardSection";
import StreakDisplay from "@/components/gamification/StreakDisplay";
import WeeklyChallenges from "@/components/gamification/WeeklyChallenges";
import AchievementTimeline from "@/components/gamification/AchievementTimeline";
import FloatingPoints, { useFloatingPoints } from "@/components/gamification/FloatingPoints";

export default function StudentGamification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { notifications, showPoints } = useFloatingPoints();
  const [newlyEarned, setNewlyEarned] = useState<string[]>([]);
  const prevLevel = useRef(0);

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

  // Fetch attendance
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

  // Fetch marks
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

  // Fetch streak
  const { data: streakData } = useQuery({
    queryKey: ["gamification-streak", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("study_streaks")
        .select("streak, last_date")
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

  // Fetch leaderboard
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ["gamification-leaderboard"],
    queryFn: async () => {
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

      return students.map(s => {
        const profile = (profilesRes.data || []).find(p => p.user_id === s.user_id);
        const att = (attendanceRes.data || []).filter(a => a.student_id === s.id);
        const marks = (marksRes.data || []).filter(m => m.student_id === s.id);
        const badges = (badgesRes.data || []).filter(b => b.student_id === s.id);

        const presentCount = att.filter(a => a.status === "present").length;
        const attPoints = presentCount * 10;
        const marksPoints = marks.reduce((sum, m) => sum + Math.round((m.obtained_marks / m.max_marks) * 50), 0);
        const badgePoints = badges.length * 100;

        return {
          id: s.id,
          name: profile?.full_name || s.roll_number || "Student",
          avatar: profile?.avatar_url,
          course: (s as any).courses?.code || "",
          totalPoints: attPoints + marksPoints + badgePoints,
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

  const longestStreak = (() => {
    if (!attendanceData) return 0;
    let max = 0, current = 0;
    attendanceData.forEach(a => {
      if (a.status === "present") { current++; max = Math.max(max, current); }
      else current = 0;
    });
    return max;
  })();

  // Perfect week: 7 consecutive present days
  const perfectWeek = (() => {
    if (!attendanceData) return false;
    let consecutive = 0;
    for (const a of attendanceData) {
      if (a.status === "present") {
        consecutive++;
        if (consecutive >= 7) return true;
      } else {
        consecutive = 0;
      }
    }
    return false;
  })();

  const currentRank = leaderboard.findIndex(l => l.isCurrentUser) + 1;
  const level = Math.floor(totalPoints / 500) + 1;
  const levelProgress = ((totalPoints % 500) / 500) * 100;

  // Level up celebration
  useEffect(() => {
    if (prevLevel.current > 0 && level > prevLevel.current) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#C6A75E", "#FFD700", "#FFA500"] });
      showPoints(`🎉 Level ${level}!`);
      toast.success(`Level Up! You reached Level ${level}!`, { duration: 4000 });
    }
    prevLevel.current = level;
  }, [level]);

  // Badge award mutation
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
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["student-badges"] });
      setNewlyEarned(prev => [...prev, vars.type]);
      showPoints(`🏅 ${vars.name}!`);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      toast.success(`Badge Unlocked: ${vars.name}!`, { duration: 3000 });
    },
  });

  // Auto-award badges
  useEffect(() => {
    if (!student?.id || badgesLoading || !attendanceData || !marksData) return;
    const earned = earnedBadges.map(b => b.badge_type);

    const checks: [boolean, string, string, string][] = [
      [attendancePct >= 75, "early_bird", "Early Bird", "Achieved 75%+ attendance"],
      [attendancePct >= 85, "consistent_learner", "Consistent Learner", "Maintained 85%+ attendance overall"],
      [avgMarks >= 80, "high_achiever", "High Achiever", "Scored 80%+ average in marks"],
      [avgMarks >= 90, "top_performer", "Top Performer", "Scored 90%+ average in marks"],
      [longestStreak >= 30, "attendance_hero", "Attendance Hero", "Never missed a class for 30+ records"],
      [streak >= 7, "bookworm", "Bookworm", "Logged study streak 7+ days"],
      [streak >= 14, "streak_master", "Streak Master", "Maintained a 14+ day study streak"],
      [perfectWeek, "perfect_week", "Perfect Week", "100% attendance for 7 consecutive days"],
    ];

    checks.forEach(([condition, type, name, desc]) => {
      if (condition && !earned.includes(type)) {
        awardBadge.mutate({ type, name, desc });
      }
    });
  }, [student?.id, attendanceData, marksData, earnedBadges, badgesLoading]);

  const pointsBreakdownItems = [
    { label: "Attendance", detail: `${presentCount} present × 10 pts`, value: attendancePoints, gradient: "linear-gradient(90deg, hsl(142 70% 45%), hsl(142 70% 35%))", pct: totalPoints > 0 ? (attendancePoints / totalPoints) * 100 : 0 },
    { label: "Marks", detail: "Performance-based scoring", value: marksPoints, gradient: "linear-gradient(90deg, hsl(220 55% 55%), hsl(220 55% 40%))", pct: totalPoints > 0 ? (marksPoints / totalPoints) * 100 : 0 },
    { label: "Study Streak", detail: `${streak} days × 15 pts`, value: streakPoints, gradient: "linear-gradient(90deg, hsl(30 90% 55%), hsl(15 90% 50%))", pct: totalPoints > 0 ? (streakPoints / totalPoints) * 100 : 0 },
    { label: "Badges", detail: `${earnedBadges.length} badges × 100 pts`, value: badgePoints, gradient: "linear-gradient(90deg, hsl(270 60% 55%), hsl(270 60% 45%))", pct: totalPoints > 0 ? (badgePoints / totalPoints) * 100 : 0 },
  ];

  return (
    <div className="space-y-5">
      <FloatingPoints notifications={notifications} />
      <GamificationHeader currentRank={currentRank} totalPoints={totalPoints} />
      <LevelProgress
        level={level}
        levelProgress={levelProgress}
        totalPoints={totalPoints}
        badgeCount={earnedBadges.length}
        currentRank={currentRank}
        streak={streak}
        pointsToNext={totalPoints % 500}
      />
      <DailyCheckIn
        streak={streak}
        lastDate={streakData?.last_date || null}
        onCheckedIn={() => queryClient.invalidateQueries({ queryKey: ["gamification-streak"] })}
      />
      <StreakDisplay streak={streak} attendancePct={attendancePct} avgMarks={avgMarks} longestStreak={longestStreak} />
      <WeeklyChallenges
        attendancePct={attendancePct}
        presentCount={presentCount}
        avgMarks={avgMarks}
        streak={streak}
        totalMarksEntries={marksData?.length || 0}
      />
      <PointsBreakdown items={pointsBreakdownItems} />
      <AchievementTimeline earnedBadges={earnedBadges} totalPoints={totalPoints} />
      <BadgesGrid earnedBadges={earnedBadges} newlyEarned={newlyEarned} />
      <LeaderboardSection leaderboard={leaderboard} loading={leaderboardLoading} />
    </div>
  );
}
