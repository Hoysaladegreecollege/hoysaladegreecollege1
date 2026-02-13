import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Users, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function TeacherStudents() {
  const [search, setSearch] = useState("");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["teacher-students"],
    queryFn: async () => {
      const { data: studentsData } = await supabase
        .from("students")
        .select("*, courses(name, code)")
        .eq("is_active", true)
        .order("roll_number");
      if (!studentsData || studentsData.length === 0) return [];
      const userIds = studentsData.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", userIds);
      return studentsData.map((s) => ({
        ...s,
        profile: profiles?.find((p) => p.user_id === s.user_id),
      }));
    },
  });

  const filtered = students.filter((s: any) => {
    const name = (s.profile?.full_name || s.roll_number || "").toLowerCase();
    return name.includes(search.toLowerCase()) || s.roll_number.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Students
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">{students.length} active students</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading students...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Roll No</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Name</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Course</th>
                  <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Semester</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Phone</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="font-body text-sm p-4 font-semibold text-primary">{s.roll_number}</td>
                    <td className="font-body text-sm p-4 font-medium text-foreground">{s.profile?.full_name || "—"}</td>
                    <td className="font-body text-sm p-4 text-foreground">{s.courses?.name || "—"}</td>
                    <td className="font-body text-sm p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{s.semester}</span>
                    </td>
                    <td className="font-body text-sm p-4 text-foreground">{s.profile?.phone || s.parent_phone || "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="text-center font-body text-sm text-muted-foreground p-8">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
