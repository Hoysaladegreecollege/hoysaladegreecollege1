import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, MessageSquare, User, Search, ChevronLeft, CheckCheck, Check } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

function formatMsgDate(d: string) {
  const date = new Date(d);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday " + format(date, "h:mm a");
  return format(date, "MMM d, h:mm a");
}

export default function StudentMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch teachers with profiles
  const { data: teachers = [] } = useQuery({
    queryKey: ["student-msg-teachers"],
    queryFn: async () => {
      const { data: teacherRows } = await supabase.from("teachers").select("id, user_id, employee_id, subjects").eq("is_active", true);
      if (!teacherRows?.length) return [];
      const userIds = teacherRows.map(t => t.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);
      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
      return teacherRows.map(t => ({
        ...t,
        name: profileMap[t.user_id]?.full_name || t.employee_id,
        email: profileMap[t.user_id]?.email || "",
      }));
    },
  });

  // Fetch conversations
  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["student-conversations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("direct_messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .is("parent_message_id", null)
        .order("created_at", { ascending: false });
      if (!data?.length) return [];
      const otherIds = [...new Set(data.map(m => m.sender_id === user.id ? m.receiver_id : m.sender_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", otherIds);
      const profileMap = Object.fromEntries((profiles || []).map(p => [p.user_id, p]));
      // Group by other user
      const grouped: Record<string, any> = {};
      data.forEach(m => {
        const otherId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
        if (!grouped[otherId]) {
          grouped[otherId] = {
            userId: otherId,
            name: profileMap[otherId]?.full_name || "Unknown",
            lastMessage: m,
            unread: 0,
          };
        }
        if (m.receiver_id === user.id && !m.is_read) grouped[otherId].unread++;
      });
      return Object.values(grouped);
    },
    enabled: !!user,
  });

  // Fetch thread messages
  const { data: threadMessages = [], refetch: refetchThread } = useQuery({
    queryKey: ["student-thread", user?.id, selectedTeacherId],
    queryFn: async () => {
      if (!user || !selectedTeacherId) return [];
      const { data } = await supabase.from("direct_messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedTeacherId}),and(sender_id.eq.${selectedTeacherId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      // Mark as read
      const unreadIds = (data || []).filter(m => m.receiver_id === user.id && !m.is_read).map(m => m.id);
      if (unreadIds.length > 0) {
        await supabase.from("direct_messages").update({ is_read: true }).in("id", unreadIds);
      }
      return data || [];
    },
    enabled: !!user && !!selectedTeacherId,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("student-messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "direct_messages" }, () => {
        refetchConversations();
        if (selectedTeacherId) refetchThread();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, selectedTeacherId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const handleSend = async () => {
    if (!message.trim() || !user || !selectedTeacherId) return;
    setSending(true);
    await supabase.from("direct_messages").insert({
      sender_id: user.id,
      receiver_id: selectedTeacherId,
      message: message.trim(),
      subject: subject.trim() || "Message",
    });
    setMessage("");
    setSending(false);
    refetchThread();
    refetchConversations();
  };

  const filteredTeachers = teachers.filter((t: any) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedName = conversations.find((c: any) => c.userId === selectedTeacherId)?.name
    || teachers.find((t: any) => t.user_id === selectedTeacherId)?.name
    || "Select a teacher";

  return (
    <div className="h-[calc(100vh-12rem)] flex rounded-2xl border border-border/60 overflow-hidden bg-card">
      {/* Sidebar */}
      <div className={`w-full sm:w-80 shrink-0 border-r border-border/40 flex flex-col bg-card ${selectedTeacherId ? "hidden sm:flex" : "flex"}`}>
        <div className="p-4 border-b border-border/40">
          <h2 className="font-body text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search teachers..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/30 border border-border/40 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Existing conversations */}
          {conversations.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1.5 font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Recent</p>
              {conversations.map((conv: any) => (
                <button
                  key={conv.userId}
                  onClick={() => setSelectedTeacherId(conv.userId)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left ${
                    selectedTeacherId === conv.userId ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-body text-sm font-medium text-foreground truncate">{conv.name}</p>
                      <span className="font-body text-[10px] text-muted-foreground shrink-0">{formatMsgDate(conv.lastMessage.created_at)}</span>
                    </div>
                    <p className="font-body text-[11px] text-muted-foreground truncate">{conv.lastMessage.message}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">{conv.unread}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Teacher list */}
          <div className="p-2">
            <p className="px-3 py-1.5 font-body text-[10px] font-bold text-muted-foreground uppercase tracking-widest">All Teachers</p>
            {filteredTeachers.length === 0 ? (
              <p className="px-3 py-4 font-body text-sm text-muted-foreground text-center">No teachers found</p>
            ) : (
              filteredTeachers.map((t: any) => (
                <button
                  key={t.user_id}
                  onClick={() => setSelectedTeacherId(t.user_id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                    selectedTeacherId === t.user_id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/40"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-body text-[13px] font-medium text-foreground truncate">{t.name}</p>
                    <p className="font-body text-[10px] text-muted-foreground truncate">{t.subjects?.join(", ") || "Teacher"}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedTeacherId ? "hidden sm:flex" : "flex"}`}>
        {!selectedTeacherId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-primary/40" />
              </div>
              <p className="font-body text-lg font-semibold text-foreground">Select a teacher to start chatting</p>
              <p className="font-body text-sm text-muted-foreground mt-1">Choose from the list on the left</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center gap-3 bg-card/80 backdrop-blur-sm">
              <button onClick={() => setSelectedTeacherId(null)} className="sm:hidden p-1.5 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-foreground">{selectedName}</p>
                <p className="font-body text-[10px] text-muted-foreground">Teacher</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted) / 0.1))" }}>
              {threadMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="font-body text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                threadMessages.map((msg: any, i: number) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      style={{ animation: `fade-in 0.3s ease-out ${Math.min(i * 30, 200)}ms both` }}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-card border border-border/40 text-foreground rounded-bl-md"
                      }`} style={isMe ? { boxShadow: "0 4px 16px hsl(var(--primary) / 0.2)" } : {}}>
                        {msg.subject && msg.subject !== "Message" && (
                          <p className={`text-[10px] font-bold mb-1 ${isMe ? "text-primary-foreground/70" : "text-primary"}`}>{msg.subject}</p>
                        )}
                        <p className="font-body text-[13px] whitespace-pre-line leading-relaxed">{msg.message}</p>
                        <div className={`flex items-center gap-1 mt-1.5 ${isMe ? "justify-end" : ""}`}>
                          <span className={`font-body text-[9px] ${isMe ? "text-primary-foreground/50" : "text-muted-foreground/60"}`}>
                            {formatMsgDate(msg.created_at)}
                          </span>
                          {isMe && (msg.is_read
                            ? <CheckCheck className="w-3 h-3 text-primary-foreground/60" />
                            : <Check className="w-3 h-3 text-primary-foreground/40" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/40 bg-card">
              {threadMessages.length === 0 && (
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Subject (optional)"
                  className="w-full mb-2 px-4 py-2 rounded-xl bg-muted/30 border border-border/40 font-body text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              )}
              <div className="flex items-center gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1 px-4 py-3 rounded-xl bg-muted/30 border border-border/40 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 disabled:opacity-30 hover:scale-105 active:scale-95 transition-all duration-200"
                  style={{ boxShadow: message.trim() ? "0 4px 16px hsl(var(--primary) / 0.3)" : "none" }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
