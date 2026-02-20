import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle, TrendingUp, BookOpen, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentAttendance() {
  const { user } = useAuth();

  const { data: student } = useQuery({
    queryKey: ["student-record", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("students")
        .select("id, year_level, semester, courses(name, code)")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ["student-attendance", student?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", student!.id)
        .order("date", { ascending: false });
      return data || [];
    },
    enabled: !!student?.id,
  });

  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "present").length;
  const absent = total - present;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  // Group by subject
  const bySubject: Record<string, { total: number; present: number }> = {};
  attendance.forEach((a) => {
    if (!bySubject[a.subject]) bySubject[a.subject] = { total: 0, present: 0 };
    bySubject[a.subject].total++;
    if (a.status === "present") bySubject[a.subject].present++;
  });

  const yearLabel = student?.year_level === 1 ? "1st Year" : student?.year_level === 2 ? "2nd Year" : student?.year_level === 3 ? "3rd Year" : "—";

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-5">
        <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> My Attendance
        </h2>
        {student && (
          <p className="font-body text-xs text-muted-foreground mt-1">
            {(student as any).courses?.name || "—"} · {yearLabel}
          </p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <p className="font-display text-2xl font-bold text-foreground">{total}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">Total Classes</p>
        </div>
        <div className="bg-gradient-to-br from-primary/8 to-primary/3 border border-border rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <p className="font-display text-2xl font-bold text-primary">{present}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">Present</p>
        </div>
        <div className={`border border-border rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${percentage >= 75 ? "bg-gradient-to-br from-primary/8 to-primary/3" : "bg-gradient-to-br from-destructive/8 to-destructive/3"}`}>
          <p className={`font-display text-2xl font-bold ${percentage >= 75 ? "text-primary" : "text-destructive"}`}>{percentage}%</p>
          <p className="font-body text-xs text-muted-foreground mt-1">Attendance</p>
        </div>
      </div>

      {/* Circular Progress */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none"
                stroke={percentage >= 75 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                strokeWidth="10"
                strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-display text-lg font-bold ${percentage >= 75 ? "text-primary" : "text-destructive"}`}>{percentage}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-foreground mb-2">Overall Attendance</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Present</span><span className="font-semibold text-primary">{present} days</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Absent</span><span className="font-semibold text-destructive">{absent} days</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Required (75%)</span><span className={`font-semibold ${percentage >= 75 ? "text-primary" : "text-destructive"}`}>{percentage >= 75 ? "✅ Met" : `⚠️ Need ${Math.ceil(0.75 * total) - present} more`}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise */}
      {Object.keys(bySubject).length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Subject-wise Attendance
          </h3>
          <div className="space-y-3">
            {Object.entries(bySubject).map(([subject, data]) => {
              const pct = Math.round((data.present / data.total) * 100);
              return (
                <div key={subject} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm font-medium text-foreground">{subject}</span>
                    <span className={`font-body text-xs font-bold ${pct >= 75 ? "text-primary" : "text-destructive"}`}>{pct}% ({data.present}/{data.total})</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pct >= 75 ? "bg-primary" : "bg-destructive"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Recent Records
        </h3>
        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">No attendance records yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attendance.slice(0, 25).map((a) => (
              <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${a.status === "present" ? "bg-primary/4 border-primary/15" : "bg-destructive/4 border-destructive/15"}`}>
                <div className="flex items-center gap-3">
                  {a.status === "present"
                    ? <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{a.subject}</p>
                    <p className="font-body text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
                <span className={`font-body text-xs font-bold px-2.5 py-1 rounded-full ${a.status === "present" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
