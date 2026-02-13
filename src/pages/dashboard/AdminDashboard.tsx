import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, BookOpen, Calendar, FileText, Settings, UserPlus, Award, Megaphone, Mail } from "lucide-react";
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
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Total Teachers", value: String(counts?.teachers ?? "—"), icon: GraduationCap, color: "bg-secondary/10 text-secondary" },
    { label: "Total Courses", value: String(counts?.courses ?? "—"), icon: BookOpen, color: "bg-primary/10 text-primary" },
    { label: "Total Events", value: String(counts?.events ?? "—"), icon: Calendar, color: "bg-secondary/10 text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Super Admin Panel ⚙️</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Full system control and content management</p>
        {counts?.pendingApps ? (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/20 text-sm font-body font-medium text-foreground">
            📋 {counts.pendingApps} pending admission application(s)
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: FileText, label: "Admission Applications", path: "/dashboard/admin/applications" },
            { icon: Mail, label: "Contact Messages", path: "/dashboard/admin/contacts" },
            { icon: Users, label: "Manage Users", path: "/dashboard/admin/users" },
            { icon: Award, label: "Upload Top Rankers", path: "/dashboard/admin/top-rankers" },
            { icon: Calendar, label: "Upload Timetable", path: "/dashboard/admin/timetable" },
            { icon: Megaphone, label: "Upload Events", path: "/dashboard/admin/events" },
            { icon: UserPlus, label: "Create User Account", path: "/login?mode=signup" },
            { icon: Settings, label: "System Settings", path: "/dashboard/admin/settings" },
          ].map((a) => (
            <Link key={a.label} to={a.path} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
              <a.icon className="w-4 h-4 text-primary shrink-0" />
              <span className="font-body text-sm text-foreground">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
