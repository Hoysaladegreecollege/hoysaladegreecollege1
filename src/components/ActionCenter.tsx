import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, Bell, CheckCircle, Clock, FileText, Mail, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ActionItem {
  label: string;
  desc: string;
  path: string;
  icon: React.ElementType;
  count?: number;
  priority: "high" | "medium" | "low";
}

export default function ActionCenter({ role }: { role: "admin" | "principal" | "teacher" | "student" }) {
  const { data, isLoading } = useQuery({
    queryKey: ["action-center", role],
    queryFn: async () => {
      const actions: ActionItem[] = [];

      if (role === "admin" || role === "principal") {
        const [apps, contacts, notices] = await Promise.all([
          supabase.from("admission_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
        ]);

        if ((apps.count || 0) > 0) {
          actions.push({
            label: "Pending Applications",
            desc: `${apps.count} application${(apps.count || 0) > 1 ? "s" : ""} waiting for review`,
            path: role === "admin" ? "/dashboard/admin/applications" : "/dashboard/principal/notices",
            icon: FileText,
            count: apps.count || 0,
            priority: "high",
          });
        }
        if (role === "admin" && (contacts.count || 0) > 0) {
          actions.push({
            label: "Unread Messages",
            desc: `${contacts.count} new contact message${(contacts.count || 0) > 1 ? "s" : ""}`,
            path: "/dashboard/admin/contacts",
            icon: Mail,
            count: contacts.count || 0,
            priority: "medium",
          });
        }
        actions.push({
          label: "Active Notices",
          desc: `${notices.count || 0} published on board`,
          path: role === "admin" ? "/dashboard/admin/post-notice" : "/dashboard/principal/notices",
          icon: Bell,
          count: notices.count || 0,
          priority: "low",
        });
      }

      if (role === "teacher") {
        const [notices, materials] = await Promise.all([
          supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("study_materials").select("id", { count: "exact", head: true }),
        ]);
        actions.push(
          { label: "Mark Today's Attendance", desc: "Keep class records up to date", path: "/dashboard/teacher/attendance", icon: Clock, priority: "high" },
          { label: "Active Notices", desc: `${notices.count || 0} published`, path: "/dashboard/teacher/notices", icon: Bell, count: notices.count || 0, priority: "low" },
          { label: "Study Materials", desc: `${materials.count || 0} uploaded`, path: "/dashboard/teacher/materials", icon: Megaphone, count: materials.count || 0, priority: "low" },
        );
      }

      if (role === "student") {
        const notices = await supabase.from("notices").select("id", { count: "exact", head: true }).eq("is_active", true);
        const announcements = await supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_active", true);
        actions.push(
          { label: "Check Notices", desc: `${notices.count || 0} active notices`, path: "/dashboard/student/notices", icon: Bell, count: notices.count || 0, priority: "medium" },
          { label: "Teacher Announcements", desc: `${announcements.count || 0} announcements`, path: "/dashboard/student/announcements", icon: Megaphone, count: announcements.count || 0, priority: "medium" },
        );
      }

      return actions;
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-5">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...data].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-secondary" /> Action Center
      </h3>
      <div className="space-y-2">
        {sorted.map((action, i) => (
          <Link
            key={i}
            to={action.path}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 group hover:shadow-md hover:-translate-y-0.5 ${
              action.priority === "high"
                ? "border-destructive/20 bg-destructive/5 hover:border-destructive/40"
                : action.priority === "medium"
                ? "border-secondary/20 bg-secondary/5 hover:border-secondary/40"
                : "border-border bg-muted/20 hover:border-primary/20"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              action.priority === "high" ? "bg-destructive/10" : action.priority === "medium" ? "bg-secondary/10" : "bg-primary/10"
            }`}>
              <action.icon className={`w-4 h-4 ${
                action.priority === "high" ? "text-destructive" : action.priority === "medium" ? "text-secondary-foreground" : "text-primary"
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-semibold text-foreground">{action.label}</p>
              <p className="font-body text-[10px] text-muted-foreground">{action.desc}</p>
            </div>
            {action.count !== undefined && action.count > 0 && (
              <span className={`text-[10px] font-body font-bold px-2 py-0.5 rounded-full shrink-0 ${
                action.priority === "high" ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"
              }`}>
                {action.count}
              </span>
            )}
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
