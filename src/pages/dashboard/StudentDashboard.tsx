import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell, Calendar, TrendingUp, CheckCircle, XCircle, Megaphone, ArrowRight, Sparkles, Upload, User, GraduationCap, FileText, Award } from "lucide-react";
import BirthdayPopup from "@/components/BirthdayPopup";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";
import ActionCenter from "@/components/ActionCenter";

const NOTICE_TYPE_COLORS: Record<string, string> = {
  Exam: "bg-red-500/10 text-red-500",
  Holiday: "bg-emerald-500/10 text-emerald-500",
  Event: "bg-purple-500/10 text-purple-500",
  General: "bg-primary/10 text-primary",
  Fee: "bg-amber-500/10 text-amber-500",
};

function useAnimatedCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => { started.current = false; setCount(0); }, [target]);
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

function CircularProgress({ pct, size = 96, stroke = 8, color = "hsl(var(--primary))" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(pct), 120); return () => clearTimeout(t); }, [pct]);
  return (
    <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - animated / 100)} className="transition-all duration-1000 ease-out" />
    </svg>
  );
}

function StatCard({ label, value, suffix = "", icon: Icon, color, delay = 0 }: any) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div ref={ref} className="bg-card border border-border/60 rounded-2xl p-5 hover:border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group" style={{ animationDelay: `${delay}ms` }}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color || "bg-primary/10"}`}>
        <Icon className={`w-5 h-5 ${color ? "text-white" : "text-primary"}`} />
      </div>
      <p className="font-body text-[28px] font-bold text-foreground tabular-nums leading-none group-hover:text-primary transition-colors duration-300">{count}{suffix}</p>
      <p className="font-body text-[11px] text-muted-foreground mt-1.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function StudentDashboard() {
  const { profile, user } = useAuth();

  const { data, isLoading: statsLoading } = useQuery({
    queryKey: ["student-dashboard-stats", user?.id],
    refetchInterval: 30000,
    queryFn: async () => {
      if (!user) return null;
      const { data: student } = await supabase.from("students").select("id, semester, roll_number, course_id, courses(name, code)").eq("user_id", user.id).single();
      if (!student) return null;

      const today = new Date().toISOString().split("T")[0];
      const [attendance, marks, notices, materials, todayAttendance, announcements] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", student.id),
        supabase.from("marks").select("obtained_marks, max_marks, subject, exam_type").eq("student_id", student.id),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("study_materials").select("id", { count: "exact", head: true }),
        supabase.from("attendance").select("status").eq("student_id", student.id).eq("date", today),
        supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const total = attendance.data?.length || 0;
      const present = attendance.data?.filter(a => a.status === "present").length || 0;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;
      const marksData = marks.data || [];
      const avgMarks = marksData.length > 0 ? Math.round(marksData.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marksData.length) : 0;

      const todayRecords = todayAttendance.data || [];
      let todayStatus: "present" | "absent" | "none" = "none";
      if (todayRecords.length > 0) todayStatus = todayRecords.some(r => r.status === "absent") ? "absent" : "present";

      return {
        attendance: pct, avgMarks, notices: notices.count || 0,
        materials: materials.count || 0, announcements: announcements.count || 0,
        present, absent: total - present, total, todayStatus,
        semester: student.semester, rollNumber: student.roll_number,
        courseName: (student as any).courses?.name, courseCode: (student as any).courses?.code,
        totalSubjects: marksData.length,
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
      const { data } = await supabase.from("announcements").select("id, title, content, created_at").eq("is_active", true).order("created_at", { ascending: false }).limit(4);
      return data || [];
    },
    enabled: !!user,
  });

  const attendancePct = data?.attendance ?? 0;
  const attendanceColor = attendancePct >= 75 ? "hsl(145, 65%, 42%)" : attendancePct >= 60 ? "hsl(42, 70%, 52%)" : "hsl(0, 70%, 58%)";
  const attendanceTextColor = attendancePct >= 75 ? "text-emerald-500" : attendancePct >= 60 ? "text-amber-500" : "text-red-500";

  const stats = [
    { label: "Attendance", value: String(attendancePct), suffix: "%", icon: Clock, color: attendancePct >= 75 ? "bg-emerald-500" : "bg-red-500", delay: 0 },
    { label: "Avg Marks", value: String(data?.avgMarks ?? 0), suffix: "%", icon: BarChart3, color: "bg-blue-500", delay: 80 },
    { label: "Notices", value: String(data?.notices ?? 0), icon: Bell, color: "bg-amber-500", delay: 160 },
    { label: "Materials", value: String(data?.materials ?? 0), icon: Upload, color: "bg-purple-500", delay: 240 },
  ];

  const quickActions = [
    { icon: Clock, label: "Attendance", desc: "View records", path: "/dashboard/student/attendance", color: "bg-blue-500/10", iconColor: "text-blue-500" },
    { icon: BarChart3, label: "My Marks", desc: "Exam results", path: "/dashboard/student/marks", color: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { icon: Calendar, label: "Timetable", desc: "Class schedule", path: "/dashboard/student/timetable", color: "bg-purple-500/10", iconColor: "text-purple-500" },
    { icon: BookOpen, label: "Materials", desc: "Study resources", path: "/dashboard/student/materials", color: "bg-amber-500/10", iconColor: "text-amber-500" },
    { icon: Bell, label: "Notices", desc: "Updates", path: "/dashboard/student/notices", color: "bg-cyan-500/10", iconColor: "text-cyan-500" },
    { icon: Megaphone, label: "Announcements", desc: "Messages", path: "/dashboard/student/announcements", color: "bg-rose-500/10", iconColor: "text-rose-500" },
    { icon: User, label: "My Profile", desc: "View details", path: "/dashboard/student/profile", color: "bg-indigo-500/10", iconColor: "text-indigo-500" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <BirthdayPopup />

      {/* Welcome Banner */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-3 py-1 mb-3">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="font-body text-[11px] text-primary font-semibold uppercase tracking-wider">Student Portal</span>
            </div>
            <h2 className="font-body text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Welcome, {profile?.full_name?.split(" ")[0] || "Student"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1.5">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {!statsLoading && data && (
            <div className="flex gap-3">
              <div className="bg-muted/40 rounded-xl px-4 py-2.5 text-center">
                <p className="font-body text-lg font-bold text-foreground">{data.semester || "—"}</p>
                <p className="font-body text-[10px] text-muted-foreground">Semester</p>
              </div>
              <div className="bg-muted/40 rounded-xl px-4 py-2.5 text-center">
                <p className="font-body text-sm font-bold text-foreground">{data.courseCode || "—"}</p>
                <p className="font-body text-[10px] text-muted-foreground">Course</p>
              </div>
              <div className="bg-muted/40 rounded-xl px-4 py-2.5 text-center">
                <p className="font-body text-sm font-bold text-foreground">{data.rollNumber || "—"}</p>
                <p className="font-body text-[10px] text-muted-foreground">Roll No</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Today's Attendance Status */}
      {!statsLoading && data && (
        <div className={`border rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 ${
          data.todayStatus === "present" ? "bg-emerald-500/5 border-emerald-500/20" : data.todayStatus === "absent" ? "bg-red-500/5 border-red-500/20" : "bg-card border-border/60"
        }`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            data.todayStatus === "present" ? "bg-emerald-500/10" : data.todayStatus === "absent" ? "bg-red-500/10" : "bg-muted/60"
          }`}>
            {data.todayStatus === "present" ? <CheckCircle className="w-6 h-6 text-emerald-500" />
            : data.todayStatus === "absent" ? <XCircle className="w-6 h-6 text-red-500" />
            : <Clock className="w-6 h-6 text-muted-foreground" />}
          </div>
          <div>
            <p className={`font-body text-base font-semibold ${data.todayStatus === "present" ? "text-emerald-500" : data.todayStatus === "absent" ? "text-red-500" : "text-muted-foreground"}`}>
              {data.todayStatus === "present" ? "You're Present Today" : data.todayStatus === "absent" ? "You're Marked Absent Today" : "No Attendance Marked Yet"}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {data.todayStatus === "none" ? "Your teacher hasn't marked attendance yet today" : "Today's attendance status"}
            </p>
          </div>
        </div>
      )}

      {/* Action Center */}
      <ActionCenter role="student" />

      {/* Stats Grid */}
      {statsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Attendance + Marks Rings */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-body text-[14px] font-semibold text-foreground">Attendance Overview</h3>
          </div>
          {statsLoading ? (
            <Skeleton className="w-full h-40 rounded-xl" />
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <CircularProgress pct={attendancePct} size={110} stroke={10} color={attendanceColor} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-body text-xl font-bold ${attendanceTextColor} tabular-nums`}>{attendancePct}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-500/5">
                  <span className="font-body text-[12px] text-muted-foreground">Present</span>
                  <span className="font-body text-[13px] font-bold text-emerald-500 tabular-nums">{data?.present ?? 0}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-red-500/5">
                  <span className="font-body text-[12px] text-muted-foreground">Absent</span>
                  <span className="font-body text-[13px] font-bold text-red-500 tabular-nums">{data?.absent ?? 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${attendancePct}%`, background: attendanceColor }} />
                </div>
                <p className={`font-body text-[11px] font-medium ${attendancePct >= 75 ? "text-emerald-500" : "text-red-500"}`}>
                  {attendancePct >= 75 ? "✓ Criteria met" : `Need ${75 - attendancePct}% more`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Average Marks */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-body text-[14px] font-semibold text-foreground">Academic Performance</h3>
          </div>
          {statsLoading ? (
            <Skeleton className="w-full h-40 rounded-xl" />
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <CircularProgress pct={data?.avgMarks ?? 0} size={110} stroke={10} color="hsl(215, 90%, 55%)" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-body text-xl font-bold text-primary tabular-nums">{data?.avgMarks ?? 0}%</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="font-body text-[11px] text-muted-foreground">Average Score</p>
                  <p className="font-body text-2xl font-bold text-primary tabular-nums">{data?.avgMarks ?? 0}%</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/40">
                  <p className="font-body text-[11px] text-muted-foreground">Results Uploaded</p>
                  <p className="font-body text-lg font-bold text-foreground tabular-nums">{data?.totalSubjects ?? 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="font-body text-[14px] font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.path} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>
                <a.icon className={`w-4 h-4 ${a.iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="font-body text-[12px] font-medium text-foreground truncate">{a.label}</p>
                <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Notices + Announcements */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <h3 className="font-body text-[14px] font-semibold text-foreground">Recent Notices</h3>
            </div>
            <Link to="/dashboard/student/notices" className="font-body text-[11px] text-primary flex items-center gap-0.5 hover:gap-1.5 transition-all duration-200">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {noticesLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
          ) : recentNotices.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">No notices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentNotices.map((n: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200 border border-transparent hover:border-border/60">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-body text-[12px] font-medium text-foreground line-clamp-1">{n.title}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-body font-semibold shrink-0 ${NOTICE_TYPE_COLORS[n.type] || NOTICE_TYPE_COLORS.General}`}>{n.type}</span>
                  </div>
                  {n.content && <p className="font-body text-[10px] text-muted-foreground mt-1 line-clamp-1">{n.content}</p>}
                  <p className="font-body text-[9px] text-muted-foreground/60 mt-1">{new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-rose-500" />
              </div>
              <h3 className="font-body text-[14px] font-semibold text-foreground">Announcements</h3>
            </div>
            <Link to="/dashboard/student/announcements" className="font-body text-[11px] text-primary flex items-center gap-0.5 hover:gap-1.5 transition-all duration-200">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {announcementsLoading ? (
            <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
          ) : announcements.length === 0 ? (
            <div className="py-8 text-center">
              <Megaphone className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {announcements.map((a: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-rose-500/5 hover:bg-rose-500/8 transition-colors duration-200 border border-transparent hover:border-rose-500/10">
                  <p className="font-body text-[12px] font-medium text-foreground line-clamp-1">{a.title}</p>
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
