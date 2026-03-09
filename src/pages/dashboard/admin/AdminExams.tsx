import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Trash2, Pencil, Calendar, BookOpen, X, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const EXAM_TYPES = ["internal", "external", "midterm", "final", "practical", "viva"];

export default function AdminExams() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", subject: "", exam_type: "internal", exam_date: "", course_id: "", semester: "1",
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true).order("name");
      return data || [];
    },
  });

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["admin-exams"],
    queryFn: async () => {
      const { data } = await supabase.from("exams").select("*, courses(name, code)").order("exam_date", { ascending: true });
      return data || [];
    },
  });

  const resetForm = () => {
    setForm({ title: "", subject: "", exam_type: "internal", exam_date: "", course_id: "", semester: "1" });
    setEditId(null);
    setShowForm(false);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        exam_type: form.exam_type,
        exam_date: form.exam_date,
        course_id: form.course_id || null,
        semester: parseInt(form.semester) || 1,
        created_by: user?.id,
        is_active: true,
      };
      if (!payload.title || !payload.subject || !payload.exam_date) throw new Error("Title, subject, and date are required");
      if (editId) {
        const { error } = await supabase.from("exams").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("exams").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "Exam updated" : "Exam added");
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("exams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Exam deleted");
      qc.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("exams").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-exams"] }),
  });

  const startEdit = (exam: any) => {
    setForm({
      title: exam.title,
      subject: exam.subject,
      exam_type: exam.exam_type,
      exam_date: exam.exam_date,
      course_id: exam.course_id || "",
      semester: String(exam.semester || 1),
    });
    setEditId(exam.id);
    setShowForm(true);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      internal: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      external: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      midterm: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      final: "bg-red-500/10 text-red-600 dark:text-red-400",
      practical: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      viva: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/admin">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Exam Management</h1>
            <p className="text-sm text-muted-foreground">Schedule and manage exams for the Exam Countdown widget</p>
          </div>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Exam
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{editId ? "Edit Exam" : "Add New Exam"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Semester 2 Internal Assessment" />
              </div>
              <div>
                <Label>Subject *</Label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Mathematics" />
              </div>
              <div>
                <Label>Exam Date *</Label>
                <Input type="date" value={form.exam_date} onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))} />
              </div>
              <div>
                <Label>Exam Type</Label>
                <Select value={form.exam_type} onValueChange={v => setForm(f => ({ ...f, exam_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {EXAM_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Course</Label>
                <Select value={form.course_id || "all"} onValueChange={v => setForm(f => ({ ...f, course_id: v === "all" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="All courses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.code})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={v => setForm(f => ({ ...f, semester: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map(s => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="gap-2">
                <Check className="h-4 w-4" /> {editId ? "Update" : "Save"}
              </Button>
              <Button variant="outline" onClick={resetForm}><X className="h-4 w-4 mr-1" /> Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : exams.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No exams scheduled</p>
          <p className="text-sm">Add exams so students can see the countdown on their dashboard.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {exams.map((exam: any) => {
            const isPast = new Date(exam.exam_date) < new Date();
            return (
              <Card key={exam.id} className={`${!exam.is_active ? "opacity-50" : ""} ${isPast ? "border-muted" : ""}`}>
                <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{exam.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(exam.exam_type)}`}>
                        {exam.exam_type}
                      </span>
                      {isPast && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Past</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {exam.subject}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {format(new Date(exam.exam_date), "dd MMM yyyy")}</span>
                      {exam.courses && <span>• {exam.courses.name}</span>}
                      <span>• Sem {exam.semester}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive.mutate({ id: exam.id, active: !exam.is_active })}>
                      {exam.is_active ? "Disable" : "Enable"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(exam)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
                      onClick={() => { if (confirm("Delete this exam?")) deleteMutation.mutate(exam.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
