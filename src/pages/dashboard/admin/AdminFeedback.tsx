import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MessageSquare, Search, Clock, CheckCircle, AlertCircle, XCircle, Send, Filter } from "lucide-react";
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
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["admin-feedback"],
    queryFn: async () => {
      const { data: feedbackData, error } = await supabase
        .from("feedback_complaints")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch profiles for user names
      const userIds = [...new Set(feedbackData.map((f: any) => f.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);
      
      const profileMap = Object.fromEntries((profilesData || []).map((p: any) => [p.user_id, p]));
      return feedbackData.map((f: any) => ({ ...f, profiles: profileMap[f.user_id] || null }));
      return data;
    },
    refetchInterval: 30000,
  });

  const respondMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("feedback_complaints")
        .update({
          status: newStatus,
          admin_response: response.trim() || undefined,
          responded_by: user!.id,
          responded_at: new Date().toISOString(),
        })
        .eq("id", selectedFeedback.id);
      if (error) throw error;

      // Log the activity
      await supabase.from("activity_logs").insert({
        user_id: user!.id,
        action: "responded_feedback",
        entity_type: "feedback",
        entity_id: selectedFeedback.id,
        details: { status: newStatus },
      });
    },
    onSuccess: () => {
      toast.success("Response saved!");
      setSelectedFeedback(null);
      setResponse("");
      setNewStatus("");
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
    },
    onError: () => toast.error("Failed to save response"),
  });

  const filtered = feedbacks.filter((fb: any) => {
    const matchesSearch = !search || 
      fb.subject?.toLowerCase().includes(search.toLowerCase()) ||
      fb.message?.toLowerCase().includes(search.toLowerCase()) ||
      fb.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || fb.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter((f: any) => f.status === "pending").length,
    resolved: feedbacks.filter((f: any) => f.status === "resolved").length,
    urgent: feedbacks.filter((f: any) => f.priority === "urgent").length,
  };

  const openRespond = (fb: any) => {
    setSelectedFeedback(fb);
    setNewStatus(fb.status);
    setResponse(fb.admin_response || "");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Feedback & Complaints
        </h1>
        <p className="text-muted-foreground mt-1">Manage student feedback and complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "Resolved", value: stats.resolved, color: "text-green-600" },
          { label: "Urgent", value: stats.urgent, color: "text-red-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by subject, message, or student..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
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
        <div className="space-y-3">
          {filtered.map((fb: any) => {
            const status = statusConfig[fb.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card key={fb.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openRespond(fb)}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-foreground text-sm">{fb.subject}</h3>
                        <Badge variant="outline" className="text-xs capitalize">{fb.category}</Badge>
                        <Badge variant="outline" className={`text-xs capitalize ${fb.priority === 'urgent' ? 'border-red-500 text-red-600' : fb.priority === 'high' ? 'border-orange-500 text-orange-600' : ''}`}>
                          {fb.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        From: <span className="font-medium text-foreground">{fb.profiles?.full_name || "Unknown"}</span>
                        {fb.profiles?.email && <span className="ml-1">({fb.profiles.email})</span>}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{fb.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{format(new Date(fb.created_at), "PPp")}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.color}`}>
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Respond Dialog */}
      <Dialog open={!!selectedFeedback} onOpenChange={open => !open && setSelectedFeedback(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">{selectedFeedback.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  By {selectedFeedback.profiles?.full_name} • {format(new Date(selectedFeedback.created_at), "PPp")}
                </p>
                <p className="text-sm mt-2">{selectedFeedback.message}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Update Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Response</label>
                <Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Write your response to the student..." rows={3} maxLength={2000} />
              </div>
              <Button onClick={() => respondMutation.mutate()} disabled={respondMutation.isPending} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {respondMutation.isPending ? "Saving..." : "Save Response"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
