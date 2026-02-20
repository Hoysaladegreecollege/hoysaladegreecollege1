import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, BookOpen, Calendar, FileText, Settings, UserPlus, Award, Mail, TrendingUp, Trophy, Shield, Image, BarChart3, PieChart, Megaphone, ArrowUpCircle, DollarSign, Download } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();

  // Semester promotion state
  const [promoCourse, setPromoCourse] = useState("all");
  const [promoSem, setPromoSem] = useState(1);

  // Notice upload state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeType, setNoticeType] = useState("General");

  const { data: counts, isLoading: countsLoading } = useQuery({
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
      return { students: students.count || 0, teachers: teachers.count || 0, courses: courses.count || 0, events: events.count || 0, pendingApps: pendingApps.count || 0, newContacts: contacts.count || 0 };
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

  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-for-promo"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
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

  // Promote mutation
  const promoteMutation = useMutation({
    mutationFn: async () => {
      let query = supabase.from("students").select("id, semester").eq("is_active", true);
      if (promoCourse !== "all") query = query.eq("course_id", promoCourse);
      query = query.eq("semester", promoSem);
      const { data: studentsToPromote } = await query;
      if (!studentsToPromote || studentsToPromote.length === 0) throw new Error("No students found for selected course/semester");
      const ids = studentsToPromote.map(s => s.id);
      const { error } = await supabase.from("students").update({ semester: promoSem + 1 }).in("id", ids);
      if (error) throw error;
      return studentsToPromote.length;
    },
    onSuccess: (count) => {
      toast.success(`${count} students promoted to Semester ${promoSem + 1}!`);
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Post notice mutation
  const noticeMutation = useMutation({
    mutationFn: async () => {
      if (!noticeTitle) throw new Error("Title is required");
      const { error } = await supabase.from("notices").insert({ title: noticeTitle, content: noticeContent, type: noticeType, posted_by: user?.id, is_active: true });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Notice posted! It will appear on the website.");
      setNoticeTitle(""); setNoticeContent(""); setNoticeType("General");
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Export students to CSV
  const exportStudents = async (format: "csv" | "json") => {
    const { data } = await supabase.from("students").select("roll_number, semester, admission_year, total_fee, fee_paid, courses(name, code)").eq("is_active", true);
    if (!data) return;
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, phone");
    const { data: allStudents } = await supabase.from("students").select("id, user_id, roll_number, semester, admission_year, total_fee, fee_paid, fee_due_date, courses(name, code)").eq("is_active", true);

    const rows = (allStudents || []).map((s: any) => {
      const p = profiles?.find((pr: any) => pr.user_id === s.user_id);
      return { "Roll Number": s.roll_number, "Name": p?.full_name || "", "Email": p?.email || "", "Phone": p?.phone || "", "Course": s.courses?.name || "", "Semester": s.semester, "Admission Year": s.admission_year, "Total Fee": s.total_fee, "Fee Paid": s.fee_paid, "Fee Remaining": (s.total_fee || 0) - (s.fee_paid || 0), "Fee Due Date": s.fee_due_date || "" };
    });

    if (format === "csv") {
      const headers = Object.keys(rows[0] || {});
      const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${(r as any)[h] ?? ""}"`).join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "students_export.csv"; a.click();
    } else {
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "students_export.json"; a.click();
    }
    toast.success(`Exported ${rows.length} students as ${format.toUpperCase()}`);
  };

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users, gradient: "from-primary/8 to-primary/3", iconBg: "bg-primary/10" },
    { label: "Total Teachers", value: String(counts?.teachers ?? 0), icon: GraduationCap, gradient: "from-secondary/8 to-secondary/3", iconBg: "bg-secondary/10" },
    { label: "Active Courses", value: String(counts?.courses ?? 0), icon: BookOpen, gradient: "from-primary/8 to-primary/3", iconBg: "bg-primary/10" },
    { label: "Total Events", value: String(counts?.events ?? 0), icon: Calendar, gradient: "from-secondary/8 to-secondary/3", iconBg: "bg-secondary/10" },
  ];

  const quickActions = [
    { icon: Megaphone, label: "Post Notice / Announcement", desc: "Publish instantly to students", path: "#notice", isAnchor: true, highlight: true },
    { icon: ArrowUpCircle, label: "Semester Promotion", desc: "Promote students in bulk", path: "#promotion", isAnchor: true, highlight: true },
    { icon: Download, label: "Export Student Data", desc: "Download CSV report", path: "#export", isAnchor: true, highlight: true },
    { icon: FileText, label: "Admission Applications", desc: `${counts?.pendingApps || 0} pending`, path: "/dashboard/admin/applications", badge: counts?.pendingApps },
    { icon: Mail, label: "Contact Messages", desc: `${counts?.newContacts || 0} new`, path: "/dashboard/admin/contacts", badge: counts?.newContacts },
    { icon: Users, label: "Manage Users", desc: "View, edit & delete users", path: "/dashboard/admin/users" },
    { icon: Trophy, label: "Upload Top Rankers", desc: "Add achievers to website", path: "/dashboard/admin/top-rankers" },
    { icon: Calendar, label: "Upload Timetable", desc: "Manage class schedules", path: "/dashboard/admin/timetable" },
    { icon: Image, label: "Upload Events", desc: "Post events & gallery", path: "/dashboard/admin/events" },
    { icon: Shield, label: "Roles & Permissions", desc: "View role distribution", path: "/dashboard/admin/roles" },
    { icon: Settings, label: "System Settings", desc: "Analytics & health", path: "/dashboard/admin/settings" },
  ];

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 via-card to-secondary/8 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
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

      {/* Semester Promotion */}
      <div id="promotion" className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <ArrowUpCircle className="w-4 h-4 text-primary" /> Semester Promotion
        </h3>
        <p className="font-body text-xs text-muted-foreground mb-4">Promote all students of a specific course and semester to the next semester in one click.</p>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course</label>
            <select value={promoCourse} onChange={e => setPromoCourse(e.target.value)} className={inputClass}>
              <option value="all">All Courses</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Current Semester</label>
            <select value={promoSem} onChange={e => setPromoSem(Number(e.target.value))} className={inputClass}>
              {[1,2,3,4,5].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <Button onClick={() => { if (confirm(`Promote all Semester ${promoSem} students to Semester ${promoSem + 1}?`)) promoteMutation.mutate(); }} disabled={promoteMutation.isPending} className="rounded-xl font-body shrink-0">
            <ArrowUpCircle className="w-4 h-4 mr-1" /> {promoteMutation.isPending ? "Promoting..." : `Promote to Sem ${promoSem + 1}`}
          </Button>
        </div>
      </div>

      {/* Post Notice / Announcement */}
      <div id="notice" className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-secondary" /> Post Notice / Announcement
        </h3>
        <p className="font-body text-xs text-muted-foreground mb-4">Posted notices will appear on the main website immediately.</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Title *</label>
            <input value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} className={inputClass} placeholder="e.g. Exam Schedule Released" />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Type</label>
            <select value={noticeType} onChange={e => setNoticeType(e.target.value)} className={inputClass}>
              {["General", "Academic", "Exam", "Event", "Admission", "Holiday", "Urgent"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Content</label>
          <textarea value={noticeContent} onChange={e => setNoticeContent(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Notice details..." />
        </div>
        <Button onClick={() => noticeMutation.mutate()} disabled={noticeMutation.isPending} className="rounded-xl font-body">
          <Megaphone className="w-4 h-4 mr-1" /> {noticeMutation.isPending ? "Posting..." : "Post Notice"}
        </Button>
      </div>

      {/* Export Section */}
      <div id="export" className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" /> Export Data
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => exportStudents("csv")} className="rounded-xl font-body text-xs">
            <Download className="w-3 h-3 mr-1" /> Export Students (CSV)
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a: any) => (
            a.isAnchor ? (
              <a key={a.label} href={a.path} className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-md ${a.highlight ? "border-dashed border-secondary/40 hover:border-secondary/80 bg-gradient-to-br from-secondary/5 to-transparent" : "border-border hover:bg-primary/5 hover:border-primary/20"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 ${a.highlight ? "bg-secondary/15" : "bg-primary/10"}`}>
                  <a.icon className={`w-5 h-5 ${a.highlight ? "text-secondary-foreground" : "text-primary"}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-semibold text-foreground">{a.label}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{a.desc}</p>
                </div>
              </a>
            ) : (
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
            )
          ))}
        </div>
      </div>
    </div>
  );
}
