import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell, Calendar, FileText, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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

      return { attendance: `${pct}%`, avgMarks: `${avgMarks}%`, notices: notices.count || 0 };
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

  const quickStats = [
    { label: "Attendance", value: data?.attendance ?? "—", icon: Clock, color: "bg-primary/10 text-primary", gradient: "from-primary/5 to-primary/10" },
    { label: "Avg Marks", value: data?.avgMarks ?? "—", icon: BarChart3, color: "bg-secondary/10 text-secondary", gradient: "from-secondary/5 to-secondary/10" },
    { label: "Active Notices", value: String(data?.notices ?? "—"), icon: Bell, color: "bg-primary/10 text-primary", gradient: "from-primary/5 to-primary/10" },
  ];

  const quickActions = [
    { icon: Clock, label: "View Attendance", path: "/dashboard/student/attendance" },
    { icon: BarChart3, label: "View Marks", path: "/dashboard/student/marks" },
    { icon: Calendar, label: "Timetable", path: "/dashboard/student/timetable" },
    { icon: BookOpen, label: "Study Materials", path: "/dashboard/student/materials" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {profile?.full_name || "Student"} 👋
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-2">Here's your academic overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300`}>
            <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.label} to={a.path} className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
                <a.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-body text-xs font-medium text-foreground text-center">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-secondary" /> Recent Notices
          </h3>
          <div className="space-y-3">
            {recentNotices.length === 0 && <p className="font-body text-sm text-muted-foreground">No notices yet.</p>}
            {recentNotices.map((n: any, i: number) => (
              <div key={i} className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-body text-sm font-medium text-foreground">{n.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body shrink-0">{n.type}</span>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
