import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Trash2 } from "lucide-react";

export default function AdminTopRankers() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ student_name: "", course: "", rank: "1", year: "2024-25", photo_url: "" });

  const { data: rankers = [] } = useQuery({
    queryKey: ["admin-top-rankers"],
    queryFn: async () => {
      const { data } = await supabase.from("top_students").select("*").order("rank");
      return data || [];
    },
  });

  const addRanker = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("top_students").insert({
        student_name: form.student_name,
        course: form.course,
        rank: parseInt(form.rank),
        year: form.year,
        photo_url: form.photo_url || null,
        posted_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-top-rankers"] });
      toast.success("Top ranker added! Will appear on Achievements page.");
      setForm({ student_name: "", course: "", rank: "1", year: "2024-25", photo_url: "" });
    },
    onError: () => toast.error("Failed to add ranker"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("top_students").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-top-rankers"] }); toast.success("Updated"); },
  });

  const deleteRanker = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("top_students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-top-rankers"] }); toast.success("Deleted"); },
  });

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" /> Upload Top Rankers
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Add top rank holders — they appear automatically on the Achievements page</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Add New Ranker</h3>
        <form onSubmit={(e) => { e.preventDefault(); addRanker.mutate(); }} className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Student Name *</label>
            <input value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course & Percentage *</label>
            <input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} required placeholder="e.g. B.Com - 98.14%" className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Rank *</label>
            <input type="number" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Year / Batch *</label>
            <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Photo URL (optional)</label>
            <input value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} placeholder="https://..." className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="font-body rounded-xl"><Plus className="w-4 h-4 mr-2" /> Add Ranker</Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Current Top Rankers ({rankers.length})</h3>
        {rankers.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-6">No rankers added yet.</p>
        ) : (
          <div className="space-y-3">
            {rankers.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:shadow-md transition-all group">
                <div className="flex items-center gap-3">
                  {r.photo_url ? (
                    <img src={r.photo_url} alt={r.student_name} className="w-12 h-12 rounded-xl object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center"><Trophy className="w-5 h-5 text-secondary" /></div>
                  )}
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">#{r.rank} {r.student_name}</p>
                    <p className="font-body text-xs text-muted-foreground">{r.course} • {r.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive.mutate({ id: r.id, active: !r.is_active })} className={`text-xs px-3 py-1.5 rounded-xl font-body font-semibold ${r.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {r.is_active ? "Active" : "Hidden"}
                  </button>
                  <button onClick={() => { if (confirm("Delete?")) deleteRanker.mutate(r.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
