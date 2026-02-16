import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Sort periods by time (e.g. "9:00 - 9:50" comes before "10:50 - 11:40")
const sortByPeriod = (a: any, b: any) => {
  const getTime = (p: string) => {
    const match = p.match(/(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  };
  return getTime(a.period) - getTime(b.period);
};

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
      if (student?.course_id) {
        query = query.or(`course_id.eq.${student.course_id},course_id.is.null`);
      }
      const { data } = await query;
      return data || [];
    },
    enabled: !!student,
  });

  const dayEntries = entries.filter((e: any) => e.day_of_week === selectedDay).sort(sortByPeriod);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> My Timetable
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          {student?.courses?.name ? `Course: ${student.courses.name} (${student.courses.code})` : "Loading..."}
        </p>
      </div>

      {/* Day selector tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button key={day} onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl font-body text-xs font-medium whitespace-nowrap transition-all ${
              selectedDay === day ? "bg-primary text-primary-foreground shadow-lg" : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}>
            {day}
          </button>
        ))}
      </div>

      {/* Timetable for selected day */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary" /> {selectedDay}'s Schedule
          </h3>
          {dayEntries.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-8">No classes scheduled for {selectedDay}.</p>
          ) : (
            <div className="space-y-2">
              {dayEntries.map((e: any, i: number) => (
                <div key={e.id} className="flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="text-center shrink-0 w-24 bg-primary/5 rounded-lg py-2">
                    <p className="font-body text-xs font-bold text-primary">{e.period}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">{e.subject}</p>
                    {e.teacher_name && <p className="font-body text-xs text-muted-foreground">👤 {e.teacher_name}</p>}
                  </div>
                  {e.room && <span className="font-body text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary shrink-0">📍 {e.room}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full week overview */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <h3 className="font-display text-sm font-bold text-foreground mb-4">Full Week Overview</h3>
        <div className="overflow-x-auto">
          {days.map((day) => {
            const de = entries.filter((e: any) => e.day_of_week === day).sort(sortByPeriod);
            if (de.length === 0) return null;
            return (
              <div key={day} className="mb-4">
                <h4 className="font-display text-xs font-bold text-primary uppercase tracking-wider mb-2">{day}</h4>
                <div className="space-y-1">
                  {de.map((e: any) => (
                    <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                      <span className="font-body text-xs font-bold text-primary w-24 shrink-0">{e.period}</span>
                      <span className="font-body text-sm text-foreground">{e.subject}</span>
                      {e.teacher_name && <span className="font-body text-xs text-muted-foreground">({e.teacher_name})</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-4">No timetable data available.</p>}
        </div>
      </div>
    </div>
  );
}
