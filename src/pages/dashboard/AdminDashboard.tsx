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

const CHART_COLORS = ["hsl(217, 72%, 18%)", "hsl(42, 87%, 55%)", "hsl(217, 50%, 30%)", "hsl(142, 70%, 40%)"];

function useAnimatedCounter(target: number, duration = 1500) {
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

function AnimatedStatCard({ label, value, icon: Icon, gradient, iconBg }: any) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div ref={ref} className={`bg-gradient-to-br ${gradient} border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}>
      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${iconBg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </div>
      <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{count}</p>
      <p className="font-body text-[10px] sm:text-xs text-muted-foreground mt-1">{label}</p>
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
      // semester breakdown
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

  // Fee defaulters query
  const { data: feeDefaulters = [] } = useQuery({
    queryKey: ["admin-fee-defaulters"],
    queryFn: async () => {
      const { data: students } = await supabase
        .from("students")
        .select("id, roll_number, total_fee, fee_paid, fee_due_date, user_id, courses(name, code)")
        .eq("is_active", true)
        .gt("total_fee", 0);
      if (!students) return [];
      const defaulters = students.filter((s: any) => {
        const due = (s.total_fee || 0) - (s.fee_paid || 0);
        return due > 0;
      });
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

  // Export students to CSV
  const exportStudentsCSV = async () => {
    toast.info("Generating CSV...");
    const { data: students } = await supabase
      .from("students")
      .select("roll_number, semester, year_level, admission_year, parent_phone, phone, total_fee, fee_paid, fee_due_date, user_id, courses(name, code)")
      .eq("is_active", true)
      .order("roll_number");
    if (!students || students.length === 0) { toast.error("No students to export"); return; }
    const userIds = students.map(s => s.user_id);
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, phone").in("user_id", userIds);
    const rows = students.map((s: any) => {
      const p = profiles?.find((pr: any) => pr.user_id === s.user_id);
      return [
        s.roll_number, p?.full_name || "", p?.email || "", p?.phone || s.phone || "",
        s.courses?.name || "", s.courses?.code || "", s.semester, s.year_level,
        s.admission_year, s.parent_phone || "", s.total_fee || 0, s.fee_paid || 0,
        (s.total_fee || 0) - (s.fee_paid || 0), s.fee_due_date || ""
      ].join(",");
    });
    const csv = "Roll,Name,Email,Phone,Course,Code,Semester,Year,AdmissionYear,ParentPhone,TotalFee,FeePaid,FeeDue,DueDate\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `students_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success("CSV downloaded!");
  };

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users, gradient: "from-primary/8 to-primary/3", iconBg: "bg-primary/10" },
    { label: "Total Teachers", value: String(counts?.teachers ?? 0), icon: GraduationCap, gradient: "from-secondary/8 to-secondary/3", iconBg: "bg-secondary/10" },
    { label: "Active Courses", value: String(counts?.courses ?? 0), icon: BookOpen, gradient: "from-primary/8 to-primary/3", iconBg: "bg-primary/10" },
    { label: "Total Events", value: String(counts?.events ?? 0), icon: Calendar, gradient: "from-secondary/8 to-secondary/3", iconBg: "bg-secondary/10" },
  ];

  const quickActions = [
    { icon: Megaphone, label: "Post Notice", desc: "Publish announcements instantly", path: "/dashboard/admin/post-notice", highlight: true },
    { icon: ArrowUpCircle, label: "Semester Promotion", desc: "Promote students in bulk", path: "/dashboard/admin/semester-promotion", highlight: true },
    { icon: CalendarDays, label: "Academic Years", desc: "Manage academic sessions", path: "/dashboard/admin/academic-years", highlight: true },
    { icon: UserX, label: "Absent Report", desc: "View absent students", path: "/dashboard/admin/absent-report", highlight: true },
    { icon: Download, label: "Export Student Data", desc: "Download CSV report", path: "/dashboard/admin/settings", highlight: false },
    { icon: FileText, label: "Admission Applications", desc: `${counts?.pendingApps || 0} pending`, path: "/dashboard/admin/applications", badge: counts?.pendingApps },
    { icon: Mail, label: "Contact Messages", desc: `${counts?.newContacts || 0} new`, path: "/dashboard/admin/contacts", badge: counts?.newContacts },
    { icon: Users, label: "Manage Users", desc: "View, edit & delete users", path: "/dashboard/admin/users" },
    { icon: UserPlus, label: "Add Staff", desc: "Create teacher/admin/principal", path: "/dashboard/admin/add-staff", highlight: true },
    { icon: Calendar, label: "Upload Timetable", desc: "Manage class schedules", path: "/dashboard/admin/timetable" },
    { icon: Image, label: "Upload Events", desc: "Post events & gallery", path: "/dashboard/admin/events" },
    { icon: Shield, label: "Roles & Permissions", desc: "View role distribution", path: "/dashboard/admin/roles" },
    { icon: Settings, label: "System Settings", desc: "Analytics & health", path: "/dashboard/admin/settings" },
  ];

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
            <Shield className="w-3 h-3 text-primary" />
            <span className="font-body text-[11px] text-primary font-semibold uppercase tracking-wider">Super Admin</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Super Admin Panel ⚙️</h2>
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

      {/* Action Center */}
      <ActionCenter role="admin" />

      {/* Command Center */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link to="/dashboard/admin/applications" className="premium-card p-4 sm:p-5 group">
          <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">Pending Applications</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-3xl font-bold text-foreground">{counts?.pendingApps || 0}</p>
            <FileText className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </div>
        </Link>
        <Link to="/dashboard/admin/contacts" className="premium-card p-4 sm:p-5 group">
          <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">New Messages</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-3xl font-bold text-foreground">{counts?.newContacts || 0}</p>
            <Mail className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
          </div>
        </Link>
        <div className="premium-card p-4 sm:p-5">
          <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">Attendance Health</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-display text-3xl font-bold text-foreground">{attendanceStats?.percentage || 0}%</p>
            <Activity className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {countsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => <AnimatedStatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Charts Row - Course-based bar chart */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Students by Course
          </h3>
          <div className="h-48 sm:h-56">
            {courseDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseDistribution} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter" }} stroke="hsl(220, 10%, 45%)" />
                  <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} stroke="hsl(220, 10%, 45%)" />
                  <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(214, 20%, 88%)" }} />
                  <Bar dataKey="count" fill="hsl(217, 72%, 18%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <Skeleton className="w-full h-full rounded-xl" />}
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
                    {roleDistribution.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12 }} />
                </RePieChart>
              </ResponsiveContainer>
            ) : <Skeleton className="w-48 h-48 rounded-full" />}
          </div>
        </div>
      </div>

      {/* Attendance + Semester Breakdown */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Attendance Overview */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Attendance Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-xl bg-primary/5">
              <p className="font-display text-2xl font-bold text-foreground">{attendanceStats?.total || 0}</p>
              <p className="font-body text-xs text-muted-foreground">Total Records</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary/5">
              <p className="font-display text-2xl font-bold text-primary">{attendanceStats?.present || 0}</p>
              <p className="font-body text-xs text-muted-foreground">Present</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-secondary/10">
              <p className="font-display text-2xl font-bold text-secondary">{attendanceStats?.percentage || 0}%</p>
              <p className="font-body text-xs text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </div>

        {/* Semester-wise Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-secondary" /> Students by Semester
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[1,2,3,4,5,6].map(sem => (
              <div key={sem} className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/8 to-primary/3 border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <p className="font-display text-xl font-bold text-primary group-hover:scale-110 transition-transform">{counts?.semesterBreakdown?.[sem] || 0}</p>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Sem {sem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Defaulters Alert + Export */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Fee Defaulters */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Fee Defaulters
            {feeDefaulters.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-body">{feeDefaulters.length}</span>}
          </h3>
          {feeDefaulters.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-6">No fee defaulters found 🎉</p>
          ) : (
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {feeDefaulters.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-destructive/5 border border-destructive/10 hover:shadow-sm transition-all">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{s.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.roll_number} • {s.courses?.code || "—"}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-display text-sm font-bold text-destructive">₹{s.due.toLocaleString()}</p>
                    <p className="font-body text-[10px] text-muted-foreground">due</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Export */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> Data Export
          </h3>
          <p className="font-body text-xs text-muted-foreground mb-4">Export student data with fee details, contact info, and course assignments as CSV.</p>
          <Button onClick={exportStudentsCSV} className="w-full rounded-xl font-body">
            <Download className="w-4 h-4 mr-2" /> Export All Students to CSV
          </Button>
          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
            <p className="font-body text-xs text-muted-foreground">
              <IndianRupee className="w-3 h-3 inline mr-1" />
              CSV includes: Roll, Name, Email, Phone, Course, Semester, Fee details, Parent contact
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a: any, i: number) => (
            <Link key={a.label} to={a.path}
              className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 group border-glow hover:shadow-lg hover:-translate-y-1 ${
                a.highlight
                  ? "border-secondary/40 bg-gradient-to-br from-secondary/8 to-primary/5 hover:border-secondary/60 hover:from-secondary/15"
                  : "border-border hover:bg-primary/5 hover:border-primary/20"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 ${
                a.highlight ? "bg-secondary/20 group-hover:bg-secondary/30" : "bg-primary/10 group-hover:bg-primary/20"
              }`}>
                <a.icon className={`w-5 h-5 ${a.highlight ? "text-secondary-foreground" : "text-primary"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm font-semibold text-foreground">{a.label}</p>
                <p className="font-body text-[11px] text-muted-foreground">{a.desc}</p>
              </div>
              {a.badge ? (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">{a.badge}</span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
