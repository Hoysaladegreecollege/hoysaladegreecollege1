import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, BookOpen, Calendar, FileText, Settings, UserPlus, Award, Mail, TrendingUp, Trophy, Shield, Image, BarChart3, PieChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["hsl(217, 72%, 18%)", "hsl(42, 87%, 55%)", "hsl(217, 50%, 30%)", "hsl(142, 70%, 40%)"];

export default function AdminDashboard() {
  const { profile } = useAuth();

  const { data: counts } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [students, teachers, courses, events, pendingApps, contacts] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("admission_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return {
        students: students.count || 0,
        teachers: teachers.count || 0,
        courses: courses.count || 0,
        events: events.count || 0,
        pendingApps: pendingApps.count || 0,
        newContacts: contacts.count || 0,
      };
    },
  });

  const { data: roleDistribution = [] } = useQuery({
    queryKey: ["admin-role-distribution"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach(r => { counts[r.role] = (counts[r.role] || 0) + 1; });
      return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    },
  });

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? "—"), icon: Users, gradient: "from-primary/8 to-primary/3", iconBg: "bg-primary/10" },
    { label: "Total Teachers", value: String(counts?.teachers ?? "—"), icon: GraduationCap, gradient: "from-secondary/8 to-secondary/3", iconBg: "bg-secondary/10" },
    { label: "Active Courses", value: String(counts?.courses ?? "—"), icon: BookOpen, gradient: "from-primary/8 to-primary/3", iconBg: "bg-primary/10" },
    { label: "Total Events", value: String(counts?.events ?? "—"), icon: Calendar, gradient: "from-secondary/8 to-secondary/3", iconBg: "bg-secondary/10" },
  ];

  const barData = [
    { name: "Students", count: counts?.students || 0 },
    { name: "Teachers", count: counts?.teachers || 0 },
    { name: "Courses", count: counts?.courses || 0 },
    { name: "Events", count: counts?.events || 0 },
  ];

  const quickActions = [
    { icon: FileText, label: "Admission Applications", desc: `${counts?.pendingApps || 0} pending`, path: "/dashboard/admin/applications", badge: counts?.pendingApps },
    { icon: Mail, label: "Contact Messages", desc: `${counts?.newContacts || 0} new`, path: "/dashboard/admin/contacts", badge: counts?.newContacts },
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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 via-card to-secondary/8 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Super Admin Panel ⚙️
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Welcome back, {profile?.full_name || "Admin"}. Full system control and content management.</p>
          {(counts?.pendingApps || counts?.newContacts) ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {counts?.pendingApps ? (
                <Link to="/dashboard/admin/applications" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/15 text-sm font-body font-semibold text-foreground hover:bg-secondary/25 transition-colors">
                  📋 {counts.pendingApps} pending application{counts.pendingApps > 1 ? "s" : ""}
                </Link>
              ) : null}
              {counts?.newContacts ? (
                <Link to="/dashboard/admin/contacts" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-sm font-body font-semibold text-foreground hover:bg-primary/15 transition-colors">
                  ✉️ {counts.newContacts} new message{counts.newContacts > 1 ? "s" : ""}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}>
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${s.iconBg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <s.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Overview
          </h3>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter" }} stroke="hsl(220, 10%, 45%)" />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} stroke="hsl(220, 10%, 45%)" />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(214, 20%, 88%)" }} />
                <Bar dataKey="count" fill="hsl(217, 72%, 18%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-secondary" /> User Roles
          </h3>
          <div className="h-48 sm:h-56 flex items-center justify-center">
            {roleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} style={{ fontSize: 11, fontFamily: "Inter" }}>
                    {roleDistribution.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12 }} />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <p className="font-body text-sm text-muted-foreground">No user data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.path} className="relative flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-primary/5 hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                <a.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm font-semibold text-foreground">{a.label}</p>
                <p className="font-body text-[11px] text-muted-foreground">{a.desc}</p>
              </div>
              {a.badge ? (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">{a.badge}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
