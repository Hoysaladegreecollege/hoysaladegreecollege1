import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, Edit2, UserX, UserCheck } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const emptyForm = { employee_id: "", qualification: "", experience: "", department_id: "", user_id: "" };

export default function PrincipalTeachers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("id, name").eq("is_active", true);
      return data || [];
    },
  });

  const { data: allProfiles = [] } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, full_name, email");
      return data || [];
    },
  });

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["principal-teachers"],
    queryFn: async () => {
      const { data: teachersData } = await supabase
        .from("teachers")
        .select("*, departments(name)")
        .order("employee_id");
      if (!teachersData) return [];
      const userIds = teachersData.map((t) => t.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, phone").in("user_id", userIds);
      return teachersData.map((t) => ({
        ...t,
        profile: profiles?.find((p) => p.user_id === t.user_id),
      }));
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editId) {
        const { error } = await supabase.from("teachers").update({
          employee_id: data.employee_id,
          qualification: data.qualification,
          experience: data.experience,
          department_id: data.department_id || null,
        }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("teachers").insert({
          user_id: data.user_id,
          employee_id: data.employee_id,
          qualification: data.qualification,
          experience: data.experience,
          department_id: data.department_id || null,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: editId ? "Teacher updated!" : "Teacher added!" });
      queryClient.invalidateQueries({ queryKey: ["principal-teachers"] });
      resetForm();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("teachers").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Status updated!" });
      queryClient.invalidateQueries({ queryKey: ["principal-teachers"] });
    },
  });

  const resetForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

  const startEdit = (t: any) => {
    setEditId(t.id);
    setForm({ employee_id: t.employee_id, qualification: t.qualification || "", experience: t.experience || "", department_id: t.department_id || "", user_id: t.user_id });
    setShowForm(true);
  };

  const filtered = teachers.filter((t: any) => {
    const name = (t.profile?.full_name || t.employee_id).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Teachers</h2>
        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="font-body"><Plus className="w-4 h-4 mr-1" /> Add Teacher</Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-display text-lg font-bold text-foreground">{editId ? "Edit Teacher" : "Add New Teacher"}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {!editId && (
              <div>
                <label className="font-body text-sm font-medium text-foreground block mb-1">User Account *</label>
                <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background">
                  <option value="">Select user</option>
                  {allProfiles.map((p: any) => (
                    <option key={p.user_id} value={p.user_id}>{p.full_name} ({p.email})</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">Employee ID *</label>
              <Input value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">Department</label>
              <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background">
                <option value="">Select</option>
                {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">Qualification</label>
              <Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-foreground block mb-1">Experience</label>
              <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="font-body">
              {saveMutation.isPending ? "Saving..." : editId ? "Update" : "Add Teacher"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="font-body">Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-body text-xs text-muted-foreground p-3">Emp ID</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Name</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Department</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Qualification</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Status</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t: any) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="font-body text-sm p-3 font-medium">{t.employee_id}</td>
                <td className="font-body text-sm p-3">{t.profile?.full_name || "-"}</td>
                <td className="font-body text-sm p-3">{t.departments?.name || "-"}</td>
                <td className="font-body text-sm p-3">{t.qualification || "-"}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold ${t.is_active ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                    {t.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => startEdit(t)} className="text-primary hover:text-primary/80"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => toggleActive.mutate({ id: t.id, active: !t.is_active })} className={t.is_active ? "text-red-500" : "text-green-500"}>
                    {t.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center font-body text-sm text-muted-foreground p-6">{isLoading ? "Loading..." : "No teachers found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
