import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, MessageCircle, ArrowLeft, User, Clock, CheckCheck, Inbox, Sparkles, PenLine, Search } from "lucide-react";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [composing, setComposing] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('student-messages-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'direct_messages',
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["student-messages"] });
        queryClient.invalidateQueries({ queryKey: ["msg-thread"] });
        queryClient.invalidateQueries({ queryKey: ["msg-profiles"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

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

  // Collect all unique user IDs from conversations AND thread replies
  const allUserIds = new Set<string>();
  conversations.forEach((m: any) => { allUserIds.add(m.sender_id); allUserIds.add(m.receiver_id); });
  threadReplies.forEach((m: any) => { allUserIds.add(m.sender_id); allUserIds.add(m.receiver_id); });

  // Profile lookup
  const { data: profileMap = {} } = useQuery({
    queryKey: ["msg-profiles", [...allUserIds].sort().join(",")],
    queryFn: async () => {
      if (allUserIds.size === 0) return {};
      const { data } = await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", [...allUserIds]);
      const map: Record<string, { name: string; avatar?: string }> = {};
      data?.forEach(p => { map[p.user_id] = { name: p.full_name, avatar: p.avatar_url || undefined }; });
      return map;
    },
    enabled: allUserIds.size > 0,
  });

  // Auto-scroll to bottom of thread
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadReplies, activeThread]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!user || !selectedTeacher || !message.trim()) throw new Error("Please select a teacher and type a message");
      const { error } = await supabase.from("direct_messages").insert({
        sender_id: user.id,
        receiver_id: selectedTeacher,
        subject: subject.trim() || "No Subject",
        message: message.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
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

  const markRead = async (threadId: string) => {
    if (!user) return;
    await supabase.from("direct_messages").update({ is_read: true })
      .eq("receiver_id", user.id)
      .or(`id.eq.${threadId},parent_message_id.eq.${threadId}`);
    queryClient.invalidateQueries({ queryKey: ["student-messages"] });
  };

  const activeMsg = conversations.find((m: any) => m.id === activeThread);
  const unreadCount = conversations.filter((m: any) => !m.is_read && m.receiver_id === user?.id).length;

  const filteredConversations = conversations.filter((m: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const otherName = (profileMap as any)[m.sender_id === user?.id ? m.receiver_id : m.sender_id]?.name || "";
    return otherName.toLowerCase().includes(q) || (m.subject || "").toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
  });

  const formatMsgDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isToday(d)) return format(d, "h:mm a");
    if (isYesterday(d)) return "Yesterday";
    return format(d, "MMM d");
  };

  const getInitials = (name: string) => name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div ref={ref} className="space-y-4 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-card via-card to-primary/[0.03] border border-border/50 rounded-3xl p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <Link to="/dashboard/student" className="p-2.5 rounded-2xl hover:bg-muted/60 transition-all duration-200 shrink-0 active:scale-95">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              Messages
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tabular-nums animate-pulse">
                  {unreadCount}
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 ml-[42px]">
              Private conversations with your teachers
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setComposing(true); setActiveThread(null); }}
            className="px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 flex items-center gap-2"
          >
            <PenLine className="w-3.5 h-3.5" /> Compose
          </motion.button>
        </div>
      </motion.div>

      {/* Compose Panel */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.97 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-primary/15 rounded-3xl p-5 sm:p-6 shadow-lg shadow-primary/5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-foreground">New Message</h3>
              </div>
              <div className="space-y-3.5">
                <div className="relative">
                  <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}
                    className="w-full border border-border/60 rounded-2xl px-4 py-3 text-sm bg-background/60 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Select a teacher...</option>
                    {teachers.map((t: any) => <option key={t.user_id} value={t.user_id}>{t.full_name}</option>)}
                  </select>
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
                </div>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject (optional)"
                  className="w-full border border-border/60 rounded-2xl px-4 py-3 text-sm bg-background/60 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:outline-none transition-all placeholder:text-muted-foreground/40" />
                <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Type your message here..."
                  className="w-full border border-border/60 rounded-2xl px-4 py-3.5 text-sm bg-background/60 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:outline-none transition-all resize-none placeholder:text-muted-foreground/40 leading-relaxed" />
                <div className="flex gap-2.5 pt-1">
                  <button onClick={() => setComposing(false)}
                    className="px-5 py-2.5 rounded-2xl border border-border/60 text-xs font-medium hover:bg-muted/50 transition-all duration-200 active:scale-95">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => sendMessage.mutate()}
                    disabled={sendMessage.isPending || !selectedTeacher || !message.trim()}
                    className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 disabled:opacity-40 disabled:shadow-none flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> {sendMessage.isPending ? "Sending..." : "Send Message"}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thread View */}
      <AnimatePresence mode="wait">
        {activeThread && activeMsg ? (
          <motion.div
            key="thread"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Thread Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 bg-gradient-to-r from-card to-primary/[0.02]">
              <div className="flex items-center gap-3">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setActiveThread(null)}
                  className="p-2 rounded-xl hover:bg-muted/60 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {getInitials((profileMap as any)[activeMsg.sender_id === user?.id ? activeMsg.receiver_id : activeMsg.sender_id]?.name || "?")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{activeMsg.subject || "No Subject"}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {(profileMap as any)[activeMsg.sender_id === user?.id ? activeMsg.receiver_id : activeMsg.sender_id]?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 sm:p-5 space-y-3 max-h-[55vh] overflow-y-auto scrollbar-thin">
              {/* Original */}
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${activeMsg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-3xl ${activeMsg.sender_id === user?.id
                  ? "bg-primary text-primary-foreground rounded-br-lg shadow-md shadow-primary/15"
                  : "bg-muted/60 rounded-bl-lg border border-border/30"}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{activeMsg.message}</p>
                  <div className={`flex items-center gap-1.5 mt-2 ${activeMsg.sender_id === user?.id ? "justify-end" : ""}`}>
                    <Clock className={`w-2.5 h-2.5 ${activeMsg.sender_id === user?.id ? "text-primary-foreground/40" : "text-muted-foreground/50"}`} />
                    <p className={`text-[10px] ${activeMsg.sender_id === user?.id ? "text-primary-foreground/50" : "text-muted-foreground/60"}`}>
                      {format(new Date(activeMsg.created_at), "MMM d, h:mm a")}
                    </p>
                    {activeMsg.sender_id === user?.id && (
                      <CheckCheck className={`w-3 h-3 ${activeMsg.is_read ? "text-primary-foreground/70" : "text-primary-foreground/30"}`} />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Replies */}
              {threadReplies.map((r: any, i: number) => (
                <motion.div key={r.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex ${r.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl ${r.sender_id === user?.id
                    ? "bg-primary text-primary-foreground rounded-br-lg shadow-md shadow-primary/15"
                    : "bg-muted/60 rounded-bl-lg border border-border/30"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.message}</p>
                    <div className={`flex items-center gap-1.5 mt-2 ${r.sender_id === user?.id ? "justify-end" : ""}`}>
                      <Clock className={`w-2.5 h-2.5 ${r.sender_id === user?.id ? "text-primary-foreground/40" : "text-muted-foreground/50"}`} />
                      <p className={`text-[10px] ${r.sender_id === user?.id ? "text-primary-foreground/50" : "text-muted-foreground/60"}`}>
                        {format(new Date(r.created_at), "MMM d, h:mm a")}
                      </p>
                      {r.sender_id === user?.id && (
                        <CheckCheck className={`w-3 h-3 ${r.is_read ? "text-primary-foreground/70" : "text-primary-foreground/30"}`} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="p-3 sm:p-4 border-t border-border/40 bg-card/80 backdrop-blur-sm">
              <div className="flex gap-2.5 items-end">
                <div className="flex-1 relative">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Type a reply..."
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && replyText.trim()) { e.preventDefault(); sendReply.mutate(); } }}
                    className="w-full border border-border/50 rounded-2xl px-4 py-3 text-sm bg-background/60 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:outline-none transition-all placeholder:text-muted-foreground/40" />
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                  onClick={() => sendReply.mutate()}
                  disabled={!replyText.trim() || sendReply.isPending}
                  className="p-3 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20 disabled:opacity-40 disabled:shadow-none transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : !composing && (
          /* Conversation List */
          <motion.div
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm"
          >
            {/* Search */}
            {conversations.length > 0 && (
              <div className="p-3 border-b border-border/30">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-muted/30 border-0 rounded-xl focus:ring-2 focus:ring-primary/15 focus:outline-none transition-all placeholder:text-muted-foreground/40" />
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 items-center p-3">
                    <div className="w-11 h-11 rounded-2xl bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-muted animate-pulse rounded-lg w-1/3" />
                      <div className="h-3 bg-muted animate-pulse rounded-lg w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 rounded-3xl bg-muted/40 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground/70">
                  {searchQuery ? "No results found" : "No messages yet"}
                </p>
                <p className="text-xs text-muted-foreground/40 mt-1.5 max-w-[200px] mx-auto">
                  {searchQuery ? "Try a different search" : "Send a message to your teacher to get started"}
                </p>
                {!searchQuery && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={() => setComposing(true)}
                    className="mt-5 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 inline-flex items-center gap-2"
                  >
                    <PenLine className="w-3.5 h-3.5" /> Write First Message
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border/25">
                {filteredConversations.map((m: any, i: number) => {
                  const isMe = m.sender_id === user?.id;
                  const otherId = isMe ? m.receiver_id : m.sender_id;
                  const isUnread = !m.is_read && m.receiver_id === user?.id;
                  const otherProfile = (profileMap as any)[otherId];
                  const otherName = otherProfile?.name || "Unknown";

                  return (
                    <motion.button
                      key={m.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { setActiveThread(m.id); markRead(m.id); setComposing(false); }}
                      className={`w-full text-left p-4 hover:bg-muted/20 transition-all duration-200 flex items-center gap-3.5 group ${isUnread ? "bg-primary/[0.04]" : ""}`}
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-200 ${isUnread
                        ? "bg-primary/15 text-primary ring-2 ring-primary/20"
                        : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                        {getInitials(otherName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-[13px] truncate ${isUnread ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                            {otherName}
                          </p>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-pulse" />
                          )}
                        </div>
                        <p className={`text-[11px] truncate mt-0.5 ${isUnread ? "text-primary font-medium" : "text-muted-foreground/70"}`}>
                          {m.subject || "No Subject"}
                        </p>
                        <p className="text-[11px] text-muted-foreground/50 truncate mt-0.5 leading-snug">
                          {isMe && <span className="text-muted-foreground/40">You: </span>}
                          {m.message}
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <p className={`text-[10px] ${isUnread ? "text-primary font-medium" : "text-muted-foreground/50"}`}>
                          {formatMsgDate(m.created_at)}
                        </p>
                        {isMe && <CheckCheck className={`w-3.5 h-3.5 ${m.is_read ? "text-primary/70" : "text-muted-foreground/25"}`} />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

StudentMessages.displayName = "StudentMessages";
export default StudentMessages;
