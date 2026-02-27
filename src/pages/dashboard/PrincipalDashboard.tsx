import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, Award, Megaphone, Image, BookOpen, Settings, TrendingUp, BarChart3, Bell, CheckSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ActionCenter from "@/components/ActionCenter";

function useAnimatedCounter(target: number, duration = 1400) {
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

function AnimatedStatCard({ label, value, icon: Icon, gradient, accent, delay = 0 }: any) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} border border-border rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group card-stack`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none spotlight" />
      <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="font-display text-3xl font-bold text-foreground tabular-nums">{count}</p>
      <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function PrincipalDashboard() {
  const { profile } = useAuth();

  const { data: counts, isLoading } = useQuery({
    queryKey: ["principal-stats"],
    refetchInterval: 30000,
    queryFn: async () => {
      const [students, teachers, courses, notices] = await Promise.all([
        supabase.from("students").select("id, semester", { count: "exact" }).eq("is_active", true),
        supabase.from("teachers").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("courses").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      const semCounts: Record<number, number> = {};
      (students.data || []).forEach((s: any) => { semCounts[s.semester] = (semCounts[s.semester] || 0) + 1; });
      return { students: students.count || 0, teachers: teachers.count || 0, courses: courses.count || 0, notices: notices.count || 0, semesterBreakdown: semCounts };
    },
  });

  const chartData = [
    { name: "Students", count: counts?.students || 0 },
    { name: "Faculty", count: counts?.teachers || 0 },
    { name: "Courses", count: counts?.courses || 0 },
    { name: "Notices", count: counts?.notices || 0 },
  ];

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users, gradient: "from-primary/8 to-primary/3", accent: "bg-primary/10", delay: 0 },
    { label: "Faculty Members", value: String(counts?.teachers ?? 0), icon: GraduationCap, gradient: "from-secondary/8 to-secondary/3", accent: "bg-secondary/10", delay: 80 },
    { label: "Active Courses", value: String(counts?.courses ?? 0), icon: BookOpen, gradient: "from-primary/8 to-primary/3", accent: "bg-primary/10", delay: 160 },
    { label: "Active Notices", value: String(counts?.notices ?? 0), icon: Megaphone, gradient: "from-secondary/8 to-secondary/3", accent: "bg-secondary/10", delay: 240 },
  ];

  const actions = [
    { icon: Award, label: "Top Students", desc: "Update top rank students", path: "/dashboard/principal/top-students", color: "from-secondary/10 to-secondary/5 hover:border-secondary/30" },
    { icon: Image, label: "Events & Gallery", desc: "Post events & photos", path: "/dashboard/principal/events", color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/30" },
    { icon: Megaphone, label: "Notices", desc: "Publish announcements", path: "/dashboard/principal/notices", color: "from-primary/10 to-primary/5 hover:border-primary/30" },
    { icon: BookOpen, label: "Courses & Fees", desc: "Update course details", path: "/dashboard/principal/courses", color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/30" },
    { icon: GraduationCap, label: "Departments", desc: "Manage departments", path: "/dashboard/principal/departments", color: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/30" },
    { icon: Settings, label: "Teachers", desc: "Add & manage faculty", path: "/dashboard/principal/teachers", color: "from-orange-500/10 to-orange-500/5 hover:border-orange-500/30" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/25 rounded-full px-3 py-1 mb-3">
            <Award className="w-3 h-3 text-secondary" />
            <span className="font-body text-[11px] text-secondary-foreground font-semibold uppercase tracking-wider">Principal Portal</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Welcome, {profile?.full_name?.split(" ")[0] || "Principal"} 🏛️
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Full administrative control — manage faculty, students, courses, and content.</p>
        </div>
      </div>

      {/* Action Center */}
      <ActionCenter role="principal" />

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => <AnimatedStatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Leadership Snapshot */}
      {!isLoading && (
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
          <div className="premium-card p-4 sm:p-5">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">Campus Strength</p>
            <p className="font-display text-3xl font-bold text-foreground mt-2">{counts?.students || 0}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Active enrolled students</p>
          </div>
          <div className="premium-card p-4 sm:p-5">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">Faculty Capacity</p>
            <p className="font-display text-3xl font-bold text-foreground mt-2">{counts?.teachers || 0}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Teaching members available</p>
          </div>
          <Link to="/dashboard/principal/notices" className="premium-card p-4 sm:p-5 group">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">Priority Action</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-display text-xl font-bold text-foreground">Review Notices</p>
              <CheckSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="font-body text-xs text-muted-foreground mt-1">{counts?.notices || 0} active on board</p>
          </Link>
        </div>
      )}

      {/* Chart + Management */}
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> College Overview
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {actions.map((a, i) => (
              <Link
                key={a.label}
                to={a.path}
                className={`flex items-center gap-2.5 p-3 rounded-xl border border-border bg-gradient-to-br ${a.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="w-9 h-9 rounded-xl bg-card/80 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <a.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-body text-xs font-semibold text-foreground truncate">{a.label}</p>
                  <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Summary + Semester Breakdown */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* College Summary Cards */}
        <div className="space-y-3">
          {[
            { label: "Student-Teacher Ratio", value: counts ? `${Math.round((counts.students || 1) / Math.max(counts.teachers || 1, 1))}:1` : "—", icon: "📊", desc: "Per faculty member" },
            { label: "Active Courses", value: String(counts?.courses || 0), icon: "📚", desc: "Currently running" },
            { label: "Notice Board", value: String(counts?.notices || 0), icon: "📢", desc: "Published notices" },
          ].map((item) => (
            <div key={item.label} className="bg-gradient-to-br from-muted/50 to-muted/20 border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-card shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{item.value}</p>
                <p className="font-body text-xs font-semibold text-foreground">{item.label}</p>
                <p className="font-body text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Semester-wise Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-secondary" /> Students by Semester
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3,4,5,6].map(sem => (
              <div key={sem} className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/8 to-secondary/5 border border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
                <p className="font-display text-2xl font-bold text-primary group-hover:scale-110 transition-transform">{counts?.semesterBreakdown?.[sem] || 0}</p>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Sem {sem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
