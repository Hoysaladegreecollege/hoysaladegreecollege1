import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Pin } from "lucide-react";

export default function PrincipalNotices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("General");
  const [isPinned, setIsPinned] = useState(false);

  const { data: notices = [] } = useQuery({
    queryKey: ["principal-notices"],
    queryFn: async () => {
      const { data } = await supabase.from("notices").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("notices").insert({ title, content, type, is_pinned: isPinned, posted_by: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Notice published!" });
      setTitle(""); setContent(""); setType("General"); setIsPinned(false);
      queryClient.invalidateQueries({ queryKey: ["principal-notices"] });
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
      queryClient.invalidateQueries({ queryKey: ["principal-notices"] });
    },
  });

  const togglePin = useMutation({
    mutationFn: async ({ id, pinned }: { id: string; pinned: boolean }) => {
      const { error } = await supabase.from("notices").update({ is_pinned: !pinned }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["principal-notices"] }),
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Notices</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Publish Notice</h3>
        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          <div className="flex gap-4 items-center">
            <select value={type} onChange={(e) => setType(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="General">General</option>
              <option value="Academic">Academic</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
              <option value="Urgent">Urgent</option>
            </select>
            <label className="flex items-center gap-2 font-body text-sm">
              <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded" />
              Pin to top
            </label>
          </div>
          <Button disabled={!title || !content || addMutation.isPending} onClick={() => addMutation.mutate()}>
            {addMutation.isPending ? "Publishing..." : "Publish Notice"}
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
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => togglePin.mutate({ id: n.id, pinned: n.is_pinned })}>
                  <Pin className={`w-4 h-4 ${n.is_pinned ? "text-secondary" : "text-muted-foreground"}`} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(n.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
