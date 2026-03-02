import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationBadge() {
  const { role } = useAuth();

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notices-count"],
    queryFn: async () => {
      const lastSeen = localStorage.getItem("hdc_notices_last_seen");
      let query = supabase
        .from("notices")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);

      if (lastSeen) {
        query = query.gt("created_at", lastSeen);
      }

      const { count } = await query;
      return count || 0;
    },
    refetchInterval: 60000, // refresh every minute
  });

  const noticesPath = role === "student" ? "/dashboard/student/notices"
    : role === "teacher" ? "/dashboard/teacher/notices"
    : role === "principal" ? "/dashboard/principal/notices"
    : "/dashboard/admin/post-notice";

  const handleClick = () => {
    localStorage.setItem("hdc_notices_last_seen", new Date().toISOString());
  };

  return (
    <Link
      to={noticesPath}
      onClick={handleClick}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors duration-200"
      title="Notices"
    >
      <Bell className="w-4.5 h-4.5 text-muted-foreground" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold font-body leading-none animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
