import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell, Calendar, TrendingUp, CheckCircle, XCircle, Megaphone, ArrowRight, Sparkles, Upload } from "lucide-react";
import BirthdayPopup from "@/components/BirthdayPopup";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";

const NOTICE_TYPE_COLORS: Record<string, string> = {
  Exam: "bg-destructive/10 text-destructive",
  Holiday: "bg-emerald-500/10 text-emerald-600",
  Event: "bg-purple-500/10 text-purple-600",
  General: "bg-primary/10 text-primary",
  Fee: "bg-secondary/20 text-secondary-foreground",
};

function useAnimatedCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    started.current = false;
    setCount(0);
  }, [target]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current && target > 0) {
        started.current = true;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function AnimatedStatCard({ label, value, suffix = "", icon: Icon, gradient, iconColor = "text-primary", delay = 0 }: any) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} border border-border rounded-2xl p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group card-stack`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none spotlight" />
      <div className="w-10 h-10 rounded-xl bg-card/70 flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className={`font-display text-3xl font-bold tabular-nums ${iconColor}`}>
        {count}{suffix}
      </p>
      <p className="font-body text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

function CircularProgress({ pct, size = 88, stroke = 8, color = "hsl(var(--primary))" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 120);
    return () => clearTimeout(timer);
  }, [pct]);
  return (
    <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - animated / 100)}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

export default function StudentDashboard() {
  const { profile, user } = useAuth();

  const { data, isLoading: statsLoading } = useQuery({
    queryKey: ["student-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: student } = await supabase.from("students").select("id, semester").eq("user_id", user.id).single();
      if (!student) return null;

      const today = new Date().toISOString().split("T")[0];
      const [attendance, marks, notices, materials, todayAttendance] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", student.id),
        supabase.from("marks").select("obtained_marks, max_marks").eq("student_id", student.id),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("study_materials").select("id", { count: "exact", head: true }),
        supabase.from("attendance").select("status").eq("student_id", student.id).eq("date", today),
      ]);

      const total = attendance.data?.length || 0;
      const present = attendance.data?.filter(a => a.status === "present").length || 0;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;

      const marksData = marks.data || [];
      const avgMarks = marksData.length > 0
        ? Math.round(marksData.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marksData.length)
        : 0;

      const todayRecords = todayAttendance.data || [];
      let todayStatus: "present" | "absent" | "none" = "none";
      if (todayRecords.length > 0) {
        todayStatus = todayRecords.some(r => r.status === "absent") ? "absent" : "present";
      }

      return {
        attendance: pct, avgMarks, notices: notices.count || 0,
        materials: materials.count || 0,
        present, absent: total - present, total, todayStatus,
        semester: student.semester,
      };
    },
    enabled: !!user,
  });

  const { data: recentNotices = [], isLoading: noticesLoading } = useQuery({
    queryKey: ["student-recent-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("title, created_at, type, content, is_pinned").eq("is_active", true).order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ["student-dashboard-announcements", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("announcements")
        .select("id, title, content, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      return data || [];
    },
    enabled: !!user,
  });

  const attendancePct = data?.attendance ?? 0;
  const attendanceColor = attendancePct >= 75 ? "text-emerald-600" : attendancePct >= 60 ? "text-secondary-foreground" : "text-destructive";
  const attendanceRingColor = attendancePct >= 75 ? "hsl(142, 70%, 40%)" : attendancePct >= 60 ? "hsl(var(--secondary))" : "hsl(var(--destructive))";
  const attendanceGradient = attendancePct >= 75 ? "from-emerald-500/10 to-emerald-500/3" : attendancePct >= 60 ? "from-secondary/15 to-secondary/3" : "from-destructive/10 to-destructive/3";

  const stats = [
    { label: "Attendance", value: String(attendancePct), suffix: "%", icon: Clock, gradient: attendanceGradient, iconColor: attendanceColor, delay: 0 },
    { label: "Avg Marks", value: String(data?.avgMarks ?? 0), suffix: "%", icon: BarChart3, gradient: "from-primary/8 to-primary/3", iconColor: "text-primary", delay: 80 },
    { label: "Active Notices", value: String(data?.notices ?? 0), icon: Bell, gradient: "from-secondary/12 to-secondary/3", iconColor: "text-secondary-foreground", delay: 160 },
    { label: "Study Materials", value: String(data?.materials ?? 0), icon: Upload, gradient: "from-purple-500/10 to-purple-500/3", iconColor: "text-purple-500", delay: 240 },
  ];

  const quickActions = [
    { icon: Clock, label: "Attendance", desc: "View attendance records", path: "/dashboard/student/attendance", color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/30" },
    { icon: BarChart3, label: "My Marks", desc: "Check exam results", path: "/dashboard/student/marks", color: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/30" },
    { icon: Calendar, label: "Timetable", desc: "View class schedule", path: "/dashboard/student/timetable", color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/30" },
    { icon: BookOpen, label: "Materials", desc: "Download resources", path: "/dashboard/student/materials", color: "from-secondary/10 to-secondary/5 hover:border-secondary/30" },
    { icon: Bell, label: "Notices", desc: "College announcements", path: "/dashboard/student/notices", color: "from-primary/10 to-primary/5 hover:border-primary/30" },
    { icon: Megaphone, label: "Announcements", desc: "Teacher messages", path: "/dashboard/student/announcements", color: "from-rose-500/10 to-rose-500/5 hover:border-rose-500/30" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <BirthdayPopup />
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-36 h-36 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-16 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 blur-xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="font-body text-[11px] text-primary font-semibold uppercase tracking-wider">Student Portal</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Student"} 👋
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-2">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            {data?.semester ? ` · Semester ${data.semester}` : ""}
          </p>
        </div>
      </div>

      {/* Today's Attendance Status */}
      {!statsLoading && data && (
        <div className={`border-2 rounded-2xl p-4 sm:p-5 flex items-center gap-4 animate-fade-in transition-all duration-300 ${
          data.todayStatus === "present" ? "bg-primary/5 border-primary/20" : data.todayStatus === "absent" ? "bg-destructive/5 border-destructive/20" : "bg-muted/30 border-border"
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            data.todayStatus === "present" ? "bg-primary/10" : data.todayStatus === "absent" ? "bg-destructive/10" : "bg-muted"
          }`}>
            {data.todayStatus === "present"
              ? <CheckCircle className="w-6 h-6 text-primary" />
              : data.todayStatus === "absent"
              ? <XCircle className="w-6 h-6 text-destructive" />
              : <Clock className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div>
            <p className={`font-display text-base font-bold ${data.todayStatus === "present" ? "text-primary" : data.todayStatus === "absent" ? "text-destructive" : "text-muted-foreground"}`}>
              {data.todayStatus === "present" ? "You're Present Today ✓" : data.todayStatus === "absent" ? "You're Marked Absent Today" : "No Attendance Marked Today"}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {data.todayStatus === "none" ? "Your teacher hasn't marked attendance yet today" : "Today's attendance status from your teacher"}
            </p>
          </div>
        </div>
      )}

      {/* Animated Stats Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => <AnimatedStatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Chart + Quick Actions */}
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        {/* Attendance Ring */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Attendance Overview
          </h3>
          {statsLoading ? (
            <div className="flex items-center justify-center h-40">
              <Skeleton className="w-36 h-36 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <CircularProgress pct={attendancePct} size={100} stroke={9} color={attendanceRingColor} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-display text-lg font-bold ${attendanceColor}`}>{attendancePct}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-foreground">Overall Attendance</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {data?.present ?? 0} present · {data?.absent ?? 0} absent · {data?.total ?? 0} total
                </p>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${attendancePct}%`, background: attendanceRingColor }}
                  />
                </div>
                <p className={`font-body text-xs font-bold mt-2 ${attendancePct >= 75 ? "text-emerald-600" : "text-destructive"}`}>
                  {attendancePct >= 75 ? "✓ Attendance criteria met" : `⚠ Need ${75 - attendancePct}% more to reach 75%`}
                </p>
              </div>
            </div>
          )}

          {/* Avg Marks bar */}
          {!statsLoading && (
            <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-4">
              <div className="relative shrink-0">
                <CircularProgress pct={data?.avgMarks ?? 0} size={72} stroke={7} color="hsl(var(--primary))" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-primary">{data?.avgMarks ?? 0}%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-foreground">Average Marks</p>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${data?.avgMarks ?? 0}%` }} />
                </div>
                <p className="font-body text-[11px] text-muted-foreground mt-1">Based on all uploaded results</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {quickActions.map((a, i) => (
              <Link
                key={a.label}
                to={a.path}
                className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border border-border bg-gradient-to-br ${a.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-9 h-9 rounded-xl bg-card/80 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <a.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs font-semibold text-foreground truncate">{a.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Notices + Announcements Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Recent Notices */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-secondary-foreground" /> Recent Notices
            </h3>
            <Link to="/dashboard/student/notices" className="font-body text-[10px] text-primary flex items-center gap-0.5 hover:gap-1.5 transition-all duration-200">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {noticesLoading ? (
            <div className="space-y-2.5">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : recentNotices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/20 mb-2" />
              <p className="font-body text-sm text-muted-foreground">No notices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentNotices.map((n: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors duration-200 group border border-transparent hover:border-border animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-body text-xs font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">{n.title}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-body font-bold shrink-0 ${NOTICE_TYPE_COLORS[n.type] || NOTICE_TYPE_COLORS.General}`}>{n.type}</span>
                  </div>
                  {n.content && <p className="font-body text-[10px] text-muted-foreground mt-1 line-clamp-1">{n.content}</p>}
                  <p className="font-body text-[9px] text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-destructive" /> Teacher Announcements
            </h3>
            <Link to="/dashboard/student/announcements" className="font-body text-[10px] text-primary flex items-center gap-0.5 hover:gap-1.5 transition-all duration-200">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {announcementsLoading ? (
            <div className="space-y-2.5">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Megaphone className="w-8 h-8 text-muted-foreground/20 mb-2" />
              <p className="font-body text-sm text-muted-foreground">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {announcements.map((a: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-destructive/5 hover:bg-destructive/8 transition-colors duration-200 group border border-transparent hover:border-destructive/10 animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <p className="font-body text-xs font-semibold text-foreground group-hover:text-destructive transition-colors duration-200 line-clamp-1">{a.title}</p>
                  {a.content && <p className="font-body text-[10px] text-muted-foreground mt-1 line-clamp-2">{a.content}</p>}
                  <p className="font-body text-[9px] text-muted-foreground/60 mt-1">{new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
