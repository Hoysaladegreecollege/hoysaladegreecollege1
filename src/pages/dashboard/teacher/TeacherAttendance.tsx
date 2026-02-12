import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

export default function TeacherAttendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const { data: students = [] } = useQuery({
    queryKey: ["all-students-for-attendance"],
    queryFn: async () => {
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, roll_number, user_id")
        .eq("is_active", true)
        .order("roll_number");
      if (!studentsData) return [];
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
      const { error } = await supabase.from("attendance").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Attendance saved!" });
      setStatuses({});
      queryClient.invalidateQueries({ queryKey: ["all-students-for-attendance"] });
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

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Mark Attendance</h2>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => markAll("present")}>Mark All Present</Button>
          <Button size="sm" variant="outline" onClick={() => markAll("absent")}>Mark All Absent</Button>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {students.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{s.profile?.full_name || s.roll_number}</p>
                <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
              </div>
              <button onClick={() => toggleStatus(s.id)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-colors ${
                statuses[s.id] === "present" ? "bg-primary/10 text-primary" : statuses[s.id] === "absent" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
              }`}>
                {statuses[s.id] === "present" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {statuses[s.id] || "Not marked"}
              </button>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full" disabled={!subject || Object.keys(statuses).length === 0 || submitMutation.isPending} onClick={() => submitMutation.mutate()}>
          {submitMutation.isPending ? "Saving..." : "Submit Attendance"}
        </Button>
      </div>
    </div>
  );
}
