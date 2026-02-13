import { useAuth } from "@/contexts/AuthContext";
import { Users, Shield, Settings, Database, Activity, UserCog, FileText, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { profile } = useAuth();

  const { data: counts } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [profiles, roles, applications] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }),
        supabase.from("admission_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      return {
        users: profiles.count || 0,
        roles: roles.count || 0,
        pendingApps: applications.count || 0,
      };
    },
  });

  const stats = [
    { label: "Total Users", value: String(counts?.users ?? "—"), icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Roles Assigned", value: String(counts?.roles ?? "—"), icon: Shield, color: "bg-secondary/10 text-secondary" },
    { label: "Pending Apps", value: String(counts?.pendingApps ?? "—"), icon: FileText, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Super Admin Panel ⚙️
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Full system control and user management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/dashboard/admin/users" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
            <UserCog className="w-4 h-4 text-primary shrink-0" />
            <span className="font-body text-sm text-foreground">Manage Users & Roles</span>
          </Link>
          <Link to="/dashboard/admin/applications" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <span className="font-body text-sm text-foreground">Admission Applications</span>
          </Link>
          <Link to="/login?mode=signup" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
            <UserPlus className="w-4 h-4 text-primary shrink-0" />
            <span className="font-body text-sm text-foreground">Create New User Account</span>
          </Link>
          <Link to="/dashboard/admin/settings" className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
            <Settings className="w-4 h-4 text-primary shrink-0" />
            <span className="font-body text-sm text-foreground">System Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
