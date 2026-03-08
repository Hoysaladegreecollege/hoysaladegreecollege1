import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const STANDARD_PERIODS = [
  "9:00 - 9:50", "9:50 - 10:40", "10:50 - 11:40", "11:40 - 12:30",
  "1:10 - 2:00", "2:00 - 2:50", "2:50 - 3:40",
];

const parseStartMinutes = (period: string): number => {
  const match = period.match(/\b(\d{1,2}):(\d{2})\b/);
  if (!match) {
    const numMatch = period.match(/\b(\d)\b/);
    if (numMatch) {
      const idx = parseInt(numMatch[1]) - 1;
      const std = STANDARD_PERIODS[idx];
      if (std) { const tm = std.match(/(\d{1,2}):(\d{2})/); if (tm) return parseInt(tm[1]) * 60 + parseInt(tm[2]); }
    }
    return 999;
  }
  const h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const normalizedH = h >= 1 && h <= 8 ? h + 12 : h;
  return normalizedH * 60 + m;
};

const sortByPeriod = (a: any, b: any) => parseStartMinutes(a.period) - parseStartMinutes(b.period);

export default function StudentTimetable() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return days.includes(today) ? today : "Monday";
  });

  const { data: student } = useQuery({
    queryKey: ["student-info", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*, courses(name, code)").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["student-timetable", student?.course_id],
    queryFn: async () => {
      let query = supabase.from("timetables").select("*");
      if (student?.course_id) query = query.or(`course_id.eq.${student.course_id},course_id.is.null`);
      const { data } = await query;
      return data || [];
    },
    enabled: !!student,
  });

  const dayEntries = entries.filter((e: any) => e.day_of_week === selectedDay).sort(sortByPeriod);

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.04]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] bg-primary/[0.08]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">My Timetable</h2>
              <p className="font-body text-sm text-muted-foreground">
                {student?.courses?.name ? `${student.courses.name} (${student.courses.code})` : "Loading..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Day selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day, i) => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`px-4 py-2.5 rounded-2xl font-body text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
              selectedDay === day
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                : "bg-card border border-border/60 text-muted-foreground hover:bg-muted hover:border-border hover:-translate-y-0.5"
            }`}
            style={{ animationDelay: `${i * 40}ms` }}>
            {day}
          </button>
        ))}
      </div>

      {/* Timetable for selected day */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted/50 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-card border border-border/40 rounded-3xl p-5 sm:p-7">
          <h3 className="font-display text-sm font-bold text-foreground mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" /> {selectedDay}'s Schedule
          </h3>
          {dayEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="font-body text-sm text-muted-foreground">No classes scheduled for {selectedDay}.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {dayEntries.map((e: any, i: number) => (
                <div key={e.id}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/30 hover:bg-muted/40 hover:border-border/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="text-center shrink-0 w-24 bg-primary/[0.06] border border-primary/10 rounded-xl py-2.5">
                    <p className="font-body text-xs font-bold text-primary">{e.period}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">{e.subject}</p>
                    {e.teacher_name && <p className="font-body text-xs text-muted-foreground mt-0.5">👤 {e.teacher_name}</p>}
                  </div>
                  {e.room && (
                    <span className="font-body text-[10px] px-3 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-primary font-semibold shrink-0">
                      📍 {e.room}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full week overview */}
      <div className="bg-card border border-border/40 rounded-3xl p-5 sm:p-7">
        <h3 className="font-display text-sm font-bold text-foreground mb-5">Full Week Overview</h3>
        <div className="overflow-x-auto space-y-5">
          {days.map((day) => {
            const de = entries.filter((e: any) => e.day_of_week === day).sort(sortByPeriod);
            if (de.length === 0) return null;
            return (
              <div key={day}>
                <h4 className="font-display text-xs font-bold text-primary uppercase tracking-wider mb-2.5">{day}</h4>
                <div className="space-y-1.5">
                  {de.map((e: any, i: number) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/20 hover:bg-muted/40 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${i * 30}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                      <span className="font-body text-xs font-bold text-primary w-24 shrink-0">{e.period}</span>
                      <span className="font-body text-sm text-foreground">{e.subject}</span>
                      {e.teacher_name && <span className="font-body text-xs text-muted-foreground">({e.teacher_name})</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-8">No timetable data available.</p>}
        </div>
      </div>
    </div>
  );
}
