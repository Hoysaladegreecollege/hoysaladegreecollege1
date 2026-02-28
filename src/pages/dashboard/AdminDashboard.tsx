import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, BookOpen, Calendar, FileText, Settings, Mail, TrendingUp, Trophy, Shield, Image, BarChart3, PieChart, Megaphone, ArrowUpCircle, Download, UserX, CalendarDays, AlertTriangle, IndianRupee, UserPlus, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ActionCenter from "@/components/ActionCenter";

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(217, 50%, 40%)", "hsl(142, 50%, 40%)"];

function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const step = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div ref={ref} className="bg-card border border-border/60 rounded-2xl p-5 hover:border-border transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center">
          <Icon className="w-[18px] h-[18px] text-muted-foreground" />
        </div>
      </div>
      <p className="font-body text-[28px] font-semibold text-foreground tracking-tight tabular-nums leading-none">{count}</p>
      <p className="font-body text-[12px] text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { profile } = useAuth();

  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ["admin-stats"],
    refetchInterval: 30000,
    queryFn: async () => {
      const [students, teachers, courses, events, pendingApps, contacts] = await Promise.all([
        supabase.from("students").select("id, semester", { count: "exact" }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("admission_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      const semCounts: Record<number, number> = {};
      (students.data || []).forEach((s: any) => { semCounts[s.semester] = (semCounts[s.semester] || 0) + 1; });
      return { students: students.count || 0, teachers: teachers.count || 0, courses: courses.count || 0, events: events.count || 0, pendingApps: pendingApps.count || 0, newContacts: contacts.count || 0, semesterBreakdown: semCounts };
    },
  });

  const { data: courseDistribution = [] } = useQuery({
    queryKey: ["admin-course-distribution"],
    queryFn: async () => {
      const { data: students } = await supabase.from("students").select("course_id, courses(name, code)").eq("is_active", true);
      if (!students) return [];
      const counts: Record<string, { name: string; count: number }> = {};
      students.forEach((s: any) => {
        const name = s.courses?.code || "Unassigned";
        if (!counts[name]) counts[name] = { name, count: 0 };
        counts[name].count++;
      });
      return Object.values(counts);
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

  const { data: attendanceStats } = useQuery({
    queryKey: ["admin-attendance-stats"],
    queryFn: async () => {
      const { data } = await supabase.from("attendance").select("status");
      if (!data) return { total: 0, present: 0, percentage: 0 };
      const total = data.length;
      const present = data.filter(a => a.status === "present").length;
      return { total, present, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
    },
  });

  const { data: feeDefaulters = [] } = useQuery({
    queryKey: ["admin-fee-defaulters"],
    queryFn: async () => {
      const { data: students } = await supabase.from("students").select("id, roll_number, total_fee, fee_paid, fee_due_date, user_id, courses(name, code)").eq("is_active", true).gt("total_fee", 0);
      if (!students) return [];
      const defaulters = students.filter((s: any) => ((s.total_fee || 0) - (s.fee_paid || 0)) > 0);
      if (defaulters.length === 0) return [];
      const userIds = defaulters.map((s: any) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      return defaulters.map((s: any) => ({
        ...s,
        name: profiles?.find((p: any) => p.user_id === s.user_id)?.full_name || s.roll_number,
        due: (s.total_fee || 0) - (s.fee_paid || 0),
      })).sort((a: any, b: any) => b.due - a.due).slice(0, 10);
    },
  });

  const exportStudentsCSV = async () => {
    toast.info("Generating CSV...");
    const { data: students } = await supabase.from("students").select("roll_number, semester, year_level, admission_year, parent_phone, phone, total_fee, fee_paid, fee_due_date, user_id, courses(name, code)").eq("is_active", true).order("roll_number");
    if (!students || students.length === 0) { toast.error("No students to export"); return; }
    const userIds = students.map(s => s.user_id);
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, phone").in("user_id", userIds);
    const rows = students.map((s: any) => {
      const p = profiles?.find((pr: any) => pr.user_id === s.user_id);
      return [s.roll_number, p?.full_name || "", p?.email || "", p?.phone || s.phone || "", s.courses?.name || "", s.courses?.code || "", s.semester, s.year_level, s.admission_year, s.parent_phone || "", s.total_fee || 0, s.fee_paid || 0, (s.total_fee || 0) - (s.fee_paid || 0), s.fee_due_date || ""].join(",");
    });
    const csv = "Roll,Name,Email,Phone,Course,Code,Semester,Year,AdmissionYear,ParentPhone,TotalFee,FeePaid,FeeDue,DueDate\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `students_export_${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users },
    { label: "Total Teachers", value: String(counts?.teachers ?? 0), icon: GraduationCap },
    { label: "Active Courses", value: String(counts?.courses ?? 0), icon: BookOpen },
    { label: "Total Events", value: String(counts?.events ?? 0), icon: Calendar },
  ];

  const quickActions = [
    { icon: BookOpen, label: "Courses", desc: "Add & edit courses", path: "/dashboard/admin/courses" },
    { icon: Megaphone, label: "Post Notice", desc: "Publish announcements", path: "/dashboard/admin/post-notice" },
    { icon: ArrowUpCircle, label: "Semester Promotion", desc: "Promote students", path: "/dashboard/admin/semester-promotion" },
    { icon: CalendarDays, label: "Academic Years", desc: "Manage sessions", path: "/dashboard/admin/academic-years" },
    { icon: UserX, label: "Absent Report", desc: "View absent students", path: "/dashboard/admin/absent-report" },
    { icon: FileText, label: "Applications", desc: `${counts?.pendingApps || 0} pending`, path: "/dashboard/admin/applications", badge: counts?.pendingApps },
    { icon: Mail, label: "Messages", desc: `${counts?.newContacts || 0} new`, path: "/dashboard/admin/contacts", badge: counts?.newContacts },
    { icon: Users, label: "Manage Users", desc: "View & edit users", path: "/dashboard/admin/users" },
    { icon: UserPlus, label: "Add Staff", desc: "Create accounts", path: "/dashboard/admin/add-staff" },
    { icon: Calendar, label: "Timetable", desc: "Class schedules", path: "/dashboard/admin/timetable" },
    { icon: Image, label: "Events", desc: "Post events", path: "/dashboard/admin/events" },
    { icon: Shield, label: "Roles", desc: "Role distribution", path: "/dashboard/admin/roles" },
    { icon: Settings, label: "Settings", desc: "System health", path: "/dashboard/admin/settings" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-body text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Admin"}
        </h2>
        <p className="font-body text-[13px] text-muted-foreground mt-1">Here's an overview of your institution.</p>
      </div>

      {/* Action Center */}
      <ActionCenter role="admin" />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link to="/dashboard/admin/applications" className="bg-card border border-border/60 rounded-2xl p-4 hover:border-border transition-colors duration-200 group">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Pending Apps</p>
          <p className="font-body text-2xl font-semibold text-foreground mt-1 tabular-nums">{counts?.pendingApps || 0}</p>
        </Link>
        <Link to="/dashboard/admin/contacts" className="bg-card border border-border/60 rounded-2xl p-4 hover:border-border transition-colors duration-200 group">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">New Messages</p>
          <p className="font-body text-2xl font-semibold text-foreground mt-1 tabular-nums">{counts?.newContacts || 0}</p>
        </Link>
        <div className="bg-card border border-border/60 rounded-2xl p-4">
          <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Attendance</p>
          <p className="font-body text-2xl font-semibold text-foreground mt-1 tabular-nums">{attendanceStats?.percentage || 0}%</p>
        </div>
      </div>

      {/* Stats Grid */}
      {countsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-5">Students by Course</h3>
          <div className="h-48">
            {courseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseDistribution} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} cursor={{ fill: "hsl(var(--muted) / 0.5)" }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <Skeleton className="w-full h-full rounded-xl" />}
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-5">User Roles</h3>
          <div className="h-48 flex items-center justify-center">
            {roleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={roleDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`} style={{ fontSize: 11, fontFamily: "Inter" }}>
                    {roleDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                </RePieChart>
              </ResponsiveContainer>
            ) : <Skeleton className="w-40 h-40 rounded-full" />}
          </div>
        </div>
      </div>

      {/* Attendance + Semester */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Attendance Overview</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-muted/40">
              <p className="font-body text-xl font-semibold text-foreground tabular-nums">{attendanceStats?.total || 0}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Total</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/40">
              <p className="font-body text-xl font-semibold text-primary tabular-nums">{attendanceStats?.present || 0}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Present</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/40">
              <p className="font-body text-xl font-semibold text-foreground tabular-nums">{attendanceStats?.percentage || 0}%</p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Students by Semester</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[1,2,3,4,5,6].map(sem => (
              <div key={sem} className="text-center p-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors duration-200">
                <p className="font-body text-lg font-semibold text-foreground tabular-nums">{counts?.semesterBreakdown?.[sem] || 0}</p>
                <p className="font-body text-[10px] text-muted-foreground mt-0.5">Sem {sem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Defaulters + Export */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-4 flex items-center gap-2">
            Fee Defaulters
            {feeDefaulters.length > 0 && <span className="font-body text-[11px] px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive">{feeDefaulters.length}</span>}
          </h3>
          {feeDefaulters.length === 0 ? (
            <p className="font-body text-[13px] text-muted-foreground text-center py-8">No fee defaulters found</p>
          ) : (
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
              {feeDefaulters.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <div className="min-w-0">
                    <p className="font-body text-[13px] font-medium text-foreground truncate">{s.name}</p>
                    <p className="font-body text-[11px] text-muted-foreground">{s.roll_number} · {s.courses?.code || "—"}</p>
                  </div>
                  <p className="font-body text-[13px] font-semibold text-destructive shrink-0 ml-3 tabular-nums">₹{s.due.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Data Export</h3>
          <p className="font-body text-[12px] text-muted-foreground mb-5">Export student data with fee details, contact info, and course assignments.</p>
          <Button onClick={exportStudentsCSV} className="w-full rounded-xl font-body text-[13px] h-10">
            <Download className="w-4 h-4 mr-2" /> Export Students CSV
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {quickActions.map((a: any) => (
            <Link
              key={a.label}
              to={a.path}
              className="relative flex items-center gap-2.5 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
                <a.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
              </div>
              <div className="min-w-0">
                <p className="font-body text-[12px] font-medium text-foreground truncate">{a.label}</p>
                <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
              </div>
              {a.badge ? (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">{a.badge}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
