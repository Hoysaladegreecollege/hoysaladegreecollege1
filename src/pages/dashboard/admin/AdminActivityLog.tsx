import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, Search, User, FileText, Clock, DollarSign, Bell, Settings, Shield } from "lucide-react";
import { format } from "date-fns";

const entityIcons: Record<string, React.ElementType> = {
  feedback: FileText,
  user: User,
  fee: DollarSign,
  notice: Bell,
  settings: Settings,
  role: Shield,
  default: Activity,
};

const actionColors: Record<string, string> = {
  created: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  updated: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  deleted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  responded_feedback: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function AdminActivityLog() {
  const [search, setSearch] = useState("");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*, profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  const filtered = logs.filter((log: any) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(s) ||
      log.entity_type?.toLowerCase().includes(s) ||
      log.profiles?.full_name?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Activity Log
        </h1>
        <p className="text-muted-foreground mt-1">Track all administrative actions and system events</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by action, entity, or user..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No activity logs yet</p>
            <p className="text-xs text-muted-foreground mt-1">Actions will appear here as staff use the system</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {filtered.map((log: any) => {
              const Icon = entityIcons[log.entity_type] || entityIcons.default;
              const colorClass = actionColors[log.action] || "bg-muted text-muted-foreground";
              return (
                <div key={log.id} className="relative pl-12">
                  <div className="absolute left-3 top-3 w-4 h-4 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <Card className="hover:shadow-sm transition-shadow">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-muted/50">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm text-foreground">
                                {log.profiles?.full_name || "System"}
                              </span>
                              <Badge className={`text-xs ${colorClass}`}>
                                {log.action.replace(/_/g, " ")}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">{log.entity_type}</Badge>
                            </div>
                            {log.details && Object.keys(log.details).length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {JSON.stringify(log.details).slice(0, 100)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          {format(new Date(log.created_at), "PP p")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
