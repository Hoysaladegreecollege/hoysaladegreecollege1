import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit2, Save, X } from "lucide-react";

export default function PrincipalCourses() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const { data: courses = [] } = useQuery({
    queryKey: ["principal-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*, departments(name)").order("name");
      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("courses").update({
        fee: editData.fee,
        duration: editData.duration,
        eligibility: editData.eligibility,
        overview: editData.overview,
      }).eq("id", editing!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course updated!" });
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["principal-courses"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (c: any) => {
    setEditing(c.id);
    setEditData({ fee: c.fee, duration: c.duration, eligibility: c.eligibility, overview: c.overview });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Courses & Fees</h2>

      <div className="space-y-4">
        {courses.map((c: any) => (
          <div key={c.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{c.name}</h3>
                <p className="font-body text-xs text-muted-foreground">{c.code} • {c.departments?.name}</p>
              </div>
              {editing === c.id ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>
                    <Save className="w-3 h-3 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="w-3 h-3" /></Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => startEdit(c)}><Edit2 className="w-3 h-3 mr-1" /> Edit</Button>
              )}
            </div>

            {editing === c.id ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Fee</label>
                  <Input value={editData.fee} onChange={(e) => setEditData({ ...editData, fee: e.target.value })} />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Duration</label>
                  <Input value={editData.duration} onChange={(e) => setEditData({ ...editData, duration: e.target.value })} />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Eligibility</label>
                  <Input value={editData.eligibility} onChange={(e) => setEditData({ ...editData, eligibility: e.target.value })} />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Overview</label>
                  <Input value={editData.overview} onChange={(e) => setEditData({ ...editData, overview: e.target.value })} />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-body text-xs text-muted-foreground">Fee</p>
                  <p className="font-body text-sm font-medium text-foreground">{c.fee || "-"}</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-body text-xs text-muted-foreground">Duration</p>
                  <p className="font-body text-sm font-medium text-foreground">{c.duration || "-"}</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-body text-xs text-muted-foreground">Eligibility</p>
                  <p className="font-body text-sm font-medium text-foreground">{c.eligibility || "-"}</p>
                </div>
                <div className="p-2 rounded bg-muted/50">
                  <p className="font-body text-xs text-muted-foreground">Overview</p>
                  <p className="font-body text-sm font-medium text-foreground">{c.overview || "-"}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
