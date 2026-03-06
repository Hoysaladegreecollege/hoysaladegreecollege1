import { useState } from "react";
import { ArrowLeft, Monitor, Save, Edit2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDepartments() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", hod_name: "", description: "" });

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["admin-departments"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("*").order("name");
      return data || [];
    },
  });

  const handleEdit = (dept: any) => {
    setEditing(dept.id);
    setForm({ name: dept.name, code: dept.code, hod_name: dept.hod_name || "", description: dept.description || "" });
  };

  const handleSave = async () => {
    if (!editing) return;
    const { error } = await supabase.from("departments").update({
      name: form.name, code: form.code, hod_name: form.hod_name, description: form.description,
    }).eq("id", editing);
    if (error) { toast.error("Failed: " + error.message); return; }
    toast.success("Department updated!");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["admin-departments"] });
  };

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6">
        <div className="relative flex items-center gap-3">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Manage Departments</h2>
            <p className="font-body text-sm text-muted-foreground">Edit department details visible on the main website</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No departments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {departments.map((dept: any) => (
            <div key={dept.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {editing === dept.id ? (
                <div className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Department Name</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Code</label>
                      <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">HOD Name</label>
                      <input value={form.hod_name} onChange={e => setForm(f => ({ ...f, hod_name: e.target.value }))} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground mb-1 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className={inputClass} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="gap-1.5 text-xs"><Save className="w-3.5 h-3.5" /> Save</Button>
                    <Button variant="outline" onClick={() => setEditing(null)} className="text-xs">Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{dept.code}</span>
                      <span className={`font-body text-[10px] px-2 py-0.5 rounded-full font-bold ${dept.is_active ? "bg-emerald-500/10 text-emerald-600" : "bg-destructive/10 text-destructive"}`}>
                        {dept.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{dept.name}</h3>
                    {dept.hod_name && <p className="font-body text-sm text-muted-foreground mt-1">HOD: <span className="font-semibold text-foreground">{dept.hod_name}</span></p>}
                    {dept.description && <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{dept.description}</p>}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(dept)} className="gap-1.5 text-xs shrink-0">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
