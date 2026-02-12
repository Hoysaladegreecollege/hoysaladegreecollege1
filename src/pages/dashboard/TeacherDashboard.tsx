import { useAuth } from "@/contexts/AuthContext";
import { Users, Clock, BarChart3, Upload, BookOpen, Bell } from "lucide-react";

const stats = [
  { label: "Total Students", value: "120", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Classes Today", value: "4", icon: Clock, color: "bg-secondary/10 text-secondary" },
  { label: "Pending Marks", value: "2", icon: BarChart3, color: "bg-primary/10 text-primary" },
  { label: "Materials", value: "15", icon: Upload, color: "bg-secondary/10 text-secondary" },
];

export default function TeacherDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Welcome, {profile?.full_name || "Teacher"} 👋
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Manage your students, attendance, and marks</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {["9:00 AM - Data Structures (BCA 4th Sem)", "11:00 AM - Java Programming (BCA 2nd Sem)", "2:00 PM - Web Technologies (BCA 6th Sem)", "4:00 PM - DBMS Lab (BCA 4th Sem)"].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span className="font-body text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Clock, label: "Mark Attendance" },
              { icon: BarChart3, label: "Upload Marks" },
              { icon: Upload, label: "Upload Material" },
              { icon: Bell, label: "Post Notice" },
            ].map((a) => (
              <button key={a.label} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted transition-colors">
                <a.icon className="w-5 h-5 text-primary" />
                <span className="font-body text-xs font-medium text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
