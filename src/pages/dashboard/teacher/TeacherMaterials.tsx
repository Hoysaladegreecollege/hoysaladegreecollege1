import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Trash2, ExternalLink, FileText } from "lucide-react";

export default function TeacherMaterials() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: courses = [] } = useQuery({
    queryKey: ["courses-list"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name").eq("is_active", true);
      return data || [];
    },
  });
  const [courseId, setCourseId] = useState("");

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["teacher-materials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("study_materials")
        .select("*, courses(name)")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      let fileUrl = "";

      if (materialFile) {
        const ext = materialFile.name.split(".").pop();
        const path = `materials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, materialFile);
        if (uploadErr) throw new Error("Upload failed: " + uploadErr.message);
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        fileUrl = urlData.publicUrl;
      }

      if (!fileUrl) throw new Error("Please select a file to upload");

      const { error } = await supabase.from("study_materials").insert({
        title, subject, file_url: fileUrl, course_id: courseId || null, uploaded_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material uploaded!");
      setTitle(""); setSubject(""); setMaterialFile(null); setCourseId("");
      setUploading(false);
      queryClient.invalidateQueries({ queryKey: ["teacher-materials"] });
    },
    onError: (e: any) => { toast.error(e.message); setUploading(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("study_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material deleted");
      queryClient.invalidateQueries({ queryKey: ["teacher-materials"] });
    },
  });

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" /> Study Materials
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Upload PDFs, images, videos and other files for students</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">Upload New Material</h3>
        <form onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. DBMS Notes" className={inputClass} />
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Subject *</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="e.g. Database Management" className={inputClass} />
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course</label>
              <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className={inputClass}>
                <option value="">All Courses (General)</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground block mb-1.5 flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload File * (PDF, Images, Videos)
              </label>
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*,video/*" required
                onChange={(e) => setMaterialFile(e.target.files?.[0] || null)}
                className="w-full font-body text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer" />
              {materialFile && <p className="font-body text-xs text-muted-foreground mt-1">{materialFile.name}</p>}
            </div>
          </div>
          <Button type="submit" disabled={uploading || !title || !subject} className="rounded-xl font-body">
            {uploading ? "Uploading..." : <><Upload className="w-4 h-4 mr-2" /> Upload Material</>}
          </Button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-body text-sm font-bold text-foreground mb-4">All Materials ({materials.length})</h3>
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-14 bg-muted/50 rounded-xl animate-pulse" />)}</div>
        ) : materials.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground text-center py-6">No materials uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {materials.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-semibold text-foreground">{m.title}</p>
                  <p className="font-body text-xs text-muted-foreground">{m.subject} • {m.courses?.name || "General"}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {m.file_url && (
                    <a href={m.file_url} target="_blank" rel="noopener noreferrer">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"><ExternalLink className="w-4 h-4" /></button>
                    </a>
                  )}
                  <button onClick={() => { if (confirm("Delete this material?")) deleteMutation.mutate(m.id); }}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
