import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle, XCircle, Users, Search, Filter } from "lucide-react";

export default function TeacherAttendance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [courseTab, setCourseTab] = useState("All");

  const { data: courses = [] } = useQuery({
    queryKey: ["attendance-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
    },
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["all-students-for-attendance"],
    queryFn: async () => {
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, roll_number, user_id, course_id, courses(name, code)")
        .eq("is_active", true)
        .order("roll_number");
      if (!studentsData || studentsData.length === 0) return [];
      const userIds = studentsData.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      return studentsData.map((s) => ({
        ...s,
        profile: profiles?.find((p) => p.user_id === s.user_id),
      }));
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const records = Object.entries(statuses).map(([student_id, status]) => ({
        student_id, subject, date, status, marked_by: user!.id,
      }));
      if (records.length === 0) throw new Error("Please mark at least one student");
      const { error } = await supabase.from("attendance").insert(records);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Attendance saved successfully!");
      setStatuses({});
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleStatus = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: prev[id] === "present" ? "absent" : "present" }));
  };

  const markAll = (status: string) => {
    const all: Record<string, string> = {};
    filteredStudents.forEach((s: any) => { all[s.id] = status; });
    setStatuses(prev => ({ ...prev, ...all }));
  };

  // Filter by course tab first, then by search
  const courseFiltered = courseTab === "All" ? students : students.filter((s: any) => s.course_id === courseTab);
  const absentOnly = courseTab === "absent" ? students.filter((s: any) => statuses[s.id] === "absent") : [];
  const baseList = courseTab === "absent" ? absentOnly : courseFiltered;

  const filteredStudents = baseList.filter((s: any) => {
    const name = (s.profile?.full_name || s.roll_number || "").toLowerCase();
    return name.includes(search.toLowerCase()) || s.roll_number.toLowerCase().includes(search.toLowerCase());
  });

  const presentCount = Object.values(statuses).filter(s => s === "present").length;
  const absentCount = Object.values(statuses).filter(s => s === "absent").length;

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-4 sm:p-6">
        <h2 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Mark Attendance
        </h2>
        <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">Filter by course, mark individually or in bulk</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Subject *</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures" className="rounded-xl text-sm" />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Date *</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl text-sm" />
          </div>
          <div>
            <label className="font-body text-xs font-semibold text-foreground mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 rounded-xl text-sm" />
            </div>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <button
            onClick={() => setCourseTab("All")}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-all ${courseTab === "All" ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            All ({students.length})
          </button>
          {courses.map((c: any) => {
            const count = students.filter((s: any) => s.course_id === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setCourseTab(c.id)}
                className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-all ${courseTab === c.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {c.code} ({count})
              </button>
            );
          })}
          <button
            onClick={() => setCourseTab("absent")}
            className={`px-3 py-1.5 rounded-lg font-body text-xs font-medium transition-all ${courseTab === "absent" ? "bg-destructive text-destructive-foreground shadow-sm" : "bg-destructive/10 text-destructive hover:bg-destructive/20"}`}
          >
            Absent ({absentCount})
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => markAll("present")} className="rounded-xl font-body text-xs">✅ All Present</Button>
          <Button size="sm" variant="outline" onClick={() => markAll("absent")} className="rounded-xl font-body text-xs">❌ All Absent</Button>
          {Object.keys(statuses).length > 0 && (
            <div className="flex gap-2 ml-auto">
              <span className="text-xs font-body px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">P: {presentCount}</span>
              <span className="text-xs font-body px-3 py-1 rounded-full bg-destructive/10 text-destructive font-semibold">A: {absentCount}</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8"><p className="font-body text-sm text-muted-foreground animate-pulse">Loading students...</p></div>
        ) : (
          <div className="space-y-1.5 max-h-[450px] overflow-y-auto pr-1">
            {filteredStudents.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all">
                <div className="min-w-0">
                  <p className="font-body text-sm font-semibold text-foreground truncate">{s.profile?.full_name || "Unnamed"}</p>
                  <p className="font-body text-xs text-muted-foreground">{s.roll_number} {s.courses?.code && `• ${s.courses.code}`}</p>
                </div>
                <button onClick={() => toggleStatus(s.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-semibold transition-all duration-200 shrink-0 ${
                  statuses[s.id] === "present" ? "bg-primary/15 text-primary" : statuses[s.id] === "absent" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
                }`}>
                  {statuses[s.id] === "present" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {statuses[s.id] || "—"}
                </button>
              </div>
            ))}
            {filteredStudents.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-6">No students found.</p>}
          </div>
        )}

        <Button className="mt-4 w-full rounded-xl font-body" disabled={!subject || Object.keys(statuses).length === 0 || submitMutation.isPending} onClick={() => submitMutation.mutate()}>
          {submitMutation.isPending ? "Saving..." : `Submit Attendance (${Object.keys(statuses).length} students)`}
        </Button>
      </div>
    </div>
  );
}
