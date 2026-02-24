import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Image, Plus, Trash2, Edit2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["Campus", "Facilities", "Academics", "Events", "Sports", "Cultural", "Other"];

export default function AdminGallery() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Campus" });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("sort_order").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!file && !editingId) { toast.error("Please select an image"); return; }
    setUploading(true);
    try {
      let imageUrl = "";
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `gallery/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, file);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      if (editingId) {
        const updateData: any = { title: form.title, description: form.description, category: form.category };
        if (imageUrl) updateData.image_url = imageUrl;
        await supabase.from("gallery_images").update(updateData).eq("id", editingId);
        toast.success("Image updated!");
      } else {
        await supabase.from("gallery_images").insert({ title: form.title, description: form.description, category: form.category, image_url: imageUrl, posted_by: user?.id });
        toast.success("Image added to gallery!");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;
    await supabase.from("gallery_images").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    toast.success("Image deleted");
  };

  const handleEdit = (img: any) => {
    setForm({ title: img.title, description: img.description || "", category: img.category });
    setEditingId(img.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", category: "Campus" });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("gallery_images").update({ is_active: !active }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    toast.success(active ? "Image hidden" : "Image visible");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" /> Gallery Management
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1">Upload and manage gallery images for the website</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-xl font-body">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold">{editingId ? "Edit Image" : "Add New Image"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1 block">Title *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Campus Building" />
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1 block">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1 block">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Optional description" />
            </div>
            <div className="sm:col-span-2">
              <label className="font-body text-xs font-semibold text-muted-foreground mb-1 block">Image {editingId ? "(leave empty to keep current)" : "*"}</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border border-border rounded-xl px-3 py-2 font-body text-sm bg-background file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs" />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={uploading} className="mt-4 rounded-xl font-body">
            {uploading ? "Uploading..." : editingId ? "Update Image" : "Upload Image"}
          </Button>
        </div>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-display text-lg font-semibold text-muted-foreground">No gallery images yet</p>
          <p className="font-body text-sm text-muted-foreground/60 mt-1">Click "Add Image" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <div key={img.id} className={`relative group rounded-2xl border overflow-hidden ${img.is_active ? "border-border" : "border-destructive/30 opacity-60"}`}>
              <div className="aspect-[4/3]">
                <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/90 text-primary-foreground font-body font-bold">{img.category}</span>
                <p className="font-display text-sm font-bold text-white mt-1 truncate">{img.title}</p>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => handleEdit(img)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => toggleActive(img.id, img.is_active)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold font-body">{img.is_active ? "Hide" : "Show"}</button>
                  <button onClick={() => handleDelete(img.id)} className="p-1.5 rounded-lg bg-destructive/60 hover:bg-destructive/80 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              {!img.is_active && (
                <div className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-destructive/80 text-white font-body font-bold">Hidden</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
