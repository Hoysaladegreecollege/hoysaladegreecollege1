import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Trash2, Award } from "lucide-react";

export default function PrincipalTopStudents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [rank, setRank] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [photoUrl, setPhotoUrl] = useState("");

  const { data: topStudents = [] } = useQuery({
    queryKey: ["top-students"],
    queryFn: async () => {
      const { data } = await supabase.from("top_students").select("*").order("rank");
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("top_students").insert({
        student_name: name, course, rank, year, photo_url: photoUrl, posted_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Top student added!" });
      setName(""); setCourse(""); setRank(1); setPhotoUrl("");
      queryClient.invalidateQueries({ queryKey: ["top-students"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("top_students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Removed" });
      queryClient.invalidateQueries({ queryKey: ["top-students"] });
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Top Students</h2>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Add Top Student</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Student Name" />
          <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course (e.g. BCA)" />
          <Input type="number" min={1} value={rank} onChange={(e) => setRank(Number(e.target.value))} placeholder="Rank" />
          <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
          <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="Photo URL (optional)" className="sm:col-span-2" />
        </div>
        <Button disabled={!name || !course || addMutation.isPending} onClick={() => addMutation.mutate()}>
          <Award className="w-4 h-4 mr-1" /> {addMutation.isPending ? "Adding..." : "Add Student"}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topStudents.map((s: any) => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-5 relative">
            <Button size="icon" variant="ghost" className="absolute top-2 right-2" onClick={() => deleteMutation.mutate(s.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="font-display text-lg font-bold text-secondary">#{s.rank}</span>
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{s.student_name}</p>
                <p className="font-body text-xs text-muted-foreground">{s.course} • {s.year}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
