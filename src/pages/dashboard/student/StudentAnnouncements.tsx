import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Megaphone, BookOpen, Clock, Bell } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentAnnouncements() {
  const { user } = useAuth();

  const { data: student } = useQuery({
    queryKey: ["student-info-ann", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("course_id, semester").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["student-announcements", student?.course_id, student?.semester],
    queryFn: async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*, courses(name, code)")
        .eq("is_active", true)
        .or(`course_id.is.null,course_id.eq.${student!.course_id || "00000000-0000-0000-0000-000000000000"}`)
        .order("created_at", { ascending: false });
      // Filter by semester if announcement has a semester target
      return (data || []).filter((a: any) => !a.semester || a.semester === student?.semester);
    },
    enabled: !!student,
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" /> Announcements
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Announcements from your teachers and college administration
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground mb-1">No Announcements</h3>
          <p className="font-body text-sm text-muted-foreground">No announcements yet. Check back later.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a: any, i: number) => (
            <div key={a.id}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-fade-in-up group"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <h3 className="font-display text-base font-bold text-foreground">{a.title}</h3>
                    <span className="font-body text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {format(new Date(a.created_at), "MMM d, yyyy · h:mm a")}
                    </span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{a.content}</p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {a.courses?.name ? (
                      <span className="inline-flex items-center gap-1 font-body text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        <BookOpen className="w-3 h-3" /> {a.courses.name}
                      </span>
                    ) : (
                      <span className="font-body text-[10px] font-semibold px-2.5 py-1 rounded-full bg-secondary/15 text-secondary-foreground">All Courses</span>
                    )}
                    {a.semester && (
                      <span className="font-body text-[10px] font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        Semester {a.semester}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
