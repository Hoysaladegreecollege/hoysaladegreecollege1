import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Trash2 } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherTimetable() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ day_of_week: "Monday", period: "", subject: "", teacher_name: "", room: "", course_filter: "All" });

  const { data: courses = [] } = useQuery({
    queryKey: ["timetable-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
    },
  });

  const { data: entries = [] } = useQuery({
    queryKey: ["teacher-timetable"],
    queryFn: async () => {
      const { data } = await supabase.from("timetables").select("*, courses(name, code)").order("day_of_week").order("period");
      return data || [];
    },
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      const courseId = form.course_filter !== "All" ? form.course_filter : null;
      const { error } = await supabase.from("timetables").insert({
        title: `${form.day_of_week} - ${form.period}`,
        day_of_week: form.day_of_week,
        period: form.period,
        subject: form.subject,
        teacher_name: form.teacher_name,
        room: form.room,
        course_id: courseId,
        uploaded_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["teacher-timetable"] });
      toast.success("Timetable entry added");
      setForm({ ...form, period: "", subject: "", teacher_name: "", room: "" });
    },
    onError: () => toast.error("Failed to add entry"),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("timetables").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teacher-timetable"] }); toast.success("Deleted"); },
  });

  const [viewCourse, setViewCourse] = useState("All");
  const filteredEntries = viewCourse === "All" ? entries : entries.filter((e: any) => e.course_id === viewCourse);
  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> Timetable Management
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Upload and manage class schedules</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Add Entry</h3>
        <form onSubmit={(e) => { e.preventDefault(); addEntry.mutate(); }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course</label>
            <select value={form.course_filter} onChange={(e) => setForm({ ...form, course_filter: e.target.value })} className={inputClass}>
              <option value="All">All (General)</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Day *</label>
            <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className={inputClass}>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Period *</label>
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required placeholder="e.g. 9:00 - 10:00" className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Subject *</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Teacher</label>
            <input value={form.teacher_name} onChange={(e) => setForm({ ...form, teacher_name: e.target.value })} className={inputClass} />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full font-body rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add</Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h3 className="font-body text-sm font-bold text-foreground">Current Timetable ({filteredEntries.length})</h3>
          <select value={viewCourse} onChange={(e) => setViewCourse(e.target.value)} className="border border-border rounded-xl px-3 py-2 font-body text-xs bg-background">
            <option value="All">All Courses</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {days.map((day) => {
          const dayEntries = filteredEntries.filter((e: any) => e.day_of_week === day);
          if (dayEntries.length === 0) return null;
          return (
            <div key={day} className="mb-5">
              <h4 className="font-display text-xs font-bold text-primary mb-2 uppercase tracking-wider">{day}</h4>
              <div className="space-y-1.5">
                {dayEntries.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                    <span className="font-body text-sm"><strong className="text-primary">{e.period}</strong> — {e.subject} {e.teacher_name && `(${e.teacher_name})`} {e.courses && <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{e.courses.code}</span>}</span>
                    <button onClick={() => deleteEntry.mutate(e.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
