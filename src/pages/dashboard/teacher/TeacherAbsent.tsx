import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Phone, MessageSquare } from "lucide-react";

export default function TeacherAbsent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [note, setNote] = useState("");
  const [remarks, setRemarks] = useState("");

  const { data: students = [] } = useQuery({
    queryKey: ["students-for-absent"],
    queryFn: async () => {
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, roll_number, parent_phone, user_id")
        .eq("is_active", true)
        .order("roll_number");
      if (!studentsData) return [];
      const userIds = studentsData.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", userIds);
      return studentsData.map((s) => ({
        ...s,
        profile: profiles?.find((p) => p.user_id === s.user_id),
      }));
    },
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["absent-notes"],
    queryFn: async () => {
      const { data: notesData } = await supabase
        .from("absent_notes")
        .select("*, students(roll_number, user_id)")
        .order("created_at", { ascending: false })
        .limit(20);
      if (!notesData) return [];
      const userIds = notesData.map((n: any) => n.students?.user_id).filter(Boolean);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      return notesData.map((n: any) => ({
        ...n,
        student_name: profiles?.find((p) => p.user_id === n.students?.user_id)?.full_name || n.students?.roll_number,
      }));
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("absent_notes").insert({
        student_id: selectedStudent, note, remarks, added_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Note added!" });
      setNote(""); setRemarks(""); setSelectedStudent("");
      queryClient.invalidateQueries({ queryKey: ["absent-notes"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const selectedStudentData = students.find((s: any) => s.id === selectedStudent);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Absent Students</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Add Absence Note</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Student</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select student</option>
              {students.map((s: any) => (
                <option key={s.id} value={s.id}>{s.profile?.full_name || s.roll_number} ({s.roll_number})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Parent Phone</label>
            <div className="flex items-center gap-2">
              <Input disabled value={selectedStudentData?.parent_phone || "-"} />
              {selectedStudent && selectedStudentData?.parent_phone && (
                <a href={`tel:${selectedStudentData.parent_phone}`} className="shrink-0">
                  <Button size="icon" variant="outline"><Phone className="w-4 h-4" /></Button>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Note</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for absence" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Remarks</label>
            <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Additional remarks (optional)" />
          </div>
          <Button disabled={!selectedStudent || !note || addNoteMutation.isPending} onClick={() => addNoteMutation.mutate()}>
            {addNoteMutation.isPending ? "Saving..." : "Add Note"}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Notes</h3>
        <div className="space-y-3">
          {notes.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No absence notes yet.</p>
          ) : notes.map((n: any) => (
            <div key={n.id} className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-3 h-3 text-primary" />
                <span className="font-body text-xs font-semibold text-foreground">{n.student_name}</span>
                <span className="font-body text-xs text-muted-foreground">• {n.date}</span>
              </div>
              <p className="font-body text-sm text-foreground">{n.note}</p>
              {n.remarks && <p className="font-body text-xs text-muted-foreground mt-1">Remark: {n.remarks}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
