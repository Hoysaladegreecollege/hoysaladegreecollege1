import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";

export default function AdminEvents() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", event_date: "", category: "General", image_url: "" });

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("events").insert({
        title: form.title,
        description: form.description,
        event_date: form.event_date || null,
        category: form.category,
        image_url: form.image_url || null,
        posted_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event posted! It will appear on the website.");
      setForm({ title: "", description: "", event_date: "", category: "General", image_url: "" });
    },
    onError: () => toast.error("Failed to post event"),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("events").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast.success("Updated"); },
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-secondary" /> Events Management</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Post events that appear on the main website</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-body text-sm font-semibold text-foreground mb-4">Post New Event</h3>
        <form onSubmit={(e) => { e.preventDefault(); addEvent.mutate(); }} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-medium text-foreground block mb-1">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-medium text-foreground block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Date</label>
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-foreground block mb-1">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
              {["General", "Cultural", "Sports", "Academic", "Workshop"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-medium text-foreground block mb-1">Image URL (optional)</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="font-body bg-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" /> Post Event</Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-body text-sm font-semibold text-foreground mb-4">All Events ({events.length})</h3>
        <div className="space-y-3">
          {events.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{e.title}</p>
                <p className="font-body text-xs text-muted-foreground">{e.category} {e.event_date && `• ${new Date(e.event_date).toLocaleDateString()}`}</p>
              </div>
              <button onClick={() => toggleActive.mutate({ id: e.id, active: !e.is_active })} className={`text-xs px-3 py-1 rounded-full font-body ${e.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                {e.is_active ? "Active" : "Hidden"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
