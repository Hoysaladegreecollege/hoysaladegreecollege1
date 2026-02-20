import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Search, Trash2, Mail, Maximize2, X, ArrowLeft, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const statusOptions = ["new", "replied", "closed"];
const statusConfig: Record<string, { color: string; icon: string }> = {
  new: { color: "bg-secondary/10 text-secondary-foreground border border-secondary/20", icon: "🔔" },
  replied: { color: "bg-primary/10 text-primary border border-primary/20", icon: "✓" },
  closed: { color: "bg-muted text-muted-foreground border border-border", icon: "✗" },
};

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
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filter === "all" || c.status === filter);
  });

  const newCount = contacts.filter((c: any) => c.status === "new").length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/8 via-card to-secondary/8 border border-border rounded-2xl p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-28 h-28 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="flex items-center gap-3">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Contact Messages
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{contacts.length} total messages{newCount > 0 ? ` · ${newCount} new` : ""}</p>
          </div>
          {newCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="font-body text-xs font-bold text-secondary-foreground">🔔 {newCount} new</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <div className="flex gap-1.5">
          {["all", ...statusOptions].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl font-body text-xs font-semibold transition-all duration-200 capitalize ${filter === s ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Message Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex gap-4">
                <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                  <Skeleton className="h-8 w-full rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any, i: number) => {
            const sc = statusConfig[c.status] || statusConfig.new;
            return (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all duration-300 group" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary font-display text-base">
                      {c.name[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-body text-sm font-bold text-foreground">{c.name}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-body font-bold ${sc.color}`}>{sc.icon} {c.status}</span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground mb-1.5">{c.email} · <span className="font-semibold">{c.subject}</span></p>
                      <p className="font-body text-sm text-foreground line-clamp-2 leading-relaxed">{c.message}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-muted-foreground/60" />
                        <p className="font-body text-[10px] text-muted-foreground/60">{new Date(c.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => setViewContact(c)} className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-colors" title="View Full">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <select value={c.status} onChange={(e) => updateStatus.mutate({ id: c.id, status: e.target.value })}
                      className="text-xs border border-border rounded-xl px-2 py-1.5 font-body bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none">
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => { if (confirm("Delete this message?")) deleteContact.mutate(c.id); }} className="p-2 rounded-xl hover:bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Modal */}
      {viewContact && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewContact(null)}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-display text-lg font-bold text-foreground">Contact Message</h3>
              <button onClick={() => setViewContact(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "Name", value: viewContact.name },
                { label: "Email", value: viewContact.email },
                { label: "Subject", value: viewContact.subject },
                { label: "Status", value: viewContact.status },
                { label: "Received", value: new Date(viewContact.created_at).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
                  <span className="font-body text-[10px] font-bold text-muted-foreground w-20 shrink-0 uppercase tracking-wider pt-0.5">{label}</span>
                  <span className="font-body text-sm text-foreground">{value || "—"}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-border">
                <p className="font-body text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Message</p>
                <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4 border border-border">{viewContact.message}</p>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0 border-t border-border">
              <a href={`mailto:${viewContact.email}`} className="flex-1">
                <Button className="w-full font-body rounded-xl"><Mail className="w-4 h-4 mr-2" /> Reply via Email</Button>
              </a>
              <Button variant="outline" onClick={() => setViewContact(null)} className="font-body rounded-xl">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
