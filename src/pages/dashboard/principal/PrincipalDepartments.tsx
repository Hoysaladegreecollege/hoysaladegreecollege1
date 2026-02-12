import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Edit2, Save, X, Plus } from "lucide-react";

export default function PrincipalDepartments() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [adding, setAdding] = useState(false);
  const [newDept, setNewDept] = useState({ name: "", code: "", hod_name: "", description: "" });

  const { data: departments = [] } = useQuery({
    queryKey: ["principal-departments"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("*").order("name");
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("departments").insert(newDept);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Department added!" });
      setAdding(false);
      setNewDept({ name: "", code: "", hod_name: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["principal-departments"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("departments").update(editData).eq("id", editing!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Updated!" });
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["principal-departments"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">Departments</h2>
        <Button size="sm" onClick={() => setAdding(!adding)}><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>

      {adding && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <Input value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} placeholder="Department Name" />
            <Input value={newDept.code} onChange={(e) => setNewDept({ ...newDept, code: e.target.value })} placeholder="Code (e.g. CS)" />
            <Input value={newDept.hod_name} onChange={(e) => setNewDept({ ...newDept, hod_name: e.target.value })} placeholder="HOD Name" />
            <Input value={newDept.description} onChange={(e) => setNewDept({ ...newDept, description: e.target.value })} placeholder="Description" />
          </div>
          <Button disabled={!newDept.name || !newDept.code || addMutation.isPending} onClick={() => addMutation.mutate()}>
            {addMutation.isPending ? "Adding..." : "Add Department"}
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {departments.map((d: any) => (
          <div key={d.id} className="bg-card border border-border rounded-xl p-5">
            {editing === d.id ? (
              <div>
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <Input value={editData.hod_name} onChange={(e) => setEditData({ ...editData, hod_name: e.target.value })} placeholder="HOD Name" />
                  <Input value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} placeholder="Description" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateMutation.mutate()}><Save className="w-3 h-3 mr-1" /> Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(null)}><X className="w-3 h-3" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">{d.name}</h3>
                  <p className="font-body text-xs text-muted-foreground">{d.code} • HOD: {d.hod_name || "-"}</p>
                  {d.description && <p className="font-body text-sm text-muted-foreground mt-1">{d.description}</p>}
                </div>
                <Button size="sm" variant="outline" onClick={() => { setEditing(d.id); setEditData({ hod_name: d.hod_name, description: d.description }); }}>
                  <Edit2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
