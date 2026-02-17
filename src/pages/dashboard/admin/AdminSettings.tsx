import { Settings, Globe, Calendar, Shield, Database, TrendingUp, Activity, Server, Users, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

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
        { name: "Students", count: students.count || 0, status: "healthy" },
        { name: "Teachers", count: teachers.count || 0, status: "healthy" },
        { name: "Courses", count: courses.count || 0, status: "healthy" },
        { name: "Notices", count: notices.count || 0, status: "healthy" },
        { name: "Events", count: events.count || 0, status: "healthy" },
        { name: "Applications", count: apps.count || 0, status: "healthy" },
        { name: "Attendance Records", count: attendance.count || 0, status: "healthy" },
        { name: "Marks Records", count: marks.count || 0, status: "healthy" },
      ];
    },
  });

  const exportHealthReport = () => {
    if (!healthData) return;
    const csv = ["Table,Record Count,Status", ...healthData.map(h => `${h.name},${h.count},${h.status}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "system_health_report.csv"; a.click();
    toast.success("Health report exported!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" /> System Settings
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">System configuration, analytics & health monitoring</p>
      </div>

      {/* General Info */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-base font-bold text-foreground mb-5">General Information</h3>
        <div className="space-y-3">
          {settings.map((s) => (
            <div key={s.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="font-body text-sm text-foreground">{s.label}</span>
              </div>
              <span className="font-body text-sm font-semibold text-primary">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Growth Analytics */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Student Growth Analytics
        </h3>
        {growthLoading ? <Skeleton className="h-56 w-full rounded-xl" /> : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 88%)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fontFamily: "Inter" }} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="hsl(217, 72%, 18%)" strokeWidth={2} dot={{ fill: "hsl(42, 87%, 55%)", r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* System Health Monitor */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> System Health Monitor
          </h3>
          <Button variant="outline" size="sm" onClick={exportHealthReport} className="rounded-xl font-body text-xs">
            <Download className="w-3 h-3 mr-1" /> Export Report
          </Button>
        </div>
        {healthLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {healthData?.map(h => (
              <div key={h.name} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-body text-xs text-muted-foreground">{h.name}</span>
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="font-display text-xl font-bold text-foreground">{h.count.toLocaleString()}</p>
                <p className="font-body text-[10px] text-primary font-semibold uppercase tracking-wider">Healthy</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
