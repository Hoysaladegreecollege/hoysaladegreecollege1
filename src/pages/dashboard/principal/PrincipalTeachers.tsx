import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function PrincipalTeachers() {
  const [search, setSearch] = useState("");

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["principal-teachers"],
    queryFn: async () => {
      const { data: teachersData } = await supabase
        .from("teachers")
        .select("*, departments(name)")
        .eq("is_active", true)
        .order("employee_id");
      if (!teachersData) return [];
      const userIds = teachersData.map((t) => t.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, phone").in("user_id", userIds);
      return teachersData.map((t) => ({
        ...t,
        profile: profiles?.find((p) => p.user_id === t.user_id),
      }));
    },
  });

  const filtered = teachers.filter((t: any) => {
    const name = (t.profile?.full_name || t.employee_id).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Teachers</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-body text-xs text-muted-foreground p-3">Emp ID</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Name</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Department</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Qualification</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t: any) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="font-body text-sm p-3 font-medium">{t.employee_id}</td>
                <td className="font-body text-sm p-3">{t.profile?.full_name || "-"}</td>
                <td className="font-body text-sm p-3">{t.departments?.name || "-"}</td>
                <td className="font-body text-sm p-3">{t.qualification || "-"}</td>
                <td className="font-body text-sm p-3">{t.profile?.email || "-"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center font-body text-sm text-muted-foreground p-6">{isLoading ? "Loading..." : "No teachers found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
