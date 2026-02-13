import { useAuth } from "@/contexts/AuthContext";
import { Users, Clock, BarChart3, Upload, Bell, Megaphone, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
  const { profile } = useAuth();

  const { data: counts } = useQuery({
    queryKey: ["teacher-stats"],
    queryFn: async () => {
      const [students, materials, notices] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("study_materials").select("id", { count: "exact", head: true }),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      return { students: students.count || 0, materials: materials.count || 0, notices: notices.count || 0 };
    },
  });

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, gradient: "from-primary/5 to-primary/10" },
    { label: "Materials Uploaded", value: String(counts?.materials ?? "—"), icon: Upload, gradient: "from-secondary/5 to-secondary/10" },
    { label: "Active Notices", value: String(counts?.notices ?? "—"), icon: Bell, gradient: "from-primary/5 to-primary/10" },
  ];

  const quickActions = [
    { icon: Clock, label: "Mark Attendance", desc: "Record daily attendance", path: "/dashboard/teacher/attendance" },
    { icon: BarChart3, label: "Upload Marks", desc: "Enter student marks", path: "/dashboard/teacher/marks" },
    { icon: Upload, label: "Upload Material", desc: "Share study resources", path: "/dashboard/teacher/materials" },
    { icon: Megaphone, label: "Post Notice", desc: "Publish announcements", path: "/dashboard/teacher/notices" },
    { icon: Users, label: "View Students", desc: "Browse student list", path: "/dashboard/teacher/students" },
    { icon: Calendar, label: "Timetable", desc: "Manage schedules", path: "/dashboard/teacher/timetable" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Welcome, {profile?.full_name || "Teacher"} 📚
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-2">Manage your students, attendance, and course materials</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300`}>
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.path} className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <a.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{a.label}</p>
                <p className="font-body text-xs text-muted-foreground">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
