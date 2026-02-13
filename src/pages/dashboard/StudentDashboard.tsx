import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function StudentDashboard() {
  const { profile, user } = useAuth();

  const { data } = useQuery({
    queryKey: ["student-dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;
      // Get student record
      const { data: student } = await supabase.from("students").select("id").eq("user_id", user.id).single();
      if (!student) return null;

      const [attendance, marks, notices] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", student.id),
        supabase.from("marks").select("obtained_marks, max_marks").eq("student_id", student.id),
        supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);

      const total = attendance.data?.length || 0;
      const present = attendance.data?.filter(a => a.status === "present").length || 0;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;

      const marksData = marks.data || [];
      const avgMarks = marksData.length > 0
        ? Math.round(marksData.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marksData.length)
        : 0;

      return { attendance: `${pct}%`, avgMarks: `${avgMarks}%`, notices: notices.count || 0 };
    },
    enabled: !!user,
  });

  const { data: recentNotices = [] } = useQuery({
    queryKey: ["student-recent-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("title, created_at").eq("is_active", true).order("created_at", { ascending: false }).limit(3);
      return data || [];
    },
  });

  const quickStats = [
    { label: "Attendance", value: data?.attendance ?? "—", icon: Clock, color: "bg-primary/10 text-primary" },
    { label: "Avg Marks", value: data?.avgMarks ?? "—", icon: BarChart3, color: "bg-secondary/10 text-secondary" },
    { label: "Notices", value: String(data?.notices ?? "—"), icon: Bell, color: "bg-secondary/10 text-secondary" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name || "Student"} 👋
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Here's your academic overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickStats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Notices</h3>
        <div className="space-y-3">
          {recentNotices.length === 0 && <p className="font-body text-sm text-muted-foreground">No notices yet.</p>}
          {recentNotices.map((n: any) => (
            <div key={n.created_at} className="p-3 rounded-lg bg-muted/50">
              <p className="font-body text-sm font-medium text-foreground">{n.title}</p>
              <p className="font-body text-xs text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
