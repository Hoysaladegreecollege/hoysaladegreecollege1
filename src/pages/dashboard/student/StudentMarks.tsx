import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";

export default function StudentMarks() {
  const { user } = useAuth();

  const { data: marks = [], isLoading } = useQuery({
    queryKey: ["student-marks", user?.id],
    queryFn: async () => {
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user!.id)
        .single();
      if (!student) return [];
      const { data } = await supabase
        .from("marks")
        .select("*")
        .eq("student_id", student.id)
        .order("semester", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  const grouped = marks.reduce((acc: Record<string, typeof marks>, m) => {
    const key = `Semester ${m.semester || 1} - ${m.exam_type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Marks & Results</h2>

      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : marks.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="font-body text-sm text-muted-foreground">No marks uploaded yet.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([key, items]) => (
          <div key={key} className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">{key}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left font-body text-xs text-muted-foreground pb-2">Subject</th>
                    <th className="text-center font-body text-xs text-muted-foreground pb-2">Obtained</th>
                    <th className="text-center font-body text-xs text-muted-foreground pb-2">Max</th>
                    <th className="text-center font-body text-xs text-muted-foreground pb-2">%</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => {
                    const pct = Math.round((m.obtained_marks / m.max_marks) * 100);
                    return (
                      <tr key={m.id} className="border-b border-border/50">
                        <td className="font-body text-sm py-2">{m.subject}</td>
                        <td className="font-body text-sm text-center py-2">{m.obtained_marks}</td>
                        <td className="font-body text-sm text-center py-2">{m.max_marks}</td>
                        <td className={`font-body text-sm text-center py-2 font-semibold ${pct >= 40 ? "text-primary" : "text-destructive"}`}>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
