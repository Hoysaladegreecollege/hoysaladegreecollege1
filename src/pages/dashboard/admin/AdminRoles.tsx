import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Shield } from "lucide-react";

export default function AdminRoles() {
  const { data: roleCounts = [] } = useQuery({
    queryKey: ["admin-role-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((r) => { counts[r.role] = (counts[r.role] || 0) + 1; });
      return Object.entries(counts).map(([role, count]) => ({ role, count }));
    },
  });

  const roleDescriptions: Record<string, string> = {
    student: "Can view their own attendance, marks, notices, and study materials.",
    teacher: "Can manage students, mark attendance, upload marks and materials, post notices.",
    principal: "Full CMS authority: manage events, courses, departments, top students, notices.",
    admin: "Super admin: manage all users, roles, and system settings.",
  };

  const roleColors: Record<string, string> = {
    student: "from-primary/5 to-primary/15",
    teacher: "from-secondary/5 to-secondary/15",
    principal: "from-primary/5 to-secondary/10",
    admin: "from-secondary/5 to-primary/10",
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Roles & Permissions
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Overview of user roles and their capabilities</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {["student", "teacher", "principal", "admin"].map((role) => {
          const count = roleCounts.find((r) => r.role === role)?.count || 0;
          return (
            <div key={role} className={`bg-gradient-to-br ${roleColors[role]} border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground capitalize">{role}</h3>
                  <p className="font-body text-xs text-muted-foreground">{count} user{count !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{roleDescriptions[role]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
