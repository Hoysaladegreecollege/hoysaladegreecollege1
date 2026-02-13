import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Search, Trash2, Mail, CheckCircle, Clock, XCircle, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusOptions = ["new", "replied", "closed"];
const statusColors: Record<string, string> = { new: "bg-secondary/20 text-secondary-foreground", replied: "bg-primary/10 text-primary", closed: "bg-muted text-muted-foreground" };

export default function AdminContacts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewContact, setViewContact] = useState<any>(null);

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
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" /> Contact Messages
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">{contacts.length} total messages</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["all", ...statusOptions].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2.5 rounded-xl font-body text-xs font-medium transition-all duration-200 ${filter === s ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading messages...</p></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-2xl"><p className="font-body text-sm text-muted-foreground">No messages found.</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any) => (
            <div key={c.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-body text-sm font-bold text-foreground truncate">{c.name}</h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-body font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{c.email} • {c.subject}</p>
                  <p className="font-body text-sm text-foreground mt-2 line-clamp-2">{c.message}</p>
                  <p className="font-body text-[10px] text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setViewContact(c)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="View Full"><Maximize2 className="w-4 h-4" /></button>
                  <select value={c.status} onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })} className="text-xs border border-border rounded-lg px-2 py-1.5 font-body bg-background focus:ring-2 focus:ring-primary/30 focus:outline-none">
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => { if (confirm("Delete this message?")) deleteContact.mutate(c.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-page view modal */}
      {viewContact && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl p-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-foreground">Contact Message</h3>
              <button onClick={() => setViewContact(null)} className="p-2 rounded-xl hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Name", value: viewContact.name },
                { label: "Email", value: viewContact.email },
                { label: "Subject", value: viewContact.subject },
                { label: "Status", value: viewContact.status },
                { label: "Received", value: new Date(viewContact.created_at).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="font-body text-xs font-semibold text-muted-foreground w-24 shrink-0 uppercase tracking-wider">{label}</span>
                  <span className="font-body text-sm text-foreground">{value || "—"}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-border">
                <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Message</p>
                <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4">{viewContact.message}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <a href={`mailto:${viewContact.email}`} className="flex-1">
                <Button className="w-full font-body"><Mail className="w-4 h-4 mr-2" /> Reply via Email</Button>
              </a>
              <Button variant="outline" onClick={() => setViewContact(null)} className="font-body">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
