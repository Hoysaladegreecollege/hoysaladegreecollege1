import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Users, Search } from "lucide-react";

export default function TeacherAttendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["all-students-for-attendance"],
    queryFn: async () => {
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, roll_number, user_id")
        .eq("is_active", true)
        .order("roll_number");
      if (!studentsData || studentsData.length === 0) return [];
      const userIds = studentsData.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      return studentsData.map((s) => ({
        ...s,
        profile: profiles?.find((p) => p.user_id === s.user_id),
      }));
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const records = Object.entries(statuses).map(([student_id, status]) => ({
        student_id, subject, date, status, marked_by: user!.id,
      }));
      if (records.length === 0) throw new Error("Please mark at least one student");
      const { error } = await supabase.from("attendance").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "✅ Attendance saved successfully!" });
      setStatuses({});
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleStatus = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: prev[id] === "present" ? "absent" : "present" }));
  };

  const markAll = (status: string) => {
    const all: Record<string, string> = {};
    students.forEach((s: any) => { all[s.id] = status; });
    setStatuses(all);
  };

  const filteredStudents = students.filter((s: any) => {
    const name = (s.profile?.full_name || s.roll_number || "").toLowerCase();
    return name.includes(search.toLowerCase()) || s.roll_number.toLowerCase().includes(search.toLowerCase());
  });

  const presentCount = Object.values(statuses).filter(s => s === "present").length;
  const absentCount = Object.values(statuses).filter(s => s === "absent").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Mark Attendance
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Select subject and date, then mark each student individually</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Subject *</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" className="rounded-xl" />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student..." className="pl-9 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Button size="sm" variant="outline" onClick={() => markAll("present")} className="rounded-xl font-body">✅ Mark All Present</Button>
          <Button size="sm" variant="outline" onClick={() => markAll("absent")} className="rounded-xl font-body">❌ Mark All Absent</Button>
          {Object.keys(statuses).length > 0 && (
            <div className="flex gap-2 ml-auto">
              <span className="text-xs font-body px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">Present: {presentCount}</span>
              <span className="text-xs font-body px-3 py-1.5 rounded-full bg-destructive/10 text-destructive font-semibold">Absent: {absentCount}</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading students...</p></div>
        ) : (
          <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-1">
            {filteredStudents.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{s.profile?.full_name || "Unnamed"}</p>
                  <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
                </div>
                <button onClick={() => toggleStatus(s.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-body font-semibold transition-all duration-200 ${
                  statuses[s.id] === "present" ? "bg-primary/15 text-primary shadow-sm" : statuses[s.id] === "absent" ? "bg-destructive/15 text-destructive shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                  {statuses[s.id] === "present" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {statuses[s.id] || "Not marked"}
                </button>
              </div>
            ))}
            {filteredStudents.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-6">No students found.</p>}
          </div>
        )}

        <Button className="mt-5 w-full rounded-xl font-body" disabled={!subject || Object.keys(statuses).length === 0 || submitMutation.isPending} onClick={() => submitMutation.mutate()}>
          {submitMutation.isPending ? "Saving..." : `Submit Attendance (${Object.keys(statuses).length} students)`}
        </Button>
      </div>
    </div>
  );
}
