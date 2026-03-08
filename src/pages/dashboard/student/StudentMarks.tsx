import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Calculator, TrendingUp, Award, Download, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const GRADE_MAP = [
  { min: 90, grade: "O", points: 10, label: "Outstanding" },
  { min: 80, grade: "A+", points: 9, label: "Excellent" },
  { min: 70, grade: "A", points: 8, label: "Very Good" },
  { min: 60, grade: "B+", points: 7, label: "Good" },
  { min: 50, grade: "B", points: 6, label: "Above Average" },
  { min: 40, grade: "C", points: 5, label: "Average" },
  { min: 0, grade: "F", points: 0, label: "Fail" },
];

function getGrade(pct: number) { return GRADE_MAP.find(g => pct >= g.min) || GRADE_MAP[GRADE_MAP.length - 1]; }

function downloadCSV(marks: any[]) {
  const headers = "Semester,Exam Type,Subject,Obtained,Max,Percentage,Grade\n";
  const rows = marks.map(m => {
    const pct = Math.round((m.obtained_marks / m.max_marks) * 100);
    return `${m.semester || 1},${m.exam_type},${m.subject},${m.obtained_marks},${m.max_marks},${pct}%,${getGrade(pct).grade}`;
  }).join("\n");
  const blob = new Blob([headers + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "marks_report.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function StudentMarks() {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const { data: marks = [], isLoading } = useQuery({
    queryKey: ["student-marks", user?.id],
    queryFn: async () => {
      const { data: student } = await supabase.from("students").select("id").eq("user_id", user!.id).single();
      if (!student) return [];
      const { data } = await supabase.from("marks").select("*").eq("student_id", student.id).order("semester", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  const semesters = Array.from(new Set(marks.map(m => m.semester || 1))).sort();
  const filteredMarks = selectedSemester === "all" ? marks : marks.filter(m => (m.semester || 1) === Number(selectedSemester));

  const grouped = filteredMarks.reduce((acc: Record<string, typeof marks>, m) => {
    const key = `Semester ${m.semester || 1} - ${m.exam_type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const sgpaData = semesters.map(sem => {
    const semMarks = marks.filter(m => (m.semester || 1) === sem);
    const avg = semMarks.length > 0 ? semMarks.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / semMarks.length : 0;
    return { semester: `Sem ${sem}`, sgpa: getGrade(avg).points, avg: Math.round(avg), subjects: semMarks.length };
  });

  const cgpa = sgpaData.length > 0 ? (sgpaData.reduce((s, d) => s + d.sgpa, 0) / sgpaData.length).toFixed(2) : "0.00";
  const overallAvg = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marks.length) : 0;
  const overallGrade = getGrade(overallAvg);

  const subjectPerformance: Record<string, { total: number; count: number }> = {};
  marks.forEach(m => {
    if (!subjectPerformance[m.subject]) subjectPerformance[m.subject] = { total: 0, count: 0 };
    subjectPerformance[m.subject].total += (m.obtained_marks / m.max_marks) * 100;
    subjectPerformance[m.subject].count++;
  });
  const radarData = Object.entries(subjectPerformance).map(([subject, { total, count }]) => ({
    subject: subject.length > 12 ? subject.slice(0, 12) + "…" : subject, score: Math.round(total / count), fullMark: 100,
  })).slice(0, 8);

  const totalPassed = marks.filter(m => (m.obtained_marks / m.max_marks) * 100 >= 40).length;
  const totalFailed = marks.length - totalPassed;

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <div className="relative overflow-hidden bg-card border border-border/40 rounded-3xl p-6 sm:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.04]" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] bg-primary/[0.08]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Marks & Academic Progress</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}
                className="appearance-none bg-muted/40 border border-border/60 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="all">All Semesters</option>
                {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {marks.length > 0 && (
              <button onClick={() => downloadCSV(marks)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                <Download className="w-4 h-4" /> Export
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : marks.length === 0 ? (
        <div className="bg-card border border-border/40 rounded-3xl p-14 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-muted-foreground/40" />
          </div>
          <p className="font-body text-sm text-muted-foreground">No marks uploaded yet.</p>
        </div>
      ) : (
        <>
          {/* GPA Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "CGPA", value: cgpa, icon: Calculator, color: "text-primary", bg: "bg-primary/10" },
              { label: overallGrade.label, value: overallGrade.grade, icon: Award, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Overall Avg", value: `${overallAvg}%`, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Pass / Fail", value: `${totalPassed}/${totalFailed}`, icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/10" },
            ].map(({ label, value, icon: Icon, color, bg }, i) => (
              <div key={label} className="bg-card border border-border/40 rounded-3xl p-5 text-center group hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <p className={`font-body text-3xl font-bold text-foreground group-hover:${color} transition-colors`}>{value}</p>
                <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border/40 rounded-3xl p-6">
              <h3 className="font-body text-sm font-semibold text-foreground mb-4">SGPA Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sgpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 16, fontSize: 12 }} />
                  <Bar dataKey="sgpa" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {radarData.length >= 3 && (
              <div className="bg-card border border-border/40 rounded-3xl p-6">
                <h3 className="font-body text-sm font-semibold text-foreground mb-4">Subject Performance</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Semester-wise Grade Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sgpaData.map((d, i) => (
              <div key={d.semester} className="bg-card border border-border/40 rounded-3xl p-5 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-body text-sm font-semibold text-foreground">{d.semester}</h4>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${d.avg >= 75 ? "bg-emerald-500/10 text-emerald-500" : d.avg >= 40 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`}>
                    {getGrade(d.avg).grade}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-body text-2xl font-bold text-foreground">{d.sgpa}</p>
                    <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">SGPA</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-lg font-semibold text-muted-foreground">{d.avg}%</p>
                    <p className="font-body text-[10px] text-muted-foreground">{d.subjects} subjects</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${d.avg >= 75 ? "bg-emerald-500" : d.avg >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${d.avg}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Marks Tables */}
          {Object.entries(grouped).map(([key, items], gi) => {
            const semAvg = items.length > 0 ? Math.round(items.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / items.length) : 0;
            return (
              <div key={key} className="bg-card border border-border/40 rounded-3xl overflow-hidden animate-fade-in"
                style={{ animationDelay: `${gi * 60}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                <div className="relative flex items-center justify-between px-6 py-4 border-b border-border/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent" />
                  <h3 className="relative font-body text-base font-semibold text-foreground">{key}</h3>
                  <span className={`relative text-xs font-bold px-3 py-1 rounded-full ${semAvg >= 75 ? "bg-emerald-500/10 text-emerald-500" : semAvg >= 40 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`}>
                    Avg: {semAvg}%
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/20">
                        <th className="text-left font-body text-xs text-muted-foreground py-3 px-6">Subject</th>
                        <th className="text-center font-body text-xs text-muted-foreground py-3 px-4">Obtained</th>
                        <th className="text-center font-body text-xs text-muted-foreground py-3 px-4">Max</th>
                        <th className="text-center font-body text-xs text-muted-foreground py-3 px-4">%</th>
                        <th className="text-center font-body text-xs text-muted-foreground py-3 px-4">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((m) => {
                        const pct = Math.round((m.obtained_marks / m.max_marks) * 100);
                        const grade = getGrade(pct);
                        return (
                          <tr key={m.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                            <td className="font-body text-sm py-3 px-6">{m.subject}</td>
                            <td className="font-body text-sm text-center py-3 px-4 tabular-nums">{m.obtained_marks}</td>
                            <td className="font-body text-sm text-center py-3 px-4 tabular-nums text-muted-foreground">{m.max_marks}</td>
                            <td className={`font-body text-sm text-center py-3 px-4 font-semibold tabular-nums ${pct >= 40 ? "text-primary" : "text-destructive"}`}>{pct}%</td>
                            <td className="text-center py-3 px-4">
                              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${pct >= 75 ? "bg-emerald-500/10 text-emerald-500" : pct >= 40 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`}>
                                {grade.grade}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
