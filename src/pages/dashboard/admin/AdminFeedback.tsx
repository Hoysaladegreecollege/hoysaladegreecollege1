import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MessageSquare, Search, Clock, CheckCircle, AlertCircle, XCircle, Send } from "lucide-react";
import { format } from "date-fns";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  in_review: { label: "In Review", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
};

export default function AdminFeedback() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [responseStatus, setResponseStatus] = useState("resolved");

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_complaints")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data.length) return data;
      const userIds = [...new Set(data.map((f: any) => f.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles || []).map((p: any) => [p.user_id, p]));
      return data.map((f: any) => ({ ...f, profile: profileMap[f.user_id] || null }));
    },
    refetchInterval: 30000,
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, adminResponse, newStatus }: { id: string; adminResponse: string; newStatus: string }) => {
      const { error } = await supabase
        .from("feedback_complaints")
        .update({
          admin_response: adminResponse,
          status: newStatus,
          responded_by: user!.id,
          responded_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Response sent successfully!");
      setRespondingId(null);
      setResponse("");
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
    },
    onError: () => toast.error("Failed to send response"),
  });

  const filtered = feedbacks.filter((fb: any) => {
    if (statusFilter !== "all" && fb.status !== statusFilter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return fb.subject?.toLowerCase().includes(s) || fb.profile?.full_name?.toLowerCase().includes(s) || fb.category?.toLowerCase().includes(s);
  });

  const counts = {
    all: feedbacks.length,
    pending: feedbacks.filter((f: any) => f.status === "pending").length,
    in_review: feedbacks.filter((f: any) => f.status === "in_review").length,
    resolved: feedbacks.filter((f: any) => f.status === "resolved").length,
    rejected: feedbacks.filter((f: any) => f.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Feedback Management
        </h1>
        <p className="text-muted-foreground mt-1">View and respond to student feedback and complaints</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "in_review", "resolved", "rejected"] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {s === "all" ? "All" : statusConfig[s]?.label} ({counts[s]})
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by subject, student, or category..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No feedback found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((fb: any) => {
            const status = statusConfig[fb.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isResponding = respondingId === fb.id;
            return (
              <Card key={fb.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground">{fb.subject}</h3>
                        <Badge variant="outline" className="text-xs capitalize">{fb.category}</Badge>
                        <Badge variant="outline" className={`text-xs capitalize ${fb.priority === "urgent" ? "border-destructive text-destructive" : fb.priority === "high" ? "border-orange-500 text-orange-600" : ""}`}>
                          {fb.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        By <span className="font-medium">{fb.profile?.full_name || "Unknown"}</span> · {format(new Date(fb.created_at), "PPp")}
                      </p>
                      <p className="text-sm text-muted-foreground">{fb.message}</p>

                      {fb.admin_response && !isResponding && (
                        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-xs font-medium text-primary mb-1">Your Response:</p>
                          <p className="text-sm text-foreground">{fb.admin_response}</p>
                        </div>
                      )}

                      {isResponding && (
                        <div className="mt-3 space-y-3 p-3 rounded-lg bg-muted/50 border">
                          <Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Type your response..." rows={3} />
                          <div className="flex items-center gap-3">
                            <Select value={responseStatus} onValueChange={setResponseStatus}>
                              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="in_review">In Review</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button size="sm" disabled={!response.trim() || respondMutation.isPending}
                              onClick={() => respondMutation.mutate({ id: fb.id, adminResponse: response.trim(), newStatus: responseStatus })}
                              className="gap-1">
                              <Send className="h-3 w-3" />
                              {respondMutation.isPending ? "Sending..." : "Send"}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setRespondingId(null); setResponse(""); }}>Cancel</Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </div>
                      {!isResponding && (
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => { setRespondingId(fb.id); setResponse(fb.admin_response || ""); }}>
                          {fb.admin_response ? "Edit Response" : "Respond"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
