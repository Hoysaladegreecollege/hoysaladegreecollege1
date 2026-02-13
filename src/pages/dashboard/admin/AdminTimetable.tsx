import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminTimetable() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", day_of_week: "Monday", period: "", subject: "", teacher_name: "", room: "" });

  const { data: entries = [] } = useQuery({
    queryKey: ["admin-timetable"],
    queryFn: async () => {
      const { data } = await supabase.from("timetables").select("*").order("day_of_week").order("period");
      return data || [];
    },
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("timetables").insert({
        title: form.title || `${form.day_of_week} - ${form.period}`,
        day_of_week: form.day_of_week,
        period: form.period,
        subject: form.subject,
        teacher_name: form.teacher_name,
        room: form.room,
        uploaded_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-timetable"] });
      toast.success("Timetable entry added");
      setForm({ title: "", day_of_week: "Monday", period: "", subject: "", teacher_name: "", room: "" });
    },
    onError: () => toast.error("Failed to add entry"),
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("timetables").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-timetable"] }); toast.success("Deleted"); },
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Timetable Management</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Upload timetable entries for students to view</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-body text-sm font-semibold text-foreground mb-4">Add Entry</h3>
        <form onSubmit={(e) => { e.preventDefault(); addEntry.mutate(); }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Day *</label>
            <select value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Period *</label>
            <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required placeholder="e.g. 9:00 - 10:00" className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Subject *</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Teacher</label>
            <input value={form.teacher_name} onChange={(e) => setForm({ ...form, teacher_name: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Room</label>
            <input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="font-body bg-primary text-primary-foreground w-full"><Plus className="w-4 h-4 mr-2" /> Add</Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-body text-sm font-semibold text-foreground mb-4">Current Timetable ({entries.length} entries)</h3>
        {days.map((day) => {
          const dayEntries = entries.filter((e: any) => e.day_of_week === day);
          if (dayEntries.length === 0) return null;
          return (
            <div key={day} className="mb-4">
              <h4 className="font-body text-xs font-bold text-primary mb-2">{day}</h4>
              <div className="space-y-1">
                {dayEntries.map((e: any) => (
                  <div key={e.id} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm font-body">
                    <span><strong>{e.period}</strong> — {e.subject} {e.teacher_name && `(${e.teacher_name})`} {e.room && `| Room: ${e.room}`}</span>
                    <button onClick={() => deleteEntry.mutate(e.id)} className="text-xs text-destructive hover:underline">Delete</button>
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
