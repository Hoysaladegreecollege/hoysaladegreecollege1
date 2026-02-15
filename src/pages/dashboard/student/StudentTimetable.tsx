import { useState } from "react";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function StudentTimetable() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Get student's course
  const { data: student } = useQuery({
    queryKey: ["student-info", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*, courses(name, code)").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Get timetable entries for student's course
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["student-timetable", student?.course_id],
    queryFn: async () => {
      let query = supabase.from("timetables").select("*").order("day_of_week").order("period");
      if (student?.course_id) {
        query = query.or(`course_id.eq.${student.course_id},course_id.is.null`);
      }
      const { data } = await query;
      return data || [];
    },
    enabled: !!student,
  });

  // Get the day of week for selected date
  const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" /> My Timetable
        </h2>
        <p className="font-body text-sm text-muted-foreground mt-1">
          {student?.courses?.name ? `Course: ${student.courses.name}` : "Loading..."}
        </p>
      </div>

      {/* Date picker */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
        <label className="font-body text-xs font-semibold text-foreground block mb-2">Select Date</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        <p className="font-body text-xs text-muted-foreground mt-2">
          Showing timetable for: <span className="font-semibold text-primary">{selectedDay}</span>
        </p>
      </div>

      {/* Timetable for selected day */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <h3 className="font-display text-sm font-bold text-foreground mb-4">{selectedDay}'s Schedule</h3>
          {entries.filter((e: any) => e.day_of_week === selectedDay).length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-8">No classes scheduled for {selectedDay}.</p>
          ) : (
            <div className="space-y-2">
              {entries.filter((e: any) => e.day_of_week === selectedDay).map((e: any) => (
                <div key={e.id} className="flex items-center gap-4 p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-center shrink-0 w-20">
                    <p className="font-body text-xs font-bold text-primary">{e.period}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground">{e.subject}</p>
                    {e.teacher_name && <p className="font-body text-xs text-muted-foreground">{e.teacher_name}</p>}
                  </div>
                  {e.room && <span className="font-body text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary shrink-0">{e.room}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Full week view */}
          <div className="mt-8">
            <h3 className="font-display text-sm font-bold text-foreground mb-4">Full Week View</h3>
            <div className="overflow-x-auto">
              {days.map((day) => {
                const dayEntries = entries.filter((e: any) => e.day_of_week === day);
                if (dayEntries.length === 0) return null;
                return (
                  <div key={day} className="mb-4">
                    <h4 className="font-display text-xs font-bold text-primary uppercase tracking-wider mb-2">{day}</h4>
                    <div className="space-y-1">
                      {dayEntries.map((e: any) => (
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
