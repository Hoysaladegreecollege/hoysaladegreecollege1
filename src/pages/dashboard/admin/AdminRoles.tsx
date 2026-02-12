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

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Roles & Permissions</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {["student", "teacher", "principal", "admin"].map((role) => {
          const count = roleCounts.find((r) => r.role === role)?.count || 0;
          return (
            <div key={role} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground capitalize">{role}</h3>
                  <p className="font-body text-xs text-muted-foreground">{count} user{count !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground">{roleDescriptions[role]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
