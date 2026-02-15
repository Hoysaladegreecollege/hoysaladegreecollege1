import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Trash2, Image, Upload } from "lucide-react";

export default function AdminEvents() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", event_date: "", category: "General" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addEvent = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let image_url: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `events/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, imageFile);
        if (uploadErr) throw new Error("Image upload failed: " + uploadErr.message);
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const { error } = await supabase.from("events").insert({
        title: form.title,
        description: form.description,
        event_date: form.event_date || null,
        category: form.category,
        image_url,
        posted_by: user?.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["public-events"] });
      toast.success("Event posted! It will appear on the website.");
      setForm({ title: "", description: "", event_date: "", category: "General" });
      setImageFile(null);
      setUploading(false);
    },
    onError: (e: any) => { toast.error("Failed: " + e.message); setUploading(false); },
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
        <p className="font-body text-sm text-muted-foreground mt-1">Post events with images that appear on the website</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Post New Event</h3>
        <form onSubmit={(e) => { e.preventDefault(); if (!form.title) { toast.error("Title is required"); return; } if (!imageFile) { toast.error("Please upload an image or video"); return; } addEvent.mutate(); }} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} placeholder="Add event details..." />
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
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5 flex items-center gap-1">
              <Upload className="w-3 h-3" /> Upload Image / Video *
            </label>
            <input type="file" accept="image/*,video/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full font-body text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer" />
            {imageFile && <p className="font-body text-xs text-muted-foreground mt-1">Selected: {imageFile.name}</p>}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={uploading} className="font-body rounded-xl">
              {uploading ? "Uploading..." : <><Plus className="w-4 h-4 mr-2" /> Post Event</>}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">All Events ({events.length})</h3>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="space-y-3">
            {events.map((e: any) => (
              <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {e.image_url ? (
                    <img src={e.image_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0"><Image className="w-5 h-5 text-muted-foreground" /></div>
                  )}
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{e.title}</p>
                    <p className="font-body text-xs text-muted-foreground">{e.category} {e.event_date && `• ${new Date(e.event_date).toLocaleDateString()}`}</p>
                  </div>
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
        )}
      </div>
    </div>
  );
}
