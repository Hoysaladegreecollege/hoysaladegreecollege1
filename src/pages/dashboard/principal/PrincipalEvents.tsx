import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Calendar } from "lucide-react";

export default function PrincipalEvents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");

  const { data: events = [] } = useQuery({
    queryKey: ["principal-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("events").insert({
        title, description, event_date: eventDate || null, category, image_url: imageUrl, posted_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Event posted!" });
      setTitle(""); setDescription(""); setEventDate(""); setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["principal-events"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Event deleted" });
      queryClient.invalidateQueries({ queryKey: ["principal-events"] });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Events & Gallery</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Post Event</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="General">General</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Academic">Academic</option>
          </select>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" />
        </div>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-4 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <Button disabled={!title || addMutation.isPending} onClick={() => addMutation.mutate()}>
          <Calendar className="w-4 h-4 mr-1" /> {addMutation.isPending ? "Posting..." : "Post Event"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {events.map((e: any) => (
          <div key={e.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-body text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{e.category}</span>
                <h4 className="font-display text-base font-bold text-foreground mt-2">{e.title}</h4>
                {e.event_date && <p className="font-body text-xs text-muted-foreground">{e.event_date}</p>}
                {e.description && <p className="font-body text-sm text-muted-foreground mt-1">{e.description}</p>}
              </div>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(e.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
