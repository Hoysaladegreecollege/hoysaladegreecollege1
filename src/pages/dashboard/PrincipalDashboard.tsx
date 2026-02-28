import { useAuth } from "@/contexts/AuthContext";
import { Users, GraduationCap, Award, Megaphone, Image, BookOpen, Settings, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ActionCenter from "@/components/ActionCenter";

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
      <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center mb-4">
        <Icon className="w-[18px] h-[18px] text-muted-foreground" />
      </div>
      <p className="font-body text-[28px] font-semibold text-foreground tracking-tight tabular-nums leading-none">{count}</p>
      <p className="font-body text-[12px] text-muted-foreground mt-1.5">{label}</p>
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
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users },
    { label: "Faculty Members", value: String(counts?.teachers ?? 0), icon: GraduationCap },
    { label: "Active Courses", value: String(counts?.courses ?? 0), icon: BookOpen },
    { label: "Active Notices", value: String(counts?.notices ?? 0), icon: Megaphone },
  ];

  const actions = [
    { icon: Award, label: "Top Students", desc: "Update rankings", path: "/dashboard/principal/top-students" },
    { icon: Image, label: "Events & Gallery", desc: "Post events & photos", path: "/dashboard/principal/events" },
    { icon: Megaphone, label: "Notices", desc: "Publish announcements", path: "/dashboard/principal/notices" },
    { icon: BookOpen, label: "Courses & Fees", desc: "Update details", path: "/dashboard/principal/courses" },
    { icon: GraduationCap, label: "Departments", desc: "Manage departments", path: "/dashboard/principal/departments" },
    { icon: Settings, label: "Teachers", desc: "Manage faculty", path: "/dashboard/principal/teachers" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-body text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Principal"}
        </h2>
        <p className="font-body text-[13px] text-muted-foreground mt-1">Full administrative control over your institution.</p>
      </div>

      <ActionCenter role="principal" />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Chart + Management */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-5">College Overview</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} cursor={{ fill: "hsl(var(--muted) / 0.5)" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actions.map((a) => (
              <Link key={a.label} to={a.path} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center shrink-0">
                  <a.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-200" />
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

      {/* Semester Breakdown */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Students by Semester</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map(sem => (
            <div key={sem} className="text-center p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors duration-200">
              <p className="font-body text-lg font-semibold text-foreground tabular-nums">{counts?.semesterBreakdown?.[sem] || 0}</p>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">Sem {sem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Student-Teacher Ratio", value: counts ? `${Math.round((counts.students || 1) / Math.max(counts.teachers || 1, 1))}:1` : "—" },
          { label: "Active Courses", value: String(counts?.courses || 0) },
          { label: "Notice Board", value: String(counts?.notices || 0) },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border/60 rounded-2xl p-4">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className="font-body text-2xl font-semibold text-foreground mt-1 tabular-nums">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
