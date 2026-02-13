import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Trash2, Image, Link as LinkIcon } from "lucide-react";

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

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast.success("Deleted"); },
  });

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" /> Events Management
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Post events, images, and links that appear on the website</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Post New Event</h3>
        <form onSubmit={(e) => { e.preventDefault(); addEvent.mutate(); }} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Description (text, links, etc.)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} placeholder="Add event details, links, video URLs, etc." />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Date</label>
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
              {["General", "Cultural", "Sports", "Academic", "Workshop", "Seminar", "NSS", "Placement"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5 flex items-center gap-1"><Image className="w-3 h-3" /> Image / Video URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Paste image URL, YouTube link, etc." className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="font-body rounded-xl"><Plus className="w-4 h-4 mr-2" /> Post Event</Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">All Events ({events.length})</h3>
        <div className="space-y-3">
          {events.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:shadow-md transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-body text-sm font-semibold text-foreground">{e.title}</p>
                  {e.image_url && <LinkIcon className="w-3 h-3 text-primary" />}
                </div>
                <p className="font-body text-xs text-muted-foreground">{e.category} {e.event_date && `• ${new Date(e.event_date).toLocaleDateString()}`}</p>
                {e.description && <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-1">{e.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive.mutate({ id: e.id, active: !e.is_active })} className={`text-xs px-3 py-1.5 rounded-xl font-body font-semibold transition-colors ${e.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {e.is_active ? "Active" : "Hidden"}
                </button>
                <button onClick={() => { if (confirm("Delete this event?")) deleteEvent.mutate(e.id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-6">No events posted yet.</p>}
        </div>
      </div>
    </div>
  );
}
