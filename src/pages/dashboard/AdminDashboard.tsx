import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, BookOpen, Calendar, FileText, Settings, UserPlus, Award, Megaphone, Mail, TrendingUp, Trophy, Shield, Image } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { profile } = useAuth();

  const { data: counts } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [students, teachers, courses, events, pendingApps] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("admission_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      return {
        students: students.count || 0,
        teachers: teachers.count || 0,
        courses: courses.count || 0,
        events: events.count || 0,
        pendingApps: pendingApps.count || 0,
      };
    },
  });

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, gradient: "from-primary/5 to-primary/10" },
    { label: "Total Teachers", value: String(counts?.teachers ?? "—"), icon: GraduationCap, gradient: "from-secondary/5 to-secondary/10" },
    { label: "Total Courses", value: String(counts?.courses ?? "—"), icon: BookOpen, gradient: "from-primary/5 to-primary/10" },
    { label: "Total Events", value: String(counts?.events ?? "—"), icon: Calendar, gradient: "from-secondary/5 to-secondary/10" },
  ];

  const quickActions = [
    { icon: FileText, label: "Admission Applications", desc: "Review & manage applications", path: "/dashboard/admin/applications" },
    { icon: Mail, label: "Contact Messages", desc: "View contact form submissions", path: "/dashboard/admin/contacts" },
    { icon: Users, label: "Manage Users", desc: "View, edit & delete users", path: "/dashboard/admin/users" },
    { icon: Trophy, label: "Upload Top Rankers", desc: "Add achievers to website", path: "/dashboard/admin/top-rankers" },
    { icon: Calendar, label: "Upload Timetable", desc: "Manage class schedules", path: "/dashboard/admin/timetable" },
    { icon: Image, label: "Upload Events", desc: "Post events & gallery", path: "/dashboard/admin/events" },
    { icon: UserPlus, label: "Create User Account", desc: "Register new users", path: "/login?mode=signup" },
    { icon: Shield, label: "Roles & Permissions", desc: "View role distribution", path: "/dashboard/admin/roles" },
    { icon: Settings, label: "System Settings", desc: "Configure system", path: "/dashboard/admin/settings" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 via-card to-secondary/5 border border-border rounded-2xl p-6 md:p-8">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Super Admin Panel ⚙️
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-2">Full system control and content management</p>
        {counts?.pendingApps ? (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/20 text-sm font-body font-semibold text-foreground animate-fade-in">
            📋 {counts.pendingApps} pending admission application{counts.pendingApps > 1 ? "s" : ""}
          </div>
        ) : null}
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
