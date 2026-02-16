import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, CheckCircle, XCircle, FileText, X, Phone, ArrowLeft, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function AdminApplications() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
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
    onSuccess: () => { toast.success("Application updated!"); queryClient.invalidateQueries({ queryKey: ["admin-applications"] }); setSelected(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = apps.filter((a: any) => {
    const matchSearch = a.full_name.toLowerCase().includes(search.toLowerCase()) || 
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.application_number || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchCourse = courseFilter === "all" || a.course === courseFilter;
    return matchSearch && matchStatus && matchCourse;
  });

  const uniqueCourses = [...new Set(apps.map((a: any) => a.course))];

  const statusColor = (s: string) =>
    s === "approved" ? "text-primary bg-primary/10" : s === "rejected" ? "text-destructive bg-destructive/10" : "text-secondary bg-secondary/10";

  const pendingCount = apps.filter((a: any) => a.status === "pending").length;
  const approvedCount = apps.filter((a: any) => a.status === "approved").length;
  const rejectedCount = apps.filter((a: any) => a.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Admission Applications
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-1">{apps.length} total applications</p>
          </div>
        </div>
        {/* Stats */}
        <div className="flex gap-3 ml-11 flex-wrap">
          <span className="text-xs font-body px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground font-semibold">⏳ {pendingCount} Pending</span>
          <span className="text-xs font-body px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">✓ {approvedCount} Approved</span>
          <span className="text-xs font-body px-3 py-1 rounded-full bg-destructive/10 text-destructive font-semibold">✗ {rejectedCount} Rejected</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, email or app number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border rounded-xl px-3 py-2 font-body text-xs bg-background">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}
          className="border border-border rounded-xl px-3 py-2 font-body text-xs bg-background">
          <option value="all">All Courses</option>
          {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">App #</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Name</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Course</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Phone</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Date</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Status</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="p-4"><div className="h-10 bg-muted/50 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : filtered.map((a: any) => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="font-body text-xs p-4 font-bold text-primary">{a.application_number || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {a.photo_url && <img src={a.photo_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border" />}
                      <span className="font-body text-sm font-semibold text-foreground">{a.full_name}</span>
                    </div>
                  </td>
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
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center font-body text-sm text-muted-foreground p-8">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">Application Details</h3>
                <p className="font-body text-xs text-primary font-bold mt-0.5">{selected.application_number}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Photo */}
            {selected.photo_url && (
              <div className="text-center mb-5">
                <img src={selected.photo_url} alt={selected.full_name} className="w-24 h-24 rounded-2xl object-cover mx-auto border-2 border-border shadow-lg" />
              </div>
            )}

            <div className="space-y-2 font-body text-sm">
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

            <div className="flex flex-wrap gap-2 mt-5">
              <a href={`tel:${selected.phone}`}>
                <Button size="sm" variant="outline" className="rounded-xl font-body text-xs">
                  <Phone className="w-3 h-3 mr-1" /> Call Applicant
                </Button>
              </a>
              {selected.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => updateStatus.mutate({ id: selected.id, status: "approved" })} className="rounded-xl font-body text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus.mutate({ id: selected.id, status: "rejected" })} className="rounded-xl font-body text-xs">
                    <XCircle className="w-3 h-3 mr-1" /> Reject
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" onClick={() => setSelected(null)} className="rounded-xl font-body text-xs">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
