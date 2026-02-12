import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, Clock, BarChart3, Bell, FileText } from "lucide-react";

const quickStats = [
  { label: "Attendance", value: "85%", icon: Clock, color: "bg-primary/10 text-primary" },
  { label: "Avg Marks", value: "72%", icon: BarChart3, color: "bg-secondary/10 text-secondary" },
  { label: "Subjects", value: "6", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { label: "Notices", value: "3", icon: Bell, color: "bg-secondary/10 text-secondary" },
];

export default function StudentDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome back, {profile?.full_name || "Student"} 👋
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Here's your academic overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Recent notices placeholder */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Notices</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-body text-sm font-medium text-foreground">Semester exams starting March 1, 2026</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Feb 10, 2026</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-body text-sm font-medium text-foreground">Sports Day registration open</p>
            <p className="font-body text-xs text-muted-foreground mt-1">Feb 5, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
