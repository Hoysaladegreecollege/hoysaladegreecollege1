import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, Award, Megaphone, Image, BookOpen, Settings, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function PrincipalDashboard() {
  const { profile } = useAuth();

  const { data: counts } = useQuery({
    queryKey: ["principal-stats"],
    queryFn: async () => {
      const [students, teachers, courses, notices] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      return { students: students.count || 0, teachers: teachers.count || 0, courses: courses.count || 0, notices: notices.count || 0 };
    },
  });

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, gradient: "from-primary/5 to-primary/10" },
    { label: "Faculty Members", value: String(counts?.teachers ?? "—"), icon: GraduationCap, gradient: "from-secondary/5 to-secondary/10" },
    { label: "Active Courses", value: String(counts?.courses ?? "—"), icon: BookOpen, gradient: "from-primary/5 to-primary/10" },
    { label: "Active Notices", value: String(counts?.notices ?? "—"), icon: Megaphone, gradient: "from-secondary/5 to-secondary/10" },
  ];

  const actions = [
    { icon: Award, label: "Top Students", desc: "Update homepage top rank students", path: "/dashboard/principal/top-students" },
    { icon: Image, label: "Events & Gallery", desc: "Post new events and upload photos", path: "/dashboard/principal/events" },
    { icon: Megaphone, label: "Notices", desc: "Publish announcements", path: "/dashboard/principal/notices" },
    { icon: BookOpen, label: "Courses & Fees", desc: "Update course fees and details", path: "/dashboard/principal/courses" },
    { icon: GraduationCap, label: "Departments", desc: "Manage departments", path: "/dashboard/principal/departments" },
    { icon: Settings, label: "Teachers", desc: "Add & manage faculty", path: "/dashboard/principal/teachers" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Welcome, {profile?.full_name || "Principal"} 🏛️
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-2">Full administrative control of the college website</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <TrendingUp className="w-4 h-4 text-primary" /> Management
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((a) => (
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
