import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, CheckCircle, XCircle, FileText, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data } = await supabase.from("admission_applications").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("admission_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast({ title: "Application updated!" }); queryClient.invalidateQueries({ queryKey: ["admin-applications"] }); setSelected(null); },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = apps.filter((a: any) =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === "approved" ? "text-primary bg-primary/10" : s === "rejected" ? "text-destructive bg-destructive/10" : "text-secondary bg-secondary/10";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Admission Applications
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">{apps.length} total applications</p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Name</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Course</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Phone</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Date</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Status</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: any) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="font-body text-sm p-4 font-semibold text-foreground">{a.full_name}</td>
                  <td className="font-body text-sm p-4 text-foreground">{a.course}</td>
                  <td className="font-body text-sm p-4"><a href={`tel:${a.phone}`} className="text-primary hover:underline">{a.phone}</a></td>
                  <td className="font-body text-sm p-4 text-muted-foreground">{format(new Date(a.created_at), "MMM d, yyyy")}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-body font-semibold capitalize ${statusColor(a.status)}`}>{a.status}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setSelected(a)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"><Eye className="w-4 h-4" /></button>
                      {a.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus.mutate({ id: a.id, status: "approved" })} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"><CheckCircle className="w-4 h-4" /></button>
                          <button onClick={() => updateStatus.mutate({ id: a.id, status: "rejected" })} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center font-body text-sm text-muted-foreground p-8">{isLoading ? "Loading..." : "No applications found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-foreground">Application Details</h3>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 font-body text-sm">
              {Object.entries({
                "Name": selected.full_name, "Email": selected.email, "Phone": selected.phone,
                "DOB": selected.date_of_birth, "Gender": selected.gender, "Course": selected.course,
                "Father": selected.father_name, "Mother": selected.mother_name, "Address": selected.address,
                "Previous PU College": selected.previous_school, "12th %": selected.percentage_12th,
                "Status": selected.status, "Applied": format(new Date(selected.created_at), "PPp"),
              }).map(([k, v]) => (
                <div key={k} className="flex gap-3 p-2 rounded-lg hover:bg-muted/30">
                  <span className="text-muted-foreground w-32 shrink-0 font-semibold text-xs uppercase tracking-wider">{k}</span>
                  <span className="text-foreground font-medium">{v || "—"}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              {selected.status === "pending" && (
                <>
                  <Button onClick={() => updateStatus.mutate({ id: selected.id, status: "approved" })} className="flex-1 font-body rounded-xl">Approve</Button>
                  <Button variant="destructive" onClick={() => updateStatus.mutate({ id: selected.id, status: "rejected" })} className="flex-1 font-body rounded-xl">Reject</Button>
                </>
              )}
              <Button variant="outline" onClick={() => setSelected(null)} className="font-body rounded-xl">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
