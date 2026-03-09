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

  const today = new Date().toISOString().split("T")[0];

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

  // Today's attendance
  const todayRecords = attendance.filter((a) => a.date === today);
  const todayStatus: "present" | "absent" | "none" =
    todayRecords.length === 0 ? "none" : todayRecords.some((r) => r.status === "absent") ? "absent" : "present";

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
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.04]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none" style={{ background: "hsla(var(--gold), 0.08)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">My Attendance</h2>
            {student && (
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                {(student as any).courses?.name || "—"} · {yearLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Today's Attendance Status */}
      <div className={`relative overflow-hidden border rounded-3xl p-5 sm:p-6 flex items-center gap-4 transition-all duration-500 hover:-translate-y-0.5 ${
        todayStatus === "present" ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_8px_30px_-10px_rgba(16,185,129,0.1)]" : todayStatus === "absent" ? "bg-red-500/5 border-red-500/20 shadow-[0_8px_30px_-10px_rgba(239,68,68,0.1)]" : "bg-card border-border/40"
      }`}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
          todayStatus === "present" ? "bg-emerald-500/10 border-emerald-500/15" : todayStatus === "absent" ? "bg-red-500/10 border-red-500/15" : "bg-muted/50 border-border/30"
        }`}>
          {todayStatus === "present" ? <CheckCircle className="w-7 h-7 text-emerald-500" />
          : todayStatus === "absent" ? <XCircle className="w-7 h-7 text-red-500" />
          : <Clock className="w-7 h-7 text-muted-foreground" />}
        </div>
        <div>
          <p className={`font-body text-base font-bold ${todayStatus === "present" ? "text-emerald-500" : todayStatus === "absent" ? "text-red-500" : "text-muted-foreground"}`}>
            {todayStatus === "present" ? "You're Present Today ✅" : todayStatus === "absent" ? "You're Marked Absent Today ❌" : "No Attendance Marked Yet"}
          </p>
          <p className="font-body text-xs text-muted-foreground mt-0.5">
            {todayStatus === "none" ? "Your teacher hasn't marked attendance yet today" : `${todayRecords.length} subject(s) marked today`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: total, label: "Total Classes", color: "text-foreground", bg: "" },
          { value: present, label: "Present", color: "text-primary", bg: "from-primary/8 to-primary/3" },
          { value: `${percentage}%`, label: "Attendance", color: percentage >= 75 ? "text-primary" : "text-destructive", bg: percentage >= 75 ? "from-primary/8 to-primary/3" : "from-destructive/8 to-destructive/3" },
        ].map((s, i) => (
          <div key={s.label} className={`relative overflow-hidden bg-card border border-border/40 rounded-3xl p-5 text-center hover:shadow-[0_12px_40px_-10px_hsla(var(--primary),0.08)] hover:-translate-y-1 transition-all duration-500 ${s.bg ? `bg-gradient-to-br ${s.bg}` : ""}`}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
            <p className={`font-body text-3xl font-semibold ${s.color}`}>{s.value}</p>
            <p className="font-body text-[10px] text-muted-foreground mt-1.5 uppercase tracking-[0.15em]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Circular Progress */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none"
                stroke={percentage >= 75 ? "hsl(var(--primary))" : "hsl(var(--destructive))"}
                strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`font-body text-lg font-semibold ${percentage >= 75 ? "text-primary" : "text-destructive"}`}>{percentage}%</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-foreground mb-3">Overall Attendance</h3>
            <div className="space-y-2">
              <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Present</span><span className="font-bold text-primary">{present} days</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Absent</span><span className="font-bold text-destructive">{absent} days</span></div>
              <div className="flex justify-between font-body text-sm"><span className="text-muted-foreground">Required (75%)</span><span className={`font-bold ${percentage >= 75 ? "text-primary" : "text-destructive"}`}>{percentage >= 75 ? "✅ Met" : `⚠️ Need ${Math.ceil(0.75 * total) - present} more`}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise */}
      {Object.keys(bySubject).length > 0 && (
        <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
          <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Subject-wise Attendance
          </h3>
          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, data]) => {
              const pct = Math.round((data.present / data.total) * 100);
              return (
                <div key={subject} className="space-y-1.5 p-3 rounded-2xl bg-muted/20 border border-border/20 hover:border-border/40 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm font-semibold text-foreground">{subject}</span>
                    <span className={`font-body text-xs font-bold px-2.5 py-1 rounded-full ${pct >= 75 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>{pct}% ({data.present}/{data.total})</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${pct >= 75 ? "bg-primary" : "bg-destructive"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Recent Records
        </h3>
        {isLoading ? (
          <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 rounded-2xl bg-muted/30 animate-pulse border border-border/10" />)}</div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-7 h-7 text-muted-foreground/30" />
            </div>
            <p className="font-body text-sm text-muted-foreground">No attendance records yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {attendance.slice(0, 25).map((a, i) => (
              <div key={a.id} className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${a.status === "present" ? "bg-primary/[0.03] border-primary/15 hover:border-primary/25" : "bg-destructive/[0.03] border-destructive/15 hover:border-destructive/25"}`} style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${a.status === "present" ? "bg-primary/10" : "bg-destructive/10"}`}>
                    {a.status === "present"
                      ? <CheckCircle className="w-4 h-4 text-primary" />
                      : <XCircle className="w-4 h-4 text-destructive" />}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">{a.subject}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{a.date}</p>
                  </div>
                </div>
                <span className={`font-body text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${a.status === "present" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
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
