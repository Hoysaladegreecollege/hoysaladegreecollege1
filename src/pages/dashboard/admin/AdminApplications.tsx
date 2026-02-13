import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data } = await supabase
        .from("admission_applications")
        .select("*")
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("admission_applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Application updated!" });
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      setSelected(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const filtered = apps.filter((a: any) =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) =>
    s === "approved" ? "text-green-600 bg-green-50" : s === "rejected" ? "text-red-600 bg-red-50" : "text-yellow-600 bg-yellow-50";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Admission Applications</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-body text-xs text-muted-foreground p-3">Name</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Course</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Phone</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Date</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Status</th>
              <th className="text-left font-body text-xs text-muted-foreground p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a: any) => (
              <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="font-body text-sm p-3 font-medium">{a.full_name}</td>
                <td className="font-body text-sm p-3">{a.course}</td>
                <td className="font-body text-sm p-3">{a.phone}</td>
                <td className="font-body text-sm p-3">{format(new Date(a.created_at), "MMM d, yyyy")}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-body font-semibold capitalize ${statusColor(a.status)}`}>{a.status}</span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setSelected(a)} className="text-primary hover:text-primary/80"><Eye className="w-4 h-4" /></button>
                  {a.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus.mutate({ id: a.id, status: "approved" })} className="text-green-600 hover:text-green-700"><CheckCircle className="w-4 h-4" /></button>
                      <button onClick={() => updateStatus.mutate({ id: a.id, status: "rejected" })} className="text-red-600 hover:text-red-700"><XCircle className="w-4 h-4" /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center font-body text-sm text-muted-foreground p-6">{isLoading ? "Loading..." : "No applications found."}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Application Details</h3>
            <div className="space-y-2 font-body text-sm">
              {Object.entries({
                "Name": selected.full_name, "Email": selected.email, "Phone": selected.phone,
                "DOB": selected.date_of_birth, "Gender": selected.gender, "Course": selected.course,
                "Father": selected.father_name, "Mother": selected.mother_name, "Address": selected.address,
                "Previous School": selected.previous_school, "12th %": selected.percentage_12th,
                "Status": selected.status, "Applied": format(new Date(selected.created_at), "PPp"),
              }).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-muted-foreground w-28 shrink-0">{k}:</span>
                  <span className="text-foreground font-medium">{v || "-"}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => setSelected(null)} variant="outline" className="mt-4 w-full font-body">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}
