import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BarChart3 } from "lucide-react";

export default function TeacherMarks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("internal");
  const [semester, setSemester] = useState(1);
  const [maxMarks, setMaxMarks] = useState(100);
  const [courseFilter, setCourseFilter] = useState("all");
  const [marksMap, setMarksMap] = useState<Record<string, number>>({});

  const { data: courses = [] } = useQuery({
    queryKey: ["teacher-courses-marks"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
    },
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students-for-marks", courseFilter, semester],
    queryFn: async () => {
      let query = supabase.from("students").select("id, roll_number, user_id, course_id, semester").eq("is_active", true).order("roll_number");
      if (courseFilter !== "all") query = query.eq("course_id", courseFilter);
      query = query.eq("semester", semester);
      const { data: studentsData } = await query;
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
      const records = Object.entries(marksMap)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([student_id, obtained_marks]) => ({
          student_id, subject, exam_type: examType, semester, max_marks: maxMarks, obtained_marks, uploaded_by: user!.id,
        }));
      if (records.length === 0) throw new Error("Enter marks for at least one student");
      const { error } = await supabase.from("marks").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Marks uploaded!");
      setMarksMap({});
    },
    onError: (e: any) => toast.error(e.message),
  });

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" /> Upload Marks
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Upload student marks by course and semester</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course *</label>
            <select value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setMarksMap({}); }} className={inputClass}>
              <option value="all">All Courses</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Semester *</label>
            <select value={semester} onChange={(e) => { setSemester(Number(e.target.value)); setMarksMap({}); }} className={inputClass}>
              {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Subject *</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. DBMS" className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Exam Type</label>
            <select value={examType} onChange={(e) => setExamType(e.target.value)} className={inputClass}>
              <option value="internal">Internal</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Max Marks</label>
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} className={inputClass} />
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {students.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-8">No students found for the selected course/semester.</p>
          ) : students.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-foreground truncate">{s.profile?.full_name || s.roll_number}</p>
                <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
              </div>
              <Input type="number" min={0} max={maxMarks} className="w-24 rounded-xl" placeholder="Marks"
                value={marksMap[s.id] ?? ""} onChange={(e) => setMarksMap({ ...marksMap, [s.id]: Number(e.target.value) })} />
            </div>
          ))}
        </div>

        <Button className="mt-4 w-full rounded-xl font-body" disabled={!subject || Object.keys(marksMap).length === 0 || submitMutation.isPending} onClick={() => submitMutation.mutate()}>
          {submitMutation.isPending ? "Uploading..." : "Upload Marks"}
        </Button>
      </div>
    </div>
  );
}
