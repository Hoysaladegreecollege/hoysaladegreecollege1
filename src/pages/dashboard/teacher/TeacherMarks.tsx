import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

export default function TeacherMarks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("internal");
  const [semester, setSemester] = useState(1);
  const [maxMarks, setMaxMarks] = useState(100);
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});

  const { data: students = [] } = useQuery({
    queryKey: ["students-for-marks"],
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
      const records = Object.entries(marksMap).map(([student_id, obtained_marks]) => ({
        student_id, subject, exam_type: examType, semester, max_marks: maxMarks, obtained_marks, uploaded_by: user!.id,
      }));
      const { error } = await supabase.from("marks").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Marks uploaded!" });
      setMarksMap({});
      queryClient.invalidateQueries({ queryKey: ["students-for-marks"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Upload Marks</h2>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. DBMS" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Exam Type</label>
            <select value={examType} onChange={(e) => setExamType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="internal">Internal</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Semester</label>
            <Input type="number" min={1} max={6} value={semester} onChange={(e) => setSemester(Number(e.target.value))} />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Max Marks</label>
            <Input type="number" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} />
          </div>
        </div>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {students.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-foreground truncate">{s.profile?.full_name || s.roll_number}</p>
                <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
              </div>
              <Input type="number" min={0} max={maxMarks} className="w-24" placeholder="Marks"
                value={marksMap[s.id] ?? ""} onChange={(e) => setMarksMap({ ...marksMap, [s.id]: Number(e.target.value) })} />
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full" disabled={!subject || Object.keys(marksMap).length === 0 || submitMutation.isPending} onClick={() => submitMutation.mutate()}>
          {submitMutation.isPending ? "Uploading..." : "Upload Marks"}
        </Button>
      </div>
    </div>
  );
}
