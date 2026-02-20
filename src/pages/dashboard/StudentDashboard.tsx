import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell, Calendar, TrendingUp, CheckCircle, XCircle, Megaphone, ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["hsl(142, 70%, 40%)", "hsl(0, 84%, 60%)"];

const NOTICE_TYPE_COLORS: Record<string, string> = {
  Exam: "bg-destructive/10 text-destructive",
  Holiday: "bg-emerald-500/10 text-emerald-600",
  Event: "bg-purple-500/10 text-purple-600",
  General: "bg-primary/10 text-primary",
  Fee: "bg-secondary/20 text-secondary-foreground",
};

export default function StudentDashboard() {
  const { profile, user } = useAuth();

  const { data, isLoading: statsLoading } = useQuery({
    queryKey: ["student-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
      if (!student) return null;

      const today = new Date().toISOString().split("T")[0];
      const [attendance, marks, notices, todayAttendance] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", student.id),
        supabase.from("marks").select("obtained_marks, max_marks").eq("student_id", student.id),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
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
        const hasAbsent = todayRecords.some(r => r.status === "absent");
        todayStatus = hasAbsent ? "absent" : "present";
      }

      return { attendance: pct, avgMarks, notices: notices.count || 0, present, absent: total - present, total, todayStatus };
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
      const { data: student } = await supabase.from("students").select("course_id, semester").eq("user_id", user.id).single();
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

  const attendancePie = [
    { name: "Present", value: data?.present || 0 },
    { name: "Absent", value: data?.absent || 0 },
  ];

  const attendancePct = data?.attendance ?? 0;
  const attendanceColor = attendancePct >= 75 ? "text-emerald-600" : attendancePct >= 60 ? "text-secondary-foreground" : "text-destructive";
  const attendanceBg = attendancePct >= 75 ? "from-emerald-500/10 to-emerald-500/3" : attendancePct >= 60 ? "from-secondary/15 to-secondary/3" : "from-destructive/10 to-destructive/3";

  const quickActions = [
    { icon: Clock, label: "Attendance", path: "/dashboard/student/attendance", color: "from-blue-500/10 to-blue-500/3", iconColor: "text-blue-500" },
    { icon: BarChart3, label: "My Marks", path: "/dashboard/student/marks", color: "from-emerald-500/10 to-emerald-500/3", iconColor: "text-emerald-500" },
    { icon: Calendar, label: "Timetable", path: "/dashboard/student/timetable", color: "from-purple-500/10 to-purple-500/3", iconColor: "text-purple-500" },
    { icon: BookOpen, label: "Materials", path: "/dashboard/student/materials", color: "from-secondary/15 to-secondary/3", iconColor: "text-secondary-foreground" },
    { icon: Bell, label: "Notices", path: "/dashboard/student/notices", color: "from-primary/10 to-primary/3", iconColor: "text-primary" },
    { icon: Megaphone, label: "Announcements", path: "/dashboard/student/announcements", color: "from-rose-500/10 to-rose-500/3", iconColor: "text-rose-500" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 via-card to-secondary/8 border border-border rounded-2xl p-5 sm:p-7">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/6 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-primary/4 rounded-full translate-y-1/2 blur-xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="font-body text-xs text-secondary font-semibold uppercase tracking-wider">Student Portal</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Student"} 👋
          </h2>
          <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Today's Attendance Status */}
      {data?.todayStatus && data.todayStatus !== "none" && (
        <div className={`border-2 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 ${
          data.todayStatus === "present" ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"
        }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            data.todayStatus === "present" ? "bg-primary/10" : "bg-destructive/10"
          }`}>
            {data.todayStatus === "present"
              ? <CheckCircle className="w-6 h-6 text-primary" />
              : <XCircle className="w-6 h-6 text-destructive" />}
          </div>
          <div>
            <p className={`font-display text-base font-bold ${data.todayStatus === "present" ? "text-primary" : "text-destructive"}`}>
              {data.todayStatus === "present" ? "You're Present Today ✓" : "You're Marked Absent Today"}
            </p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">Today's attendance status from your teacher</p>
          </div>
        </div>
      )}

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Attendance % */}
        {statsLoading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <Link to="/dashboard/student/attendance">
              <div className={`bg-gradient-to-br ${attendanceBg} border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer h-full`}>
                <div className="w-9 h-9 rounded-xl bg-background/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Clock className={`w-4 h-4 ${attendanceColor}`} />
                </div>
                <p className={`font-display text-3xl font-bold ${attendanceColor}`}>{attendancePct}%</p>
                <p className="font-body text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Attendance</p>
                {data && data.total > 0 && (
                  <p className="font-body text-[9px] text-muted-foreground mt-1">{data.present}/{data.total} classes</p>
                )}
              </div>
            </Link>
            <Link to="/dashboard/student/marks">
              <div className="bg-gradient-to-br from-primary/8 to-primary/3 border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer h-full">
                <div className="w-9 h-9 rounded-xl bg-background/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-primary">{data?.avgMarks ?? 0}%</p>
                <p className="font-body text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Avg Marks</p>
              </div>
            </Link>
            <Link to="/dashboard/student/notices">
              <div className="bg-gradient-to-br from-secondary/15 to-secondary/3 border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer h-full">
                <div className="w-9 h-9 rounded-xl bg-background/60 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Bell className="w-4 h-4 text-secondary-foreground" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{data?.notices ?? 0}</p>
                <p className="font-body text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">Notices</p>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Main Grid: Quick Actions + Attendance Chart */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.path}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br ${a.color} border border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group`}>
                <div className="w-9 h-9 rounded-lg bg-background/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <a.icon className={`w-4 h-4 ${a.iconColor}`} />
                </div>
                <span className="font-body text-[10px] font-semibold text-foreground text-center leading-tight">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Attendance Pie */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-foreground mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Attendance Breakdown
          </h3>
          {statsLoading ? (
            <div className="flex items-center justify-center h-44">
              <Skeleton className="w-36 h-36 rounded-full" />
            </div>
          ) : (data?.present || data?.absent) ? (
            <>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={4} dataKey="value">
                      {attendancePie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 11, border: "1px solid hsl(var(--border))" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-5 mt-1">
                {[{ label: "Present", color: "bg-emerald-500", val: data?.present }, { label: "Absent", color: "bg-destructive", val: data?.absent }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                    <span className="font-body text-xs text-muted-foreground">{l.label}: <b className="text-foreground">{l.val}</b></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-44 text-center">
              <div>
                <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                <p className="font-body text-sm text-muted-foreground">No attendance data yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notices + Announcements Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Recent Notices */}
        <div className="bg-card border border-border rounded-2xl p-5">
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
                <div key={i} className="p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors duration-200 group border border-transparent hover:border-border">
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
        <div className="bg-card border border-border rounded-2xl p-5">
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
                <div key={i} className="p-3 rounded-xl bg-destructive/5 hover:bg-destructive/8 transition-colors duration-200 group border border-transparent hover:border-destructive/10">
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
