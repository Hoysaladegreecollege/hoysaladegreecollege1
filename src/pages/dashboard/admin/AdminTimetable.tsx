import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const defaultPeriods = [
  "9:00 - 9:50", "9:50 - 10:40", "10:50 - 11:40", "11:40 - 12:30",
  "1:10 - 2:00", "2:00 - 2:50", "2:50 - 3:40"
];

export default function AdminTimetable() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [batchMode, setBatchMode] = useState(true);
  const [batchDay, setBatchDay] = useState("Monday");
  const [batchCourse, setBatchCourse] = useState("");
  const [batchEntries, setBatchEntries] = useState(
    defaultPeriods.map(p => ({ period: p, subject: "", teacher_name: "", room: "" }))
  );
  const [form, setForm] = useState({ title: "", day_of_week: "Monday", period: "", subject: "", teacher_name: "", room: "", course_filter: "All" });
  const [viewCourse, setViewCourse] = useState("All");

  const { data: courses = [] } = useQuery({
    queryKey: ["timetable-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
    },
  });

  const { data: entries = [] } = useQuery({
    queryKey: ["admin-timetable"],
    queryFn: async () => {
      const { data } = await supabase.from("timetables").select("*, courses(name, code)").order("day_of_week").order("period");
      return data || [];
    },
  });

  const addBatch = useMutation({
    mutationFn: async () => {
      const courseId = batchCourse || null;
      const records = batchEntries
        .filter(e => e.subject.trim())
        .map(e => ({
          title: `${batchDay} - ${e.period}`,
          day_of_week: batchDay,
          period: e.period,
          subject: e.subject,
          teacher_name: e.teacher_name,
          room: e.room,
          course_id: courseId,
          uploaded_by: user?.id,
        }));
      if (records.length === 0) throw new Error("Please fill at least one subject");
      const { error } = await supabase.from("timetables").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-timetable"] });
      toast.success(`${batchDay}'s timetable uploaded!`);
      setBatchEntries(defaultPeriods.map(p => ({ period: p, subject: "", teacher_name: "", room: "" })));
    },
    onError: (e: any) => toast.error(e.message),
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      const courseId = form.course_filter !== "All" ? form.course_filter : null;
      const { error } = await supabase.from("timetables").insert({
        title: form.title || `${form.day_of_week} - ${form.period}`,
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
      qc.invalidateQueries({ queryKey: ["admin-timetable"] });
      toast.success("Entry added");
      setForm({ ...form, period: "", subject: "", teacher_name: "", room: "" });
    },
    onError: () => toast.error("Failed"),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("timetables").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-timetable"] }); toast.success("Deleted"); },
  });

  const filteredEntries = viewCourse === "All" ? entries : entries.filter((e: any) => e.course_id === viewCourse);
  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold text-foreground">Timetable Management</h2>
        </div>
        <p className="font-body text-sm text-muted-foreground ml-11">Upload full day timetable or individual entries</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setBatchMode(true)} className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${batchMode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          📋 Full Day Upload
        </button>
        <button onClick={() => setBatchMode(false)} className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all ${!batchMode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
          ✏️ Single Entry
        </button>
      </div>

      {batchMode ? (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-body text-sm font-bold text-foreground mb-4">Upload Full Day Timetable</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Day *</label>
              <select value={batchDay} onChange={(e) => setBatchDay(e.target.value)} className={inputClass}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course *</label>
              <select value={batchCourse} onChange={(e) => setBatchCourse(e.target.value)} className={inputClass}>
                <option value="">All Courses (General)</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {batchEntries.map((entry, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center p-2 rounded-lg bg-muted/20">
                <input value={entry.period} onChange={(e) => {
                  const updated = [...batchEntries];
                  updated[i].period = e.target.value;
                  setBatchEntries(updated);
                }} placeholder="Period" className="border border-border rounded-lg px-2 py-2 font-body text-xs bg-background" />
                <input value={entry.subject} onChange={(e) => {
                  const updated = [...batchEntries];
                  updated[i].subject = e.target.value;
                  setBatchEntries(updated);
                }} placeholder="Subject *" className="border border-border rounded-lg px-2 py-2 font-body text-xs bg-background" />
                <input value={entry.teacher_name} onChange={(e) => {
                  const updated = [...batchEntries];
                  updated[i].teacher_name = e.target.value;
                  setBatchEntries(updated);
                }} placeholder="Teacher" className="border border-border rounded-lg px-2 py-2 font-body text-xs bg-background" />
                <input value={entry.room} onChange={(e) => {
                  const updated = [...batchEntries];
                  updated[i].room = e.target.value;
                  setBatchEntries(updated);
                }} placeholder="Room" className="border border-border rounded-lg px-2 py-2 font-body text-xs bg-background" />
              </div>
            ))}
          </div>
          <Button onClick={() => addBatch.mutate()} disabled={addBatch.isPending} className="mt-4 font-body rounded-xl">
            {addBatch.isPending ? "Uploading..." : <><Plus className="w-4 h-4 mr-2" /> Upload {batchDay}'s Timetable</>}
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-body text-sm font-bold text-foreground mb-4">Add Single Entry</h3>
          <form onSubmit={(e) => { e.preventDefault(); addEntry.mutate(); }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course</label>
              <select value={form.course_filter} onChange={(e) => setForm({ ...form, course_filter: e.target.value })} className={inputClass}>
                <option value="All">All Courses</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Day *</label>
              <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className={inputClass}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
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
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Room</label>
              <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <Button type="submit" className="font-body rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Entry</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <h3 className="font-body text-sm font-bold text-foreground">Current Timetable ({filteredEntries.length} entries)</h3>
          <select value={viewCourse} onChange={(e) => setViewCourse(e.target.value)} className="border border-border rounded-xl px-3 py-2 font-body text-xs bg-background">
            <option value="All">All Courses</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
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
                    <div className="flex-1">
                      <span className="font-body text-sm text-foreground">
                        <strong className="text-primary">{e.period}</strong> — {e.subject}
                        {e.teacher_name && <span className="text-muted-foreground"> ({e.teacher_name})</span>}
                        {e.room && <span className="text-muted-foreground"> | Room: {e.room}</span>}
                        {e.courses && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{e.courses.code}</span>}
                      </span>
                    </div>
                    <button onClick={() => deleteEntry.mutate(e.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filteredEntries.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-6">No entries found.</p>}
      </div>
    </div>
  );
}
