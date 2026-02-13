import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell, Calendar, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["hsl(142, 70%, 40%)", "hsl(0, 84%, 60%)"];

export default function StudentDashboard() {
  const { profile, user } = useAuth();

  const { data } = useQuery({
    queryKey: ["student-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
      if (!student) return null;

      const [attendance, marks, notices] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", student.id),
        supabase.from("marks").select("obtained_marks, max_marks").eq("student_id", student.id),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const total = attendance.data?.length || 0;
      const present = attendance.data?.filter(a => a.status === "present").length || 0;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;

      const marksData = marks.data || [];
      const avgMarks = marksData.length > 0
        ? Math.round(marksData.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marksData.length)
        : 0;

      return { attendance: `${pct}%`, avgMarks: `${avgMarks}%`, notices: notices.count || 0, present, absent: total - present };
    },
    enabled: !!user,
  });

  const { data: recentNotices = [] } = useQuery({
    queryKey: ["student-recent-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("title, created_at, type").eq("is_active", true).order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const attendancePie = [
    { name: "Present", value: data?.present || 0 },
    { name: "Absent", value: data?.absent || 0 },
  ];

  const quickStats = [
    { label: "Attendance", value: data?.attendance ?? "—", icon: Clock, gradient: "from-primary/8 to-primary/3" },
    { label: "Avg Marks", value: data?.avgMarks ?? "—", icon: BarChart3, gradient: "from-secondary/8 to-secondary/3" },
    { label: "Notices", value: String(data?.notices ?? "—"), icon: Bell, gradient: "from-primary/8 to-primary/3" },
  ];

  const quickActions = [
    { icon: Clock, label: "Attendance", path: "/dashboard/student/attendance" },
    { icon: BarChart3, label: "Marks", path: "/dashboard/student/marks" },
    { icon: Calendar, label: "Timetable", path: "/dashboard/student/timetable" },
    { icon: BookOpen, label: "Materials", path: "/dashboard/student/materials" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 via-card to-secondary/8 border border-border rounded-2xl p-5 sm:p-6 md:p-8">
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground relative">
          Welcome, {profile?.full_name || "Student"} 👋
        </h2>
        <p className="font-body text-xs sm:text-sm text-muted-foreground mt-2 relative">Here's your academic overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
              <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.path} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <a.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                <span className="font-body text-xs font-medium text-foreground text-center">{a.label}</span>
              </Link>
            ))}
          </div>
          {/* Attendance Chart */}
          {(data?.present || data?.absent) ? (
            <div className="mt-5 pt-4 border-t border-border">
              <p className="font-body text-xs font-semibold text-muted-foreground mb-2">Attendance Breakdown</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} style={{ fontSize: 10, fontFamily: "Inter" }}>
                      {attendancePie.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-secondary" /> Recent Notices
          </h3>
          <div className="space-y-2.5">
            {recentNotices.length === 0 && <p className="font-body text-sm text-muted-foreground">No notices yet.</p>}
            {recentNotices.map((n: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-body text-xs sm:text-sm font-medium text-foreground">{n.title}</p>
                  <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body shrink-0">{n.type}</span>
                </div>
                <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
