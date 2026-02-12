import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Bell, Pin } from "lucide-react";

export default function StudentNotices() {
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["student-notices"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notices")
        .select("*")
        .eq("is_active", true)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Notices</h2>
      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : notices.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No notices yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className={`bg-card border rounded-xl p-5 ${n.is_pinned ? "border-secondary" : "border-border"}`}>
              <div className="flex items-start gap-2">
                {n.is_pinned && <Pin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-body text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{n.type}</span>
                    <span className="font-body text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground">{n.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{n.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
