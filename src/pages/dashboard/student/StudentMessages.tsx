import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, MessageCircle, ArrowLeft, User, Clock, CheckCheck, Inbox } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [composing, setComposing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Fetch teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ["student-msg-teachers"],
    queryFn: async () => {
      const { data: teacherRecords } = await supabase.from("teachers").select("user_id").eq("is_active", true);
      if (!teacherRecords?.length) return [];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", teacherRecords.map(t => t.user_id));
      return profiles || [];
    },
  });

  // Fetch conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["student-messages", user?.id],
    refetchInterval: 15000,
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .is("parent_message_id", null)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch replies for active thread
  const { data: threadReplies = [] } = useQuery({
    queryKey: ["msg-thread", activeThread],
    queryFn: async () => {
      if (!activeThread) return [];
      const { data } = await supabase
        .from("direct_messages")
        .select("*")
        .eq("parent_message_id", activeThread)
        .order("created_at");
      return data || [];
    },
    enabled: !!activeThread,
  });

  // Profile lookup for display names
  const { data: profileMap = {} } = useQuery({
    queryKey: ["msg-profiles", conversations],
    queryFn: async () => {
      const ids = new Set<string>();
      conversations.forEach((m: any) => { ids.add(m.sender_id); ids.add(m.receiver_id); });
      threadReplies.forEach((m: any) => { ids.add(m.sender_id); ids.add(m.receiver_id); });
      if (ids.size === 0) return {};
      const { data } = await supabase.from("profiles").select("user_id, full_name").in("user_id", [...ids]);
      const map: Record<string, string> = {};
      data?.forEach(p => { map[p.user_id] = p.full_name; });
      return map;
    },
    enabled: conversations.length > 0 || threadReplies.length > 0,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !selectedTeacher || !message.trim()) throw new Error("Fill all fields");
      const { error } = await supabase.from("direct_messages").insert({
        sender_id: user.id,
        receiver_id: selectedTeacher,
        subject: subject.trim() || "No Subject",
        message: message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message sent!");
      setComposing(false);
      setSelectedTeacher("");
      setSubject("");
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["student-messages"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const sendReply = useMutation({
    mutationFn: async () => {
      if (!user || !activeThread || !replyText.trim()) throw new Error("Enter a reply");
      const parentMsg = conversations.find((m: any) => m.id === activeThread);
      if (!parentMsg) throw new Error("Thread not found");
      const receiverId = parentMsg.sender_id === user.id ? parentMsg.receiver_id : parentMsg.sender_id;
      const { error } = await supabase.from("direct_messages").insert({
        sender_id: user.id,
        receiver_id: receiverId,
        subject: parentMsg.subject,
        message: replyText.trim(),
        parent_message_id: activeThread,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["msg-thread"] });
      queryClient.invalidateQueries({ queryKey: ["student-messages"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Mark messages as read when opening thread
  const markRead = async (threadId: string) => {
    if (!user) return;
    await supabase.from("direct_messages").update({ is_read: true })
      .eq("receiver_id", user.id)
      .or(`id.eq.${threadId},parent_message_id.eq.${threadId}`);
    queryClient.invalidateQueries({ queryKey: ["student-messages"] });
  };

  const activeMsg = conversations.find((m: any) => m.id === activeThread);
  const unreadCount = conversations.filter((m: any) => !m.is_read && m.receiver_id === user?.id).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/student" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h2 className="font-body text-xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> Messages
            </h2>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "Chat with your teachers"}
            </p>
          </div>
          <button onClick={() => { setComposing(true); setActiveThread(null); }}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> New Message
          </button>
        </div>
      </div>

      {/* Compose */}
      {composing && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 sm:p-6 animate-fade-in">
          <h3 className="font-body text-sm font-bold text-foreground mb-4">New Message</h3>
          <div className="space-y-3">
            <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none">
              <option value="">Select Teacher</option>
              {teachers.map((t: any) => <option key={t.user_id} value={t.user_id}>{t.full_name} ({t.email})</option>)}
            </select>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (optional)"
              className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Type your message..."
              className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none" />
            <div className="flex gap-2">
              <button onClick={() => setComposing(false)} className="px-4 py-2.5 rounded-xl border border-border font-body text-xs hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => sendMessage.mutate()} disabled={sendMessage.isPending || !selectedTeacher || !message.trim()}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" /> {sendMessage.isPending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thread view */}
      {activeThread && activeMsg ? (
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <button onClick={() => setActiveThread(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <p className="font-body text-sm font-bold text-foreground">{activeMsg.subject || "No Subject"}</p>
              <p className="font-body text-[11px] text-muted-foreground">
                with {(profileMap as any)[activeMsg.sender_id === user?.id ? activeMsg.receiver_id : activeMsg.sender_id] || "Unknown"}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {/* Original message */}
            <div className={`flex ${activeMsg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-3.5 rounded-2xl ${activeMsg.sender_id === user?.id ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                <p className="font-body text-sm">{activeMsg.message}</p>
                <p className={`font-body text-[9px] mt-1.5 ${activeMsg.sender_id === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {format(new Date(activeMsg.created_at), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
            {/* Replies */}
            {threadReplies.map((r: any) => (
              <div key={r.id} className={`flex ${r.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3.5 rounded-2xl ${r.sender_id === user?.id ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                  <p className="font-body text-sm">{r.message}</p>
                  <p className={`font-body text-[9px] mt-1.5 ${r.sender_id === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {format(new Date(r.created_at), "MMM d, h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Reply input */}
          <div className="p-3 border-t border-border flex gap-2">
            <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type a reply..."
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && replyText.trim() && sendReply.mutate()}
              className="flex-1 border border-border rounded-xl px-4 py-2.5 font-body text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none" />
            <button onClick={() => sendReply.mutate()} disabled={!replyText.trim() || sendReply.isPending}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-xs font-bold hover:bg-primary/90 disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Conversation list */
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : conversations.length === 0 ? (
            <div className="py-16 text-center">
              <Inbox className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
              <p className="font-body text-sm text-muted-foreground">No messages yet</p>
              <p className="font-body text-xs text-muted-foreground/60 mt-1">Send a message to your teacher to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {conversations.map((m: any) => {
                const isMe = m.sender_id === user?.id;
                const otherId = isMe ? m.receiver_id : m.sender_id;
                const isUnread = !m.is_read && m.receiver_id === user?.id;
                return (
                  <button key={m.id} onClick={() => { setActiveThread(m.id); markRead(m.id); setComposing(false); }}
                    className={`w-full text-left p-4 hover:bg-muted/30 transition-colors flex items-center gap-3 ${isUnread ? "bg-primary/5" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-body text-[12px] font-semibold truncate ${isUnread ? "text-foreground" : "text-foreground/80"}`}>
                          {(profileMap as any)[otherId] || "Unknown"}
                        </p>
                        {isUnread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="font-body text-[11px] text-primary/70 font-medium truncate">{m.subject || "No Subject"}</p>
                      <p className="font-body text-[10px] text-muted-foreground truncate mt-0.5">{m.message}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-body text-[9px] text-muted-foreground">{format(new Date(m.created_at), "MMM d")}</p>
                      {isMe && <CheckCheck className={`w-3.5 h-3.5 mt-1 ml-auto ${m.is_read ? "text-primary" : "text-muted-foreground/40"}`} />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
