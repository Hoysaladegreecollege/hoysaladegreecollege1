import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Pin } from "lucide-react";

export default function TeacherNotices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("General");

  const { data: notices = [] } = useQuery({
    queryKey: ["teacher-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notices").insert({ title, content, type, posted_by: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Notice posted!" });
      setTitle(""); setContent(""); setType("General");
      queryClient.invalidateQueries({ queryKey: ["teacher-notices"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Notice deleted" });
      queryClient.invalidateQueries({ queryKey: ["teacher-notices"] });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Notices</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Post Notice</h3>
        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Notice content" rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
          </select>
          <Button disabled={!title || !content || addMutation.isPending} onClick={() => addMutation.mutate()}>
            {addMutation.isPending ? "Posting..." : "Post Notice"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notices.map((n: any) => (
          <div key={n.id} className={`bg-card border rounded-xl p-5 ${n.is_pinned ? "border-secondary" : "border-border"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {n.is_pinned && <Pin className="w-3 h-3 text-secondary" />}
                  <span className="font-body text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{n.type}</span>
                  <span className="font-body text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-display text-base font-bold text-foreground">{n.title}</h4>
                <p className="font-body text-sm text-muted-foreground mt-1">{n.content}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(n.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
