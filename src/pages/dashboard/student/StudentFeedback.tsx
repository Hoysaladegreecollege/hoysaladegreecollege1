import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

const categories = [
  { value: "academic", label: "Academic" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "faculty", label: "Faculty" },
  { value: "fees", label: "Fees & Finance" },
  { value: "hostel", label: "Hostel" },
  { value: "complaint", label: "Complaint" },
  { value: "suggestion", label: "Suggestion" },
  { value: "general", label: "General" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  in_review: { label: "In Review", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: AlertCircle },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: XCircle },
};

export default function StudentFeedback() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [showForm, setShowForm] = useState(false);

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["student-feedback", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_complaints")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("feedback_complaints").insert({
        user_id: user!.id,
        subject: subject.trim(),
        message: message.trim(),
        category,
        priority,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      setSubject("");
      setMessage("");
      setCategory("general");
      setPriority("medium");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["student-feedback"] });
    },
    onError: () => toast.error("Failed to submit feedback"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    submitMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            Feedback & Complaints
          </h1>
          <p className="text-muted-foreground mt-1">Submit feedback or complaints and track responses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Send className="h-4 w-4" />
          {showForm ? "Cancel" : "New Feedback"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 shadow-lg animate-in slide-in-from-top-2">
          <CardHeader>
            <CardTitle className="text-lg">Submit New Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Priority</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Subject *</label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief subject of your feedback" maxLength={200} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your feedback or complaint in detail..." rows={4} maxLength={2000} />
              </div>
              <Button type="submit" disabled={submitMutation.isPending} className="w-full gap-2">
                <Send className="h-4 w-4" />
                {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : feedbacks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No feedback submitted yet</p>
            <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>Submit Your First Feedback</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(fb => {
            const status = statusConfig[fb.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <Card key={fb.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-foreground">{fb.subject}</h3>
                        <Badge variant="outline" className="text-xs capitalize">{fb.category}</Badge>
                        <Badge variant="outline" className={`text-xs capitalize ${fb.priority === 'urgent' ? 'border-red-500 text-red-600' : fb.priority === 'high' ? 'border-orange-500 text-orange-600' : ''}`}>
                          {fb.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{fb.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Submitted {format(new Date(fb.created_at), "PPp")}
                      </p>
                      {fb.admin_response && (
                        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-xs font-medium text-primary mb-1">Admin Response:</p>
                          <p className="text-sm text-foreground">{fb.admin_response}</p>
                          {fb.responded_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Responded {format(new Date(fb.responded_at), "PPp")}
                            </p>
                          )}
                        </div>
                      )}
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
    </div>
  );
}
