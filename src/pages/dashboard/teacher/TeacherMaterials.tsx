import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, ExternalLink } from "lucide-react";

export default function TeacherMaterials() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const { data: courses = [] } = useQuery({
    queryKey: ["courses-list"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name").eq("is_active", true);
      return data || [];
    },
  });
  const [courseId, setCourseId] = useState("");

  const { data: materials = [] } = useQuery({
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
      const { error } = await supabase.from("study_materials").insert({
        title, subject, file_url: fileUrl, course_id: courseId || null, uploaded_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Material uploaded!" });
      setTitle(""); setSubject(""); setFileUrl(""); setCourseId("");
      queryClient.invalidateQueries({ queryKey: ["teacher-materials"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("study_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Material deleted" });
      queryClient.invalidateQueries({ queryKey: ["teacher-materials"] });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Study Materials</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Upload New Material</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="File URL (Google Drive, etc.)" />
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select Course (optional)</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Button disabled={!title || !subject || addMutation.isPending} onClick={() => addMutation.mutate()}>
          <Upload className="w-4 h-4 mr-1" /> {addMutation.isPending ? "Uploading..." : "Upload"}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">All Materials</h3>
        <div className="space-y-2">
          {materials.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No materials yet.</p>
          ) : materials.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="font-body text-sm font-medium text-foreground">{m.title}</p>
                <p className="font-body text-xs text-muted-foreground">{m.subject} • {m.courses?.name || "General"}</p>
              </div>
              <div className="flex gap-2">
                {m.file_url && <a href={m.file_url} target="_blank" rel="noopener noreferrer"><Button size="icon" variant="ghost"><ExternalLink className="w-4 h-4" /></Button></a>}
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
