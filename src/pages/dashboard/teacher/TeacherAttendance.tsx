import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, XCircle, Users, Search, AlertTriangle, Phone, Calendar } from "lucide-react";

const SEMESTER_LABELS: Record<number, string> = { 1: "Sem 1", 2: "Sem 2", 3: "Sem 3", 4: "Sem 4", 5: "Sem 5", 6: "Sem 6" };

export default function TeacherAttendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Primary filters
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeSemester, setActiveSemester] = useState<number>(1);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statuses, setStatuses] = useState<Record<string, "present" | "absent">>({});
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"mark" | "absent-list">("mark");

  // Fetch courses
  const { data: courses = [] } = useQuery<{ id: string; name: string; code: string }[]>({
    queryKey: ["attendance-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true).order("name");
      const result = (data || []) as { id: string; name: string; code: string }[];
      if (result.length > 0 && !activeCourseId) setActiveCourseId(result[0].id);
      return result;
    },
  });

  const resolvedCourseId = activeCourseId ?? (courses[0]?.id || null);

  // Fetch students for selected course + semester
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["attendance-students", resolvedCourseId, activeSemester],
    queryFn: async () => {
      if (!resolvedCourseId) return [];
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, roll_number, user_id, course_id, semester, phone, parent_phone, courses(name, code)")
        .eq("is_active", true)
        .eq("course_id", resolvedCourseId)
        .eq("semester", activeSemester)
        .order("roll_number");
      if (!studentsData || studentsData.length === 0) return [];
      const userIds = studentsData.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      return studentsData.map((s) => ({
        ...s,
        profile: profiles?.find((p) => p.user_id === s.user_id),
      }));
    },
    enabled: !!resolvedCourseId,
  });

  // Check if attendance already marked today for this course+semester+subject
  const { data: existingToday = [] } = useQuery({
    queryKey: ["existing-attendance", resolvedCourseId, activeSemester, date, subject],
    queryFn: async () => {
      if (!resolvedCourseId || !subject) return [];
      const studentIds = students.map((s: any) => s.id);
      if (studentIds.length === 0) return [];
      const { data } = await supabase
        .from("attendance")
        .select("student_id, status")
        .in("student_id", studentIds)
        .eq("date", date)
        .eq("subject", subject);
      return data || [];
    },
    enabled: !!resolvedCourseId && !!subject && students.length > 0,
  });

  const alreadyMarkedIds = useMemo(
    () => new Set((existingToday as any[]).map((r: any) => r.student_id)),
    [existingToday]
  );

  const filteredStudents = useMemo(() => {
    return students.filter((s: any) => {
      const name = (s.profile?.full_name || s.roll_number || "").toLowerCase();
      return name.includes(search.toLowerCase()) || s.roll_number.toLowerCase().includes(search.toLowerCase());
    });
  }, [students, search]);

  const absentStudents = useMemo(
    () => filteredStudents.filter((s: any) => statuses[s.id] === "absent"),
    [filteredStudents, statuses]
  );

  const presentCount = Object.values(statuses).filter((s) => s === "present").length;
  const absentCount = Object.values(statuses).filter((s) => s === "absent").length;
  const unmarkedCount = filteredStudents.filter((s: any) => !statuses[s.id]).length;

  const toggleStatus = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: prev[id] === "present" ? "absent" : "present" }));
  };

  const markAll = (status: "present" | "absent") => {
    const all: Record<string, "present" | "absent"> = {};
    filteredStudents.forEach((s: any) => { all[s.id] = status; });
    setStatuses((prev) => ({ ...prev, ...all }));
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!subject.trim()) throw new Error("Subject is required");
      const entries = Object.entries(statuses);
      if (entries.length === 0) throw new Error("Please mark at least one student");

      const records = entries.map(([student_id, status]) => ({
        student_id,
        subject: subject.trim(),
        date,
        status,
        marked_by: user!.id,
        year_level: Math.ceil(activeSemester / 2),
        course_id: resolvedCourseId,
      }));

      // Upsert logic: delete existing records for this group then insert
      if (alreadyMarkedIds.size > 0) {
        const toDelete = records.filter(r => alreadyMarkedIds.has(r.student_id)).map(r => r.student_id);
        await supabase.from("attendance").delete()
          .in("student_id", toDelete)
          .eq("date", date)
          .eq("subject", subject.trim());
      }

      const { error } = await supabase.from("attendance").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Attendance saved successfully!");
      setStatuses({});
      queryClient.invalidateQueries({ queryKey: ["existing-attendance"] });
      // Also invalidate absent report queries so they refresh
      queryClient.invalidateQueries({ queryKey: ["absent-students-date"] });
      queryClient.invalidateQueries({ queryKey: ["admin-absent-students"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const activeCourse = courses.find((c: any) => c.id === resolvedCourseId);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-4 sm:p-6">
        <h2 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Mark Attendance
        </h2>
        <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">
          Select course and semester, then mark attendance per subject
        </p>
      </div>

      {/* Tab: Mark / Absent List */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab("mark")}
          className={`px-4 py-2 rounded-lg font-body text-xs font-semibold transition-all duration-200 ${activeTab === "mark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          ✅ Mark Attendance
        </button>
        <button onClick={() => setActiveTab("absent-list")}
          className={`px-4 py-2 rounded-lg font-body text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${activeTab === "absent-list" ? "bg-destructive text-destructive-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
          <AlertTriangle className="w-3 h-3" /> Absent Report
          {absentCount > 0 && <span className="bg-destructive-foreground/20 text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{absentCount}</span>}
        </button>
      </div>

      {activeTab === "absent-list" ? (
        /* ── Absent Students Report ── */
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border bg-destructive/5">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Daily Absent Report — {date}
            </h3>
            <p className="font-body text-xs text-muted-foreground mt-0.5">
              {activeCourse?.name || "All"} · {SEMESTER_LABELS[activeSemester]} · {subject || "Select subject above"}
            </p>
          </div>
          {absentStudents.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="w-10 h-10 text-primary/30 mx-auto mb-3" />
              <p className="font-body text-sm font-semibold text-muted-foreground">No absent students</p>
              <p className="font-body text-xs text-muted-foreground/60 mt-1">Mark attendance first to see the report</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {absentStudents.map((s: any, i: number) => (
                <div key={s.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                    <XCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{s.profile?.full_name || "Unnamed"}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(s.phone || s.parent_phone) && (
                      <a href={`tel:${s.parent_phone || s.phone}`} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/8 text-primary text-[10px] font-body font-semibold hover:bg-primary/15 transition-colors">
                        <Phone className="w-3 h-3" /> Call Parent
                      </a>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">Absent</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ── Mark Attendance ── */
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 space-y-5">
          {/* COURSE TABS */}
          <div>
            <label className="font-body text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Step 1: Select Course</label>
            <div className="flex flex-wrap gap-1.5">
              {courses.map((c: any) => (
                <button key={c.id} onClick={() => { setActiveCourseId(c.id); setStatuses({}); }}
                  className={`px-4 py-2 rounded-xl font-body text-xs font-semibold transition-all duration-200 ${resolvedCourseId === c.id ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105"}`}>
                  {c.code}
                </button>
              ))}
            </div>
          </div>

          {/* SEMESTER SUB-TABS */}
          <div>
            <label className="font-body text-xs font-bold text-foreground uppercase tracking-wider mb-2 block">Step 2: Select Semester</label>
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <button key={sem} onClick={() => { setActiveSemester(sem); setStatuses({}); }}
                  className={`px-4 py-2 rounded-xl font-body text-xs font-semibold transition-all duration-200 border ${activeSemester === sem ? "bg-secondary text-secondary-foreground border-secondary shadow-md scale-105" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"}`}>
                  {SEMESTER_LABELS[sem]}
                </button>
              ))}
            </div>
          </div>

          {/* SUBJECT + DATE */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Subject *</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" className="rounded-xl text-sm" />
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground mb-1.5 block flex items-center gap-1"><Calendar className="w-3 h-3" /> Date *</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl text-sm" />
            </div>
            <div>
              <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Search Student</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or roll..." className="pl-9 rounded-xl text-sm" />
              </div>
            </div>
          </div>

          {/* Already marked warning */}
          {alreadyMarkedIds.size > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/10 border border-secondary/30 text-foreground">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p className="font-body text-xs font-semibold">{alreadyMarkedIds.size} student(s) already have attendance for this subject/date. Saving will overwrite.</p>
            </div>
          )}

          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => markAll("present")} className="rounded-xl font-body text-xs">✅ All Present</Button>
            <Button size="sm" variant="outline" onClick={() => markAll("absent")} className="rounded-xl font-body text-xs">❌ All Absent</Button>
            <div className="ml-auto flex gap-2">
              {presentCount > 0 && <span className="text-xs font-body px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">P: {presentCount}</span>}
              {absentCount > 0 && <span className="text-xs font-body px-3 py-1 rounded-full bg-destructive/10 text-destructive font-semibold">A: {absentCount}</span>}
              {unmarkedCount > 0 && <span className="text-xs font-body px-3 py-1 rounded-full bg-muted text-muted-foreground font-semibold">Unmarked: {unmarkedCount}</span>}
            </div>
          </div>

          {/* Student context info */}
          {resolvedCourseId && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/15">
              <Users className="w-3.5 h-3.5 text-primary shrink-0" />
              <p className="font-body text-xs text-muted-foreground">
                Showing <span className="font-bold text-primary">{filteredStudents.length}</span> students from{" "}
                <span className="font-bold text-primary">{activeCourse?.name}</span> — <span className="font-bold text-primary">{SEMESTER_LABELS[activeSemester]}</span>
              </p>
            </div>
          )}

          {/* Student List */}
          {studentsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredStudents.map((s: any) => (
                <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${
                  statuses[s.id] === "present"
                    ? "bg-primary/5 border-primary/20"
                    : statuses[s.id] === "absent"
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-muted/30 border-transparent hover:bg-muted/50"
                }`}>
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-foreground truncate">{s.profile?.full_name || "Unnamed"}</p>
                    <p className="font-body text-xs text-muted-foreground">{s.roll_number} · {activeCourse?.code} · {SEMESTER_LABELS[activeSemester]}</p>
                  </div>
                  <button onClick={() => toggleStatus(s.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-body font-bold transition-all duration-200 shrink-0 ${
                      statuses[s.id] === "present"
                        ? "bg-primary/15 text-primary hover:bg-primary/25"
                        : statuses[s.id] === "absent"
                        ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {statuses[s.id] === "present" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {statuses[s.id] || "—"}
                  </button>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="font-body text-sm text-muted-foreground">No students found for {activeCourse?.name} — {SEMESTER_LABELS[activeSemester]}</p>
                  <p className="font-body text-xs text-muted-foreground/60 mt-1">Students must be assigned to this course and semester by the admin</p>
                </div>
              )}
            </div>
          )}

          <Button
            className="w-full rounded-xl font-body font-bold py-5"
            disabled={!subject.trim() || Object.keys(statuses).length === 0 || submitMutation.isPending}
            onClick={() => submitMutation.mutate()}>
            {submitMutation.isPending
              ? "Saving..."
              : `Save Attendance (${Object.keys(statuses).length} students)`}
          </Button>
        </div>
      )}
    </div>
  );
}
