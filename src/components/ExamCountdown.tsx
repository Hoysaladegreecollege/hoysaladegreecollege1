import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, format } from "date-fns";
import { Timer, AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function getUrgency(daysLeft: number) {
  if (daysLeft <= 3) return { color: "bg-red-500/10 border-red-500/20", text: "text-red-500", badge: "bg-red-500", label: "🔥 Critical" };
  if (daysLeft <= 7) return { color: "bg-amber-500/10 border-amber-500/20", text: "text-amber-500", badge: "bg-amber-500", label: "⚠️ Soon" };
  if (daysLeft <= 14) return { color: "bg-blue-500/10 border-blue-500/20", text: "text-blue-500", badge: "bg-blue-500", label: "📅 Upcoming" };
  return { color: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-500", badge: "bg-emerald-500", label: "✅ Planned" };
}

export default function ExamCountdown({ courseId, semester }: { courseId?: string; semester?: number }) {
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["student-exam-countdown", courseId, semester],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      let query = supabase.from("exams").select("*").eq("is_active", true).gte("exam_date", today).order("exam_date").limit(6);
      if (courseId) query = query.eq("course_id", courseId);
      if (semester) query = query.eq("semester", semester);
      const { data } = await query;
      return data || [];
    },
  });

  if (isLoading) return <Skeleton className="h-48 rounded-2xl" />;
  if (exams.length === 0) return null;

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
          <Timer className="w-4 h-4 text-red-500" />
        </div>
        <h3 className="font-body text-[14px] font-semibold text-foreground">Exam Countdown</h3>
        <span className="ml-auto font-body text-[10px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">{exams.length} upcoming</span>
      </div>
      <div className="space-y-2.5">
        {exams.map((exam: any) => {
          const daysLeft = differenceInDays(new Date(exam.exam_date), new Date());
          const urgency = getUrgency(daysLeft);
          return (
            <div key={exam.id} className={`relative flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${urgency.color}`}>
              {/* Days counter */}
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${urgency.badge} text-white shadow-sm`}>
                <span className="font-body text-lg font-bold leading-none tabular-nums">{daysLeft}</span>
                <span className="font-body text-[8px] uppercase tracking-wider leading-none mt-0.5">{daysLeft === 1 ? "day" : "days"}</span>
              </div>
              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-body text-[12px] font-semibold text-foreground truncate">{exam.title}</p>
                  <span className={`font-body text-[9px] font-bold px-1.5 py-0.5 rounded-full ${urgency.badge} text-white shrink-0`}>{urgency.label}</span>
                </div>
                <p className="font-body text-[11px] text-muted-foreground truncate">{exam.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-body text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {format(new Date(exam.exam_date), "EEE, MMM d, yyyy")}
                  </span>
                  <span className="font-body text-[9px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground capitalize">{exam.exam_type}</span>
                </div>
              </div>
              {/* Progress bar */}
              {daysLeft <= 14 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden">
                  <div className={`h-full ${urgency.badge} transition-all duration-1000`} style={{ width: `${Math.max(5, 100 - (daysLeft / 14) * 100)}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
