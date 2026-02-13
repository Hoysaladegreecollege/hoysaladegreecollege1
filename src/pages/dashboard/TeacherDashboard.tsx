import { useAuth } from "@/contexts/AuthContext";
import { Users, Clock, BarChart3, Upload, Bell } from "lucide-react";
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
      return {
        students: students.count || 0,
        materials: materials.count || 0,
        notices: notices.count || 0,
      };
    },
  });

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Materials", value: String(counts?.materials ?? "—"), icon: Upload, color: "bg-secondary/10 text-secondary" },
    { label: "Notices", value: String(counts?.notices ?? "—"), icon: Bell, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome, {profile?.full_name || "Teacher"} 👋
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Manage your students, attendance, and marks</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Clock, label: "Mark Attendance", path: "/dashboard/teacher/attendance" },
            { icon: BarChart3, label: "Upload Marks", path: "/dashboard/teacher/marks" },
            { icon: Upload, label: "Upload Material", path: "/dashboard/teacher/materials" },
            { icon: Bell, label: "Post Notice", path: "/dashboard/teacher/notices" },
          ].map((a) => (
            <Link key={a.label} to={a.path} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted transition-colors">
              <a.icon className="w-5 h-5 text-primary" />
              <span className="font-body text-xs font-medium text-foreground">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
