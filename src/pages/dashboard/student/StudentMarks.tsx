import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Calculator, TrendingUp, Award, Download, ChevronDown } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

const GRADE_MAP = [
  { min: 90, grade: "O", points: 10, label: "Outstanding" },
  { min: 80, grade: "A+", points: 9, label: "Excellent" },
  { min: 70, grade: "A", points: 8, label: "Very Good" },
  { min: 60, grade: "B+", points: 7, label: "Good" },
  { min: 50, grade: "B", points: 6, label: "Above Average" },
  { min: 40, grade: "C", points: 5, label: "Average" },
  { min: 0, grade: "F", points: 0, label: "Fail" },
];

function getGrade(pct: number) {
  return GRADE_MAP.find(g => pct >= g.min) || GRADE_MAP[GRADE_MAP.length - 1];
}

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

  // SGPA per semester
  const sgpaData = semesters.map(sem => {
    const semMarks = marks.filter(m => (m.semester || 1) === sem);
    const avg = semMarks.length > 0 ? semMarks.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / semMarks.length : 0;
    const grade = getGrade(avg);
    return { semester: `Sem ${sem}`, sgpa: grade.points, avg: Math.round(avg), subjects: semMarks.length };
  });

  // CGPA
  const cgpa = sgpaData.length > 0 ? (sgpaData.reduce((s, d) => s + d.sgpa, 0) / sgpaData.length).toFixed(2) : "0.00";
  const overallAvg = marks.length > 0 ? Math.round(marks.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / marks.length) : 0;
  const overallGrade = getGrade(overallAvg);

  // Subject performance radar
  const subjectPerformance: Record<string, { total: number; count: number }> = {};
  marks.forEach(m => {
    if (!subjectPerformance[m.subject]) subjectPerformance[m.subject] = { total: 0, count: 0 };
    subjectPerformance[m.subject].total += (m.obtained_marks / m.max_marks) * 100;
    subjectPerformance[m.subject].count++;
  });
  const radarData = Object.entries(subjectPerformance).map(([subject, { total, count }]) => ({
    subject: subject.length > 12 ? subject.slice(0, 12) + "…" : subject,
    score: Math.round(total / count),
    fullMark: 100,
  })).slice(0, 8);

  const totalPassed = marks.filter(m => (m.obtained_marks / m.max_marks) * 100 >= 40).length;
  const totalFailed = marks.length - totalPassed;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Marks & Academic Progress</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedSemester}
              onChange={e => setSelectedSemester(e.target.value)}
              className="appearance-none bg-card border border-border rounded-xl px-4 py-2 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Semesters</option>
              {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          {marks.length > 0 && (
            <button onClick={() => downloadCSV(marks)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : marks.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No marks uploaded yet.</p>
        </div>
      ) : (
        <>
          {/* GPA Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <p className="font-body text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{cgpa}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">CGPA</p>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="font-body text-3xl font-bold text-foreground group-hover:text-emerald-500 transition-colors">{overallGrade.grade}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{overallGrade.label}</p>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <p className="font-body text-3xl font-bold text-foreground group-hover:text-blue-500 transition-colors">{overallAvg}%</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">Overall Avg</p>
            </div>
            <div className="bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-body text-3xl font-bold text-foreground">
                <span className="text-emerald-500">{totalPassed}</span>
                <span className="text-muted-foreground text-lg mx-1">/</span>
                <span className="text-red-500">{totalFailed}</span>
              </p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">Pass / Fail</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* SGPA Trend */}
            <div className="bg-card border border-border/60 rounded-2xl p-6">
              <h3 className="font-body text-sm font-semibold text-foreground mb-4">SGPA Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sgpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="semester" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="sgpa" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Subject Radar */}
            {radarData.length >= 3 && (
              <div className="bg-card border border-border/60 rounded-2xl p-6">
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
            {sgpaData.map(d => (
              <div key={d.semester} className="bg-card border border-border/60 rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all">
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
                {/* Mini progress bar */}
                <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${d.avg >= 75 ? "bg-emerald-500" : d.avg >= 40 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${d.avg}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Marks Tables */}
          {Object.entries(grouped).map(([key, items]) => {
            const semAvg = items.length > 0 ? Math.round(items.reduce((s, m) => s + (m.obtained_marks / m.max_marks) * 100, 0) / items.length) : 0;
            return (
              <div key={key} className="bg-card border border-border/60 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
                  <h3 className="font-body text-base font-semibold text-foreground">{key}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${semAvg >= 75 ? "bg-emerald-500/10 text-emerald-500" : semAvg >= 40 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"}`}>
                    Avg: {semAvg}%
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/30">
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
                          <tr key={m.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
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
