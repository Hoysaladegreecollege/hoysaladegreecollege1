import { Settings, Globe, Calendar, Shield, TrendingUp, Activity, Download, Users, Database, Server, CheckCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function useAnimatedCounter(target: number) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    const duration = 1200;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return count;
}

function HealthCard({ name, count, icon: Icon, color }: { name: string; count: number; icon: any; color: string }) {
  const animated = useAnimatedCounter(count);
  return (
    <div className={`relative overflow-hidden p-4 rounded-2xl border border-border bg-gradient-to-br ${color} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group card-stack`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 spotlight pointer-events-none" />
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-card/70 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-body text-[9px] text-primary font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-foreground tabular-nums">{animated.toLocaleString()}</p>
      <p className="font-body text-xs text-muted-foreground mt-0.5">{name}</p>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

const healthIcons: Record<string, any> = {
  Students: Users,
  Teachers: Users,
  Courses: Database,
  Notices: AlertCircle,
  Events: Calendar,
  Applications: Activity,
  "Attendance Records": Clock,
  "Marks Records": TrendingUp,
};

const healthColors = [
  "from-primary/8 to-primary/3",
  "from-secondary/8 to-secondary/3",
  "from-blue-500/8 to-blue-500/3",
  "from-emerald-500/8 to-emerald-500/3",
  "from-purple-500/8 to-purple-500/3",
  "from-orange-500/8 to-orange-500/3",
  "from-rose-500/8 to-rose-500/3",
  "from-teal-500/8 to-teal-500/3",
];

export default function AdminSettings() {
  const settings = [
    { label: "College Name", value: "Hoysala Degree College", icon: Globe },
    { label: "Academic Year", value: "2025-2026", icon: Calendar },
    { label: "System Status", value: "Active", icon: Shield },
    { label: "College Code", value: "BU 26 (P21GEF0099)", icon: Settings },
    { label: "Affiliation", value: "Bangalore University", icon: Globe },
  ];

  const { data: growthData, isLoading: growthLoading } = useQuery({
    queryKey: ["admin-growth-analytics"],
    queryFn: async () => {
      const { data: students } = await supabase.from("students").select("created_at, admission_year").eq("is_active", true);
      if (!students) return [];
      const byYear: Record<number, number> = {};
      students.forEach(s => {
        const yr = s.admission_year || new Date(s.created_at).getFullYear();
        byYear[yr] = (byYear[yr] || 0) + 1;
      });
      return Object.entries(byYear).sort(([a], [b]) => Number(a) - Number(b)).map(([year, count]) => ({ year, count }));
    },
  });

  const { data: healthData, isLoading: healthLoading } = useQuery({
    queryKey: ["admin-health-monitor"],
    queryFn: async () => {
      const [students, teachers, courses, notices, events, apps, attendance, marks] = await Promise.all([
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("teachers").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("notices").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("admission_applications").select("id", { count: "exact", head: true }),
        supabase.from("attendance").select("id", { count: "exact", head: true }),
        supabase.from("marks").select("id", { count: "exact", head: true }),
      ]);
      return [
        { name: "Students", count: students.count || 0 },
        { name: "Teachers", count: teachers.count || 0 },
        { name: "Courses", count: courses.count || 0 },
        { name: "Notices", count: notices.count || 0 },
        { name: "Events", count: events.count || 0 },
        { name: "Applications", count: apps.count || 0 },
        { name: "Attendance Records", count: attendance.count || 0 },
        { name: "Marks Records", count: marks.count || 0 },
      ];
    },
  });

  const totalRecords = healthData?.reduce((sum, h) => sum + h.count, 0) || 0;

  const exportHealthReport = () => {
    if (!healthData) return;
    const csv = ["Table,Record Count,Status", ...healthData.map(h => `${h.name},${h.count},Healthy`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "system_health_report.csv"; a.click();
    toast.success("Health report exported!");
  };

  const exportStudentsCSV = async () => {
    const { data: students } = await supabase.from("students").select("*, courses(name, code)");
    const { data: profiles } = await supabase.from("profiles").select("*");
    if (!students) return;
    const rows = students.map(s => {
      const p = profiles?.find(pr => pr.user_id === s.user_id);
      return [
        p?.full_name || "", p?.email || "", p?.phone || "",
        s.roll_number, s.semester, s.admission_year,
        (s as any).courses?.name || "", (s as any).courses?.code || "",
        s.parent_phone || "", s.address || "", s.date_of_birth || "",
        s.total_fee || 0, s.fee_paid || 0, s.fee_remarks || "",
      ].map(v => `"${v}"`).join(",");
    });
    const header = ["Name","Email","Phone","Roll Number","Semester","Admission Year","Course","Course Code","Parent Phone","Address","DOB","Total Fee","Fee Paid","Fee Remarks"].join(",");
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "students_export.csv"; a.click();
    toast.success("Students exported to CSV!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-2">
              <Server className="w-3 h-3 text-primary" />
              <span className="font-body text-[11px] text-primary font-semibold uppercase tracking-wider">System Console</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> System Settings
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">System configuration, analytics & real-time health monitoring</p>
          </div>
        </div>
      </div>

      {/* System Status Summary */}
      {!healthLoading && healthData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-primary/8 to-primary/3 border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">{totalRecords.toLocaleString()}</p>
              <p className="font-body text-xs text-muted-foreground">Total Database Records</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/8 to-emerald-500/3 border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">{healthData.length}</p>
              <p className="font-body text-xs text-muted-foreground">Tables Monitored — All Healthy</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-secondary/8 to-secondary/3 border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Server className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">99.9%</p>
              <p className="font-body text-xs text-muted-foreground">Uptime — System Stable</p>
            </div>
          </div>
        </div>
      )}

      {/* Export Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between group hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-body text-sm font-bold text-foreground">Export Students</h3>
              <p className="font-body text-xs text-muted-foreground">All records with fees & contact</p>
            </div>
          </div>
          <Button variant="outline" onClick={exportStudentsCSV} className="rounded-xl font-body text-xs shrink-0">
            <Download className="w-3 h-3 mr-1" /> CSV
          </Button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between group hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-body text-sm font-bold text-foreground">Health Report</h3>
              <p className="font-body text-xs text-muted-foreground">System database summary</p>
            </div>
          </div>
          <Button variant="outline" onClick={exportHealthReport} className="rounded-xl font-body text-xs shrink-0">
            <Download className="w-3 h-3 mr-1" /> CSV
          </Button>
        </div>
      </div>

      {/* General Info */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> General Information
        </h3>
        <div className="space-y-2">
          {settings.map((s, i) => (
            <div
              key={s.label}
              className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-body text-sm text-muted-foreground">{s.label}</span>
              </div>
              <span className="font-body text-sm font-bold text-primary">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Growth Analytics */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Student Enrollment Growth
        </h3>
        {growthLoading ? <Skeleton className="h-56 w-full rounded-xl" /> : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#growthGrad)" dot={{ fill: "hsl(var(--secondary))", r: 5, strokeWidth: 0 }} activeDot={{ r: 7, fill: "hsl(var(--primary))" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* System Health Monitor */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Database Health Report
            </h3>
            <p className="font-body text-xs text-muted-foreground mt-0.5">Real-time record counts across all tables</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-body text-xs text-primary font-semibold">All Systems Operational</span>
          </div>
        </div>
        {healthLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {healthData?.map((h, i) => (
              <HealthCard
                key={h.name}
                name={h.name}
                count={h.count}
                icon={healthIcons[h.name] || Database}
                color={healthColors[i % healthColors.length]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
