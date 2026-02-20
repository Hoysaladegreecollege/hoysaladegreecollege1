import { useAuth } from "@/contexts/AuthContext";
import { Users, Clock, BarChart3, Upload, Bell, Megaphone, TrendingUp, Calendar, BookOpen, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

function AnimatedStatCard({ label, value, icon: Icon, gradient, delay = 0 }: any) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} border border-border rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group card-stack`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none spotlight" />
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <p className="font-display text-3xl font-bold text-foreground tabular-nums">{count}</p>
      <p className="font-body text-xs text-muted-foreground mt-1">{label}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

export default function TeacherDashboard() {
  const { profile } = useAuth();

  const { data: counts, isLoading } = useQuery({
    queryKey: ["teacher-stats"],
    queryFn: async () => {
      const [students, materials, notices, attendance] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("study_materials").select("id", { count: "exact", head: true }),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("attendance").select("status"),
      ]);
      const att = attendance.data || [];
      const present = att.filter(a => a.status === "present").length;
      const pct = att.length > 0 ? Math.round((present / att.length) * 100) : 0;
      return { students: students.count || 0, materials: materials.count || 0, notices: notices.count || 0, attendancePct: pct };
    },
  });

  const chartData = [
    { name: "Students", count: counts?.students || 0 },
    { name: "Materials", count: counts?.materials || 0 },
    { name: "Notices", count: counts?.notices || 0 },
  ];

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users, gradient: "from-primary/8 to-primary/3", delay: 0 },
    { label: "Study Materials", value: String(counts?.materials ?? 0), icon: Upload, gradient: "from-secondary/8 to-secondary/3", delay: 80 },
    { label: "Active Notices", value: String(counts?.notices ?? 0), icon: Bell, gradient: "from-primary/8 to-primary/3", delay: 160 },
    { label: "Attendance Rate", value: String(counts?.attendancePct ?? 0), icon: CheckCircle, gradient: "from-secondary/8 to-secondary/3", delay: 240 },
  ];

  const quickActions = [
    { icon: Clock, label: "Mark Attendance", desc: "Record daily attendance", path: "/dashboard/teacher/attendance", color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/30" },
    { icon: BarChart3, label: "Upload Marks", desc: "Enter student marks", path: "/dashboard/teacher/marks", color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/30" },
    { icon: Upload, label: "Upload Material", desc: "Share study resources", path: "/dashboard/teacher/materials", color: "from-secondary/10 to-secondary/5 hover:border-secondary/30" },
    { icon: Megaphone, label: "Post Notice", desc: "Publish announcements", path: "/dashboard/teacher/notices", color: "from-primary/10 to-primary/5 hover:border-primary/30" },
    { icon: Users, label: "View Students", desc: "Browse student list", path: "/dashboard/teacher/students", color: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/30" },
    { icon: Calendar, label: "Timetable", desc: "Manage schedules", path: "/dashboard/teacher/timetable", color: "from-orange-500/10 to-orange-500/5 hover:border-orange-500/30" },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-36 h-36 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-16 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 blur-xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="font-body text-[11px] text-primary font-semibold uppercase tracking-wider">Teacher Portal</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Teacher"} 📚
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-2">Manage your students, attendance, and course materials with ease.</p>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => <AnimatedStatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Chart + Quick Actions */}
      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Overview
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={36}>
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

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {quickActions.map((a, i) => (
              <Link
                key={a.label}
                to={a.path}
                className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl border border-border bg-gradient-to-br ${a.color} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group`}
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

      {/* Attendance Rate Visual */}
      {counts && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" /> Attendance Overview
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - (counts.attendancePct || 0) / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-sm font-bold text-foreground">{counts.attendancePct}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-body text-sm font-semibold text-foreground">Overall Attendance Rate</p>
              <p className="font-body text-xs text-muted-foreground mt-1">Based on all recorded attendance sessions.</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${counts.attendancePct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
