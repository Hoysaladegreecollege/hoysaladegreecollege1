import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Search, Trash2, Edit3, X, Save, Users } from "lucide-react";

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "" });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("*");
      const { data: profiles } = await supabase.from("profiles").select("*");
      if (!roles || !profiles) return [];
      return profiles.map((p) => ({
        ...p,
        role: roles.find((r) => r.user_id === p.user_id)?.role || "student",
        role_id: roles.find((r) => r.user_id === p.user_id)?.id,
      }));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase.from("user_roles").update({ role: newRole as any }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Role updated!" }); queryClient.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, full_name, phone }: { userId: string; full_name: string; phone: string }) => {
      const { error } = await supabase.from("profiles").update({ full_name, phone }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Profile updated!" }); queryClient.invalidateQueries({ queryKey: ["admin-users"] }); setEditingId(null); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Delete from user_roles and profiles (auth user stays but has no access)
      await supabase.from("user_roles").delete().eq("user_id", userId);
      await supabase.from("students").delete().eq("user_id", userId);
      await supabase.from("teachers").delete().eq("user_id", userId);
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "User removed!" }); queryClient.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (u: any) => {
    setEditingId(u.user_id);
    setEditForm({ full_name: u.full_name || "", phone: u.phone || "" });
  };

  const filtered = users.filter((u: any) => {
    const name = (u.full_name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> User Management
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">{users.length} registered users</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Name</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Email</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Phone</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Role</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    {editingId === u.user_id ? (
                      <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="h-8 text-sm" />
                    ) : (
                      <span className="font-body text-sm font-medium text-foreground">{u.full_name || "—"}</span>
                    )}
                  </td>
                  <td className="font-body text-sm p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4">
                    {editingId === u.user_id ? (
                      <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="h-8 text-sm" />
                    ) : (
                      <span className="font-body text-sm text-foreground">{u.phone || "—"}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => updateRoleMutation.mutate({ userId: u.user_id, newRole: e.target.value })}
                      className="flex h-8 rounded-lg border border-input bg-background px-2 py-1 text-xs font-body focus:ring-2 focus:ring-primary/30 focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="principal">Principal</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      {editingId === u.user_id ? (
                        <>
                          <button onClick={() => updateProfileMutation.mutate({ userId: u.user_id, ...editForm })} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"><Save className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm("Are you sure you want to delete this user?")) deleteUserMutation.mutate(u.user_id); }} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center font-body text-sm text-muted-foreground p-8">{isLoading ? "Loading..." : "No users found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
