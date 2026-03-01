import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, Award, Megaphone, Image, BookOpen, Settings, BarChart3, Activity, TrendingUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ActionCenter from "@/components/ActionCenter";

const CHART_COLORS = ["hsl(215, 90%, 55%)", "hsl(145, 65%, 42%)", "hsl(42, 70%, 52%)", "hsl(280, 60%, 55%)"];

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

function CircularProgress({ pct, size = 88, stroke = 8, color = "hsl(var(--primary))" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(pct), 150); return () => clearTimeout(t); }, [pct]);
  return (
    <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - animated / 100)} className="transition-all duration-1000 ease-out" />
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color?: string }) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div ref={ref} className="bg-card border border-border/60 rounded-2xl p-5 hover:border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color || "bg-primary/10"}`}>
        <Icon className={`w-5 h-5 ${color ? "text-white" : "text-primary"}`} />
      </div>
      <p className="font-body text-[28px] font-bold text-foreground tracking-tight tabular-nums leading-none group-hover:text-primary transition-colors duration-300">{count}</p>
      <p className="font-body text-[12px] text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}

export default function PrincipalDashboard() {
  const { profile } = useAuth();
  const [attDate, setAttDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: counts, isLoading } = useQuery({
    queryKey: ["principal-stats", attDate],
    refetchInterval: 30000,
    queryFn: async () => {
      const [students, teachers, courses, notices, attendance] = await Promise.all([
        supabase.from("students").select("id, semester", { count: "exact" }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("attendance").select("status").eq("date", attDate),
      ]);
      const semCounts: Record<number, number> = {};
      (students.data || []).forEach((s: any) => { semCounts[s.semester] = (semCounts[s.semester] || 0) + 1; });
      const att = attendance.data || [];
      const present = att.filter(a => a.status === "present").length;
      const pct = att.length > 0 ? Math.round((present / att.length) * 100) : 0;
      return { students: students.count || 0, teachers: teachers.count || 0, courses: courses.count || 0, notices: notices.count || 0, semesterBreakdown: semCounts, attendancePct: pct, totalAtt: att.length, presentAtt: present };
    },
  });

  const semesterData = [1,2,3,4,5,6].map(s => ({ name: `Sem ${s}`, students: counts?.semesterBreakdown?.[s] || 0 }));

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users, color: "bg-blue-500" },
    { label: "Faculty Members", value: String(counts?.teachers ?? 0), icon: GraduationCap, color: "bg-emerald-500" },
    { label: "Active Courses", value: String(counts?.courses ?? 0), icon: BookOpen, color: "bg-amber-500" },
    { label: "Active Notices", value: String(counts?.notices ?? 0), icon: Megaphone, color: "bg-purple-500" },
  ];

  const actions = [
    { icon: Award, label: "Top Students", desc: "Update rankings", path: "/dashboard/principal/top-students", color: "bg-amber-500/10", iconColor: "text-amber-500" },
    { icon: Image, label: "Events & Gallery", desc: "Post events", path: "/dashboard/principal/events", color: "bg-purple-500/10", iconColor: "text-purple-500" },
    { icon: Megaphone, label: "Notices", desc: "Publish updates", path: "/dashboard/principal/notices", color: "bg-blue-500/10", iconColor: "text-blue-500" },
    { icon: BookOpen, label: "Courses & Fees", desc: "Update details", path: "/dashboard/principal/courses", color: "bg-emerald-500/10", iconColor: "text-emerald-500" },
    { icon: GraduationCap, label: "Departments", desc: "Manage departments", path: "/dashboard/principal/departments", color: "bg-cyan-500/10", iconColor: "text-cyan-500" },
    { icon: Settings, label: "Teachers", desc: "Manage faculty", path: "/dashboard/principal/teachers", color: "bg-rose-500/10", iconColor: "text-rose-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h2 className="font-body text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Principal"}
        </h2>
        <p className="font-body text-[13px] text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <ActionCenter role="principal" />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="font-body text-2xl font-bold text-foreground tabular-nums">{counts ? `${Math.round((counts.students || 1) / Math.max(counts.teachers || 1, 1))}:1` : "—"}</p>
          <p className="font-body text-[11px] text-muted-foreground mt-0.5">Student-Teacher Ratio</p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="font-body text-2xl font-bold text-foreground tabular-nums">{counts?.attendancePct || 0}%</p>
          <p className="font-body text-[11px] text-muted-foreground mt-0.5">Attendance Rate</p>
        </div>
        <div className="bg-card border border-border/60 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <p className="font-body text-2xl font-bold text-foreground tabular-nums">{counts?.courses || 0}</p>
          <p className="font-body text-[11px] text-muted-foreground mt-0.5">Active Courses</p>
        </div>
      </div>

      {/* Attendance Detail with Date Picker */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-body text-[14px] font-semibold text-foreground">Attendance Overview</h3>
          </div>
          <input type="date" value={attDate} onChange={e => setAttDate(e.target.value)}
            className="font-body text-xs border border-border rounded-lg px-2.5 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-500/5 rounded-xl p-3 text-center">
            <p className="font-body text-2xl font-bold text-emerald-600 tabular-nums">{counts?.presentAtt || 0}</p>
            <p className="font-body text-[10px] text-muted-foreground">Present</p>
          </div>
          <div className="bg-red-500/5 rounded-xl p-3 text-center">
            <p className="font-body text-2xl font-bold text-red-500 tabular-nums">{(counts?.totalAtt || 0) - (counts?.presentAtt || 0)}</p>
            <p className="font-body text-[10px] text-muted-foreground">Absent</p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3 text-center">
            <p className="font-body text-2xl font-bold text-foreground tabular-nums">{counts?.attendancePct || 0}%</p>
            <p className="font-body text-[10px] text-muted-foreground">Rate</p>
          </div>
        </div>
        {(counts?.totalAtt || 0) === 0 && (
          <p className="font-body text-xs text-muted-foreground text-center mt-3">No attendance records for this date</p>
        )}
      </div>

      {/* Chart + Management */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-cyan-500" />
            </div>
            <h3 className="font-body text-[14px] font-semibold text-foreground">Students by Semester</h3>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={semesterData}>
                <defs>
                  <linearGradient id="principalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215, 90%, 55%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(215, 90%, 55%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, fontFamily: "Inter", fontSize: 12, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="students" stroke="hsl(215, 90%, 55%)" fill="url(#principalGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(215, 90%, 55%)", strokeWidth: 2, stroke: "hsl(var(--card))" }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[14px] font-semibold text-foreground mb-4">Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actions.map((a) => (
              <Link key={a.label} to={a.path} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center shrink-0`}>
                  <a.icon className={`w-4 h-4 ${a.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-[12px] font-medium text-foreground truncate">{a.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Grid */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="font-body text-[14px] font-semibold text-foreground mb-4">Semester Breakdown</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map((sem, i) => (
            <div key={sem} className="text-center p-3 rounded-xl border border-border/40 hover:border-border hover:shadow-md transition-all duration-300" style={{ background: `${CHART_COLORS[i % CHART_COLORS.length]}10` }}>
              <p className="font-body text-xl font-bold text-foreground tabular-nums">{counts?.semesterBreakdown?.[sem] || 0}</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5 font-medium">Sem {sem}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
