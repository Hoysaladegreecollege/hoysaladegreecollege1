import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TYPE_COLORS: Record<string, string> = {
  attendance: "bg-blue-500/10 text-blue-500",
  material: "bg-emerald-500/10 text-emerald-500",
  announcement: "bg-purple-500/10 text-purple-500",
  promotion: "bg-amber-500/10 text-amber-500",
  general: "bg-primary/10 text-primary",
};

export default function NotificationCenter() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["user-notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);
      return (data || []) as any[];
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const unread = notifications.filter((n: any) => !n.is_read).length;

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").update({ is_read: true } as any).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-notifications"] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("notifications").update({ is_read: true } as any).eq("user_id", user.id).eq("is_read", false);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-notifications"] }),
  });

  const clearAll = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("notifications").delete().eq("user_id", user.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user-notifications"] }),
  });

  const handleClick = (n: any) => {
    if (!n.is_read) markRead.mutate(n.id);
    if (n.link) {
      navigate(n.link);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-muted transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">Notifications</h3>
              <div className="flex gap-1">
                {unread > 0 && (
                  <button onClick={() => markAllRead.mutate()} className="text-[10px] font-body font-semibold px-2 py-1 rounded-lg hover:bg-muted text-primary transition-colors">
                    <Check className="w-3 h-3 inline mr-0.5" /> Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={() => clearAll.mutate()} className="text-[10px] font-body font-semibold px-2 py-1 rounded-lg hover:bg-muted text-destructive transition-colors">
                    <Trash2 className="w-3 h-3 inline mr-0.5" /> Clear
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="font-body text-xs text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n: any) => (
                  <div
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors ${!n.is_read ? "bg-primary/[0.03]" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.is_read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[n.type] || TYPE_COLORS.general}`}>
                            {n.type}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-body">
                            {new Date(n.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-body text-sm font-semibold text-foreground truncate">{n.title}</p>
                        <p className="font-body text-xs text-muted-foreground truncate">{n.message}</p>
                      </div>
                      {n.link && <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
