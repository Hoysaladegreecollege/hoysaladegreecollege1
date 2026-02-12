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
      if (!studentsData) return [];
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Students</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        {isLoading ? (
          <p className="font-body text-sm text-muted-foreground p-6">Loading...</p>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left font-body text-xs text-muted-foreground p-3">Roll No</th>
                <th className="text-left font-body text-xs text-muted-foreground p-3">Name</th>
                <th className="text-left font-body text-xs text-muted-foreground p-3">Course</th>
                <th className="text-center font-body text-xs text-muted-foreground p-3">Semester</th>
                <th className="text-left font-body text-xs text-muted-foreground p-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="font-body text-sm p-3 font-medium">{s.roll_number}</td>
                  <td className="font-body text-sm p-3">{s.profile?.full_name || "-"}</td>
                  <td className="font-body text-sm p-3">{s.courses?.name || "-"}</td>
                  <td className="font-body text-sm p-3 text-center">{s.semester}</td>
                  <td className="font-body text-sm p-3">{s.profile?.phone || s.parent_phone || "-"}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center font-body text-sm text-muted-foreground p-6">No students found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
