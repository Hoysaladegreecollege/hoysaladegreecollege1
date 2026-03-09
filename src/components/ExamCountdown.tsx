import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, format } from "date-fns";
import { Timer, Clock, Flame, CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function getUrgency(daysLeft: number) {
  if (daysLeft <= 3) return {
    bg: "bg-gradient-to-br from-red-500/12 to-red-600/6",
    border: "border-red-500/20",
    text: "text-red-400",
    badge: "bg-gradient-to-r from-red-500 to-rose-500",
    glow: "shadow-[0_0_24px_-4px_rgba(239,68,68,0.3)]",
    counterBg: "bg-gradient-to-br from-red-500 to-rose-600",
    label: "Critical",
    icon: "🔥",
    pulse: true,
  };
  if (daysLeft <= 7) return {
    bg: "bg-gradient-to-br from-amber-500/10 to-amber-600/5",
    border: "border-amber-500/20",
    text: "text-amber-400",
    badge: "bg-gradient-to-r from-amber-500 to-orange-500",
    glow: "shadow-[0_0_20px_-4px_rgba(245,158,11,0.22)]",
    counterBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    label: "Soon",
    icon: "⚡",
    pulse: false,
  };
  if (daysLeft <= 14) return {
    bg: "bg-gradient-to-br from-sky-500/8 to-blue-500/4",
    border: "border-sky-500/15",
    text: "text-sky-400",
    badge: "bg-gradient-to-r from-sky-500 to-blue-500",
    glow: "",
    counterBg: "bg-gradient-to-br from-sky-500 to-blue-600",
    label: "Upcoming",
    icon: "📅",
    pulse: false,
  };
  return {
    bg: "bg-gradient-to-br from-emerald-500/8 to-teal-500/4",
    border: "border-emerald-500/15",
    text: "text-emerald-400",
    badge: "bg-gradient-to-r from-emerald-500 to-teal-500",
    glow: "",
    counterBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    label: "Planned",
    icon: "✅",
    pulse: false,
  };
}

export default function ExamCountdown({ courseId, semester }: { courseId?: string; semester?: number }) {
  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["student-exam-countdown", courseId, semester],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      let query = supabase.from("exams").select("*").eq("is_active", true).gte("exam_date", today).order("exam_date").limit(6);
      if (courseId) {
        query = query.or(`course_id.eq.${courseId},course_id.is.null`);
      }
      if (semester) query = query.eq("semester", semester);
      const { data } = await query;
      return data || [];
    },
  });

  if (isLoading) return <Skeleton className="h-48 rounded-[2rem]" />;
  if (exams.length === 0) return null;

  return (
    <div className="relative bg-card/80 backdrop-blur-xl border border-border/30 rounded-[2rem] p-6 sm:p-7 overflow-hidden group hover:shadow-[0_12px_48px_-12px_rgba(0,0,0,0.35)] transition-all duration-500">
      {/* Ambient glow orbs */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-red-500/[0.03] blur-[60px] pointer-events-none group-hover:bg-red-500/[0.06] transition-colors duration-700" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-amber-500/[0.03] blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center gap-3 mb-6">
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500/15 to-rose-500/8 flex items-center justify-center border border-red-500/10 shadow-sm">
          <Timer className="w-[18px] h-[18px] text-red-400" />
          <div className="absolute inset-0 rounded-2xl bg-red-500/5 animate-pulse pointer-events-none" />
        </div>
        <div>
          <h3 className="font-body text-[15px] font-semibold text-foreground tracking-tight">Exam Countdown</h3>
          <p className="font-body text-[10px] text-muted-foreground/60 -mt-0.5 tracking-wide">Upcoming assessments</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 bg-muted/30 backdrop-blur-sm border border-border/20 px-3 py-1.5 rounded-2xl">
          <Flame className="w-3 h-3 text-red-400 opacity-80" />
          <span className="font-body text-[10px] font-medium text-muted-foreground">{exams.length} upcoming</span>
        </div>
      </div>

      {/* Exam cards */}
      <div className="space-y-3">
        {exams.map((exam: any, index: number) => {
          const daysLeft = differenceInDays(new Date(exam.exam_date), new Date());
          const urgency = getUrgency(daysLeft);
          return (
            <div
              key={exam.id}
              className={`relative flex items-center gap-4 p-4 rounded-[1.25rem] border transition-all duration-400 hover:-translate-y-0.5 ${urgency.bg} ${urgency.border} ${urgency.glow} group/card overflow-hidden`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />

              {/* Days counter */}
              <div className={`relative w-[3.5rem] h-[3.5rem] rounded-[1rem] flex flex-col items-center justify-center shrink-0 ${urgency.counterBg} text-white shadow-lg`}>
                <span className="font-body text-xl font-bold leading-none tabular-nums drop-shadow-sm">{daysLeft}</span>
                <span className="font-body text-[7px] uppercase tracking-[0.15em] leading-none mt-0.5 opacity-75">{daysLeft === 1 ? "day" : "days"}</span>
                {urgency.pulse && (
                  <div className="absolute inset-0 rounded-[1rem] border-2 border-red-400/40 animate-ping opacity-25 pointer-events-none" />
                )}
              </div>

              {/* Details */}
              <div className="relative flex-1 min-w-0 z-10">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-body text-[12.5px] font-semibold text-foreground truncate">{exam.title}</p>
                  <span className={`inline-flex items-center gap-0.5 font-body text-[8px] font-bold px-2 py-[3px] rounded-full ${urgency.badge} text-white shrink-0 shadow-sm`}>
                    <span className="leading-none">{urgency.icon}</span>
                    <span className="tracking-wide leading-none">{urgency.label}</span>
                  </span>
                </div>
                <p className="font-body text-[11px] text-foreground/65 truncate font-medium">{exam.subject}</p>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <span className="font-body text-[10px] text-muted-foreground/70 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 opacity-50" />
                    {format(new Date(exam.exam_date), "EEE, MMM d, yyyy")}
                  </span>
                  <span className="font-body text-[9px] px-2 py-[3px] rounded-lg bg-muted/40 backdrop-blur-sm border border-border/15 text-muted-foreground/80 capitalize tracking-wide">{exam.exam_type}</span>
                </div>
              </div>

              {/* Progress bar */}
              {daysLeft <= 14 && (
                <div className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full overflow-hidden bg-border/10">
                  <div
                    className={`h-full rounded-full ${urgency.counterBg} transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.max(5, 100 - (daysLeft / 14) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
