import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Search, Trash2, Mail, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusOptions = ["new", "replied", "closed"];
const statusIcons: Record<string, any> = { new: Clock, replied: Mail, closed: CheckCircle };
const statusColors: Record<string, string> = { new: "bg-secondary/20 text-secondary-foreground", replied: "bg-primary/10 text-primary", closed: "bg-muted text-muted-foreground" };

export default function AdminContacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-contacts"] }); toast.success("Status updated"); },
  });

  const deleteContact = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-contacts"] }); toast.success("Deleted"); },
  });

  const filtered = contacts.filter((c: any) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground">Contact Messages</h2>
        <p className="font-body text-sm text-muted-foreground mt-1">Messages from the contact form</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-border rounded-lg font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2">
          {["all", ...statusOptions].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg font-body text-xs font-medium transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No messages found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any) => {
            const StatusIcon = statusIcons[c.status] || Clock;
            return (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-body text-sm font-semibold text-foreground truncate">{c.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground">{c.email} • {c.subject}</p>
                    <p className="font-body text-sm text-foreground mt-2">{c.message}</p>
                    <p className="font-body text-[10px] text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <select value={c.status} onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })} className="text-xs border border-border rounded px-2 py-1 font-body bg-background">
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => deleteContact.mutate(c.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
