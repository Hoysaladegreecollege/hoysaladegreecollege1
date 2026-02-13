import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, Award, Megaphone, Image, BookOpen, Settings, TrendingUp, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

  const chartData = [
    { name: "Students", count: counts?.students || 0 },
    { name: "Faculty", count: counts?.teachers || 0 },
    { name: "Courses", count: counts?.courses || 0 },
    { name: "Notices", count: counts?.notices || 0 },
  ];

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, gradient: "from-primary/8 to-primary/3" },
    { label: "Faculty", value: String(counts?.teachers ?? "—"), icon: GraduationCap, gradient: "from-secondary/8 to-secondary/3" },
    { label: "Courses", value: String(counts?.courses ?? "—"), icon: BookOpen, gradient: "from-primary/8 to-primary/3" },
    { label: "Notices", value: String(counts?.notices ?? "—"), icon: Megaphone, gradient: "from-secondary/8 to-secondary/3" },
  ];

  const actions = [
    { icon: Award, label: "Top Students", desc: "Update top rank students", path: "/dashboard/principal/top-students" },
    { icon: Image, label: "Events & Gallery", desc: "Post events & photos", path: "/dashboard/principal/events" },
    { icon: Megaphone, label: "Notices", desc: "Publish announcements", path: "/dashboard/principal/notices" },
    { icon: BookOpen, label: "Courses & Fees", desc: "Update course details", path: "/dashboard/principal/courses" },
    { icon: GraduationCap, label: "Departments", desc: "Manage departments", path: "/dashboard/principal/departments" },
    { icon: Settings, label: "Teachers", desc: "Add & manage faculty", path: "/dashboard/principal/teachers" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 via-card to-secondary/8 border border-border rounded-2xl p-5 sm:p-6 md:p-8">
        <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground relative">
          Welcome, {profile?.full_name || "Principal"} 🏛️
        </h2>
        <p className="font-body text-xs sm:text-sm text-muted-foreground mt-2 relative">Full administrative control of the college</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
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
            <BarChart3 className="w-4 h-4 text-primary" /> College Overview
          </h3>
          <div className="h-44 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter" }} stroke="hsl(220, 10%, 45%)" />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} stroke="hsl(220, 10%, 45%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(217, 72%, 18%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {actions.map((a) => (
              <Link key={a.label} to={a.path} className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <a.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs sm:text-sm font-semibold text-foreground truncate">{a.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
