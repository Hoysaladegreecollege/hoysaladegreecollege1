import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function StudentAttendance() {
  const { user } = useAuth();

  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ["student-attendance", user?.id],
    queryFn: async () => {
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user!.id)
        .single();
      if (!student) return [];
      const { data } = await supabase
        .from("attendance")
        .select("*")
        .eq("student_id", student.id)
        .order("date", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const total = attendance.length;
  const present = attendance.filter((a) => a.status === "present").length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Attendance</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-foreground">{total}</p>
          <p className="font-body text-xs text-muted-foreground">Total Classes</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-primary">{present}</p>
          <p className="font-body text-xs text-muted-foreground">Present</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className={`font-display text-2xl font-bold ${percentage >= 75 ? "text-primary" : "text-destructive"}`}>{percentage}%</p>
          <p className="font-body text-xs text-muted-foreground">Percentage</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg font-bold text-foreground mb-4">Recent Records</h3>
        {isLoading ? (
          <p className="font-body text-sm text-muted-foreground">Loading...</p>
        ) : attendance.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No attendance records yet.</p>
        ) : (
          <div className="space-y-2">
            {attendance.slice(0, 30).map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {a.status === "present" ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{a.subject}</p>
                    <p className="font-body text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
                <span className={`font-body text-xs font-semibold px-2 py-1 rounded ${a.status === "present" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
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
