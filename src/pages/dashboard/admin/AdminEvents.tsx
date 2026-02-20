import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Trash2, Image, Upload, ArrowLeft, Eye, EyeOff, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["General", "Cultural", "Sports", "Academic", "Workshop", "Seminar", "NSS", "Placement"];
const categoryColors: Record<string, string> = {
  General: "bg-muted text-muted-foreground",
  Cultural: "bg-purple-100 text-purple-700",
  Sports: "bg-primary/10 text-primary",
  Academic: "bg-secondary/15 text-secondary-foreground",
  Workshop: "bg-amber-100 text-amber-700",
  Seminar: "bg-indigo-100 text-indigo-700",
  NSS: "bg-emerald-100 text-emerald-700",
  Placement: "bg-rose-100 text-rose-700",
};

export default function AdminEvents() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", event_date: "", category: "General" });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
      const uploadedUrls: string[] = [];
      for (const file of imageFiles) {
        const ext = file.name.split(".").pop();
        const path = `events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, file);
        if (uploadErr) throw new Error("Upload failed: " + uploadErr.message);
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }
      const image_url = uploadedUrls[0] || null;
      let description = form.description || "";
      if (uploadedUrls.length > 1) description += `\n\n---gallery---\n${uploadedUrls.join("\n")}`;
      const { error } = await supabase.from("events").insert({ title: form.title, description, event_date: form.event_date || null, category: form.category, image_url, posted_by: user?.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["public-events"] });
      toast.success("Event posted! It will appear on the website.");
      setForm({ title: "", description: "", event_date: "", category: "General" });
      setImageFiles([]); setUploading(false);
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

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-secondary/10 via-card to-primary/8 border border-border rounded-2xl p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="flex items-center gap-3">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" /> Events Management
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">Post events with images/videos — they appear on the website</p>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-foreground mb-5 flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" /> Post New Event
        </h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!form.title) { toast.error("Title is required"); return; }
          if (imageFiles.length === 0) { toast.error("Please upload at least one image/video"); return; }
          addEvent.mutate();
        }} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Event Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Enter event title" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className={`${inputClass} resize-none`} placeholder="Add event description and details..." />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Event Date</label>
            <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5 flex items-center gap-1"><Tag className="w-3 h-3" /> Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs font-semibold text-foreground block mb-1.5 flex items-center gap-1">
              <Upload className="w-3 h-3" /> Upload Images / Videos * (Multiple allowed)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <input type="file" accept="image/*,video/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                className="w-full font-body text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer" />
              {imageFiles.length > 0 ? (
                <p className="font-body text-xs text-primary mt-2 font-semibold">✓ {imageFiles.length} file(s) selected</p>
              ) : (
                <p className="font-body text-xs text-muted-foreground mt-2">Select images or videos from your device</p>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={uploading} className="font-body rounded-xl shadow-md hover:shadow-lg transition-all">
              {uploading ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</span>
              ) : <><Plus className="w-4 h-4 mr-2" /> Post Event</>}
            </Button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="font-display text-sm font-bold text-foreground mb-5">All Events ({events.length})</h3>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((e: any, i: number) => (
              <div key={e.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:shadow-md transition-all duration-300 group" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {e.image_url ? (
                    <img src={e.image_url} alt="" className="w-16 h-16 rounded-xl object-cover border border-border shadow-sm shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Image className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-body text-sm font-bold text-foreground truncate">{e.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-body font-bold ${categoryColors[e.category] || categoryColors.General}`}>{e.category}</span>
                      {e.event_date && <span className="font-body text-[10px] text-muted-foreground">{new Date(e.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive.mutate({ id: e.id, active: !e.is_active })}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-body font-semibold transition-colors ${e.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {e.is_active ? <><Eye className="w-3 h-3" /> Active</> : <><EyeOff className="w-3 h-3" /> Hidden</>}
                  </button>
                  <button onClick={() => { if (confirm("Delete this event?")) deleteEvent.mutate(e.id); }}
                    className="p-1.5 rounded-xl hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="font-body text-sm text-muted-foreground">No events posted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
