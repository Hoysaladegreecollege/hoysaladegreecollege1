import { useAuth } from "@/contexts/AuthContext";
import { Users, Clock, BarChart3, Upload, Bell, Megaphone, Calendar, BookOpen, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
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

function StatCard({ label, value, suffix = "", icon: Icon }: { label: string; value: string; suffix?: string; icon: React.ElementType }) {
  const { count, ref } = useAnimatedCounter(parseInt(value) || 0);
  return (
    <div ref={ref} className="bg-card border border-border/60 rounded-2xl p-5 hover:border-border transition-colors duration-200">
      <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center mb-4">
        <Icon className="w-[18px] h-[18px] text-muted-foreground" />
      </div>
      <p className="font-body text-[28px] font-semibold text-foreground tracking-tight tabular-nums leading-none">{count}{suffix}</p>
      <p className="font-body text-[12px] text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}

export default function TeacherDashboard() {
  const { profile } = useAuth();

  const { data: counts, isLoading } = useQuery({
    queryKey: ["teacher-stats"],
    refetchInterval: 30000,
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

  const stats = [
    { label: "Total Students", value: String(counts?.students ?? 0), icon: Users },
    { label: "Study Materials", value: String(counts?.materials ?? 0), icon: Upload },
    { label: "Active Notices", value: String(counts?.notices ?? 0), icon: Bell },
    { label: "Attendance Rate", value: String(counts?.attendancePct ?? 0), suffix: "%", icon: CheckCircle },
  ];

  const quickActions = [
    { icon: Clock, label: "Mark Attendance", desc: "Record daily attendance", path: "/dashboard/teacher/attendance" },
    { icon: BarChart3, label: "Upload Marks", desc: "Enter student marks", path: "/dashboard/teacher/marks" },
    { icon: Upload, label: "Upload Material", desc: "Share resources", path: "/dashboard/teacher/materials" },
    { icon: Megaphone, label: "Post Notice", desc: "Publish updates", path: "/dashboard/teacher/notices" },
    { icon: Users, label: "View Students", desc: "Browse student list", path: "/dashboard/teacher/students" },
    { icon: Calendar, label: "Timetable", desc: "View schedules", path: "/dashboard/teacher/timetable" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-body text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Welcome back, {profile?.full_name?.split(" ")[0] || "Teacher"}
        </h2>
        <p className="font-body text-[13px] text-muted-foreground mt-1">Manage your students, attendance, and course materials.</p>
      </div>

      <ActionCenter role="teacher" />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Priority Cards */}
      {!isLoading && (
        <div className="grid sm:grid-cols-3 gap-3">
          <Link to="/dashboard/teacher/attendance" className="bg-card border border-border/60 rounded-2xl p-4 hover:border-border transition-colors duration-200">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Today's Priority</p>
            <p className="font-body text-base font-semibold text-foreground mt-1.5">Mark Attendance</p>
            <p className="font-body text-[11px] text-muted-foreground mt-0.5">Keep classes up to date</p>
          </Link>
          <Link to="/dashboard/teacher/marks" className="bg-card border border-border/60 rounded-2xl p-4 hover:border-border transition-colors duration-200">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Academic</p>
            <p className="font-body text-base font-semibold text-foreground mt-1.5">Upload Marks</p>
            <p className="font-body text-[11px] text-muted-foreground mt-0.5">Publish evaluations</p>
          </Link>
          <div className="bg-card border border-border/60 rounded-2xl p-4">
            <p className="font-body text-[11px] text-muted-foreground uppercase tracking-wider">Today</p>
            <p className="font-body text-base font-semibold text-foreground mt-1.5">{new Date().toLocaleDateString("en-IN", { weekday: "long" })}</p>
            <p className="font-body text-[11px] text-muted-foreground mt-0.5">{new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.path} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors duration-200 group">
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

      {/* Attendance Visual */}
      {counts && (
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
          <h3 className="font-body text-[13px] font-semibold text-foreground mb-4">Attendance Overview</h3>
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="hsl(var(--primary))" strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - (counts.attendancePct || 0) / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-body text-sm font-semibold text-foreground tabular-nums">{counts.attendancePct}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-body text-[13px] font-medium text-foreground">Overall Attendance Rate</p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">Based on all recorded sessions</p>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${counts.attendancePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
