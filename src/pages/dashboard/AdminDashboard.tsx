import { useAuth } from "@/contexts/AuthContext";
import { Users, Shield, Settings, Database, Activity, UserCog } from "lucide-react";

const stats = [
  { label: "Total Users", value: "380", icon: Users, color: "bg-primary/10 text-primary" },
  { label: "Active Sessions", value: "42", icon: Activity, color: "bg-secondary/10 text-secondary" },
  { label: "System Health", value: "99.9%", icon: Database, color: "bg-primary/10 text-primary" },
  { label: "Roles Assigned", value: "4", icon: Shield, color: "bg-secondary/10 text-secondary" },
];

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Super Admin Panel ⚙️
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Full system control and user management</p>
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
          <h3 className="font-display text-lg font-bold text-foreground mb-4">User Management</h3>
          <div className="space-y-3">
            {[
              { label: "Students", count: 350 },
              { label: "Teachers", count: 18 },
              { label: "Principals", count: 1 },
              { label: "Admins", count: 1 },
            ].map((u) => (
              <div key={u.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-body text-sm text-foreground">{u.label}</span>
                <span className="font-body text-sm font-semibold text-primary">{u.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { icon: UserCog, label: "Manage Users & Roles" },
              { icon: Shield, label: "Security & Permissions" },
              { icon: Settings, label: "System Settings" },
              { icon: Database, label: "Database Monitoring" },
            ].map((a) => (
              <button key={a.label} className="flex items-center gap-3 w-full p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left">
                <a.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="font-body text-sm text-foreground">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
