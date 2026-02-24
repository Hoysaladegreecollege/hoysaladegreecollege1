import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, Eye, Phone, Filter } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const SEMESTER_LABELS: Record<number, string> = { 1: "Sem 1", 2: "Sem 2", 3: "Sem 3", 4: "Sem 4", 5: "Sem 5", 6: "Sem 6" };

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [viewStudent, setViewStudent] = useState<any>(null);

  const { data: courses = [] } = useQuery({
    queryKey: ["teacher-student-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true).order("name");
      return data || [];
    },
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["teacher-students", courseFilter, semesterFilter],
    queryFn: async () => {
      let q = supabase
        .from("students")
        .select("*, courses(name, code)")
        .eq("is_active", true)
        .order("roll_number");
      if (courseFilter !== "all") q = q.eq("course_id", courseFilter);
      if (semesterFilter !== "all") q = q.eq("semester", parseInt(semesterFilter));
      const { data: studentsData } = await q;
      if (!studentsData || studentsData.length === 0) return [];
      const userIds = studentsData.map((s) => s.user_id);
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", userIds);
      return studentsData.map((s) => ({
        ...s,
        profile: profiles?.find((p) => p.user_id === s.user_id),
      }));
    },
  });

  const filtered = students.filter((s: any) => {
    const name = (s.profile?.full_name || s.roll_number || "").toLowerCase();
    return name.includes(search.toLowerCase()) || s.roll_number.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Students
            </h2>
            <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">{filtered.length} of {students.length} active students</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-body text-sm font-bold text-foreground">Filter Students</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name or roll..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl text-sm" />
          </div>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)}
            className="border border-border rounded-xl px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">All Courses</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
          <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)}
            className="border border-border rounded-xl px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
          </select>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12"><p className="font-body text-sm text-muted-foreground">No students found.</p></div>
        ) : (
          filtered.map((s: any) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-3">
              {s.avatar_url ? (
                <img src={s.avatar_url} alt={s.profile?.full_name} className="w-10 h-10 rounded-xl object-cover border-2 border-secondary/30 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-navy-dark/20 flex items-center justify-center shrink-0 border border-border">
                  <span className="font-display text-xs font-bold text-primary">{(s.profile?.full_name || "S")[0].toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-body text-sm font-bold text-primary">{s.roll_number}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">Sem {s.semester}</span>
                    <Button size="sm" variant="outline" onClick={() => setViewStudent(s)} className="rounded-lg h-7 px-2 font-body text-xs">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="font-body text-sm font-medium text-foreground">{s.profile?.full_name || "—"}</p>
                <p className="font-body text-xs text-muted-foreground">{s.courses?.name || "—"}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Roll No</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Name</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Course</th>
                  <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Semester</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Phone</th>
                  <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                 {filtered.map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="font-body text-sm p-4 font-semibold text-primary">{s.roll_number}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {s.avatar_url ? (
                          <img src={s.avatar_url} alt={s.profile?.full_name} className="w-8 h-8 rounded-lg object-cover border border-secondary/30" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-navy-dark/20 flex items-center justify-center border border-border">
                            <span className="font-display text-xs font-bold text-primary">{(s.profile?.full_name || "S")[0].toUpperCase()}</span>
                          </div>
                        )}
                        <span className="font-body text-sm font-medium text-foreground">{s.profile?.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="font-body text-sm p-4 text-foreground">{s.courses?.name || "—"}</td>
                    <td className="font-body text-sm p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">Sem {s.semester}</span>
                    </td>
                    <td className="font-body text-sm p-4 text-foreground">
                      {s.profile?.phone ? (
                        <a href={`tel:${s.profile.phone}`} className="text-primary hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {s.profile.phone}
                        </a>
                      ) : (s.parent_phone || "—")}
                    </td>
                    <td className="p-4 text-center">
                      <Button size="sm" variant="outline" onClick={() => setViewStudent(s)} className="rounded-xl font-body text-xs">
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center font-body text-sm text-muted-foreground p-8">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Detail Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Student Details</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-3 mt-2">
              <div className="flex flex-col items-center p-5 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border">
                {(viewStudent as any).avatar_url ? (
                  <img
                    src={(viewStudent as any).avatar_url}
                    alt={viewStudent.profile?.full_name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-secondary/30 shadow-lg mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-navy-dark flex items-center justify-center mb-3 border-4 border-secondary/20 shadow-lg">
                    <span className="font-display text-2xl font-bold text-primary-foreground">
                      {(viewStudent.profile?.full_name || "S").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                )}
                <h3 className="font-display text-lg font-bold text-foreground">{viewStudent.profile?.full_name || "—"}</h3>
                <p className="font-body text-sm text-primary font-semibold">{viewStudent.roll_number}</p>
              </div>
              {[
                ["Course", viewStudent.courses?.name || "—"],
                ["Semester", `Semester ${viewStudent.semester}`],
                ["Email", viewStudent.profile?.email || "—"],
                ["Student Phone", (viewStudent as any).phone || viewStudent.profile?.phone || "—"],
                ["Parent Phone", viewStudent.parent_phone || "—"],
                ["Date of Birth", viewStudent.date_of_birth || "—"],
                ["Address", viewStudent.address || "—"],
                ["Admission Year", viewStudent.admission_year || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <span className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider w-28 shrink-0">{k}</span>
                  <span className="font-body text-sm text-foreground font-medium">{v}</span>
                </div>
              ))}
              <div className="flex gap-2 pt-2">
                {((viewStudent as any).phone || viewStudent.profile?.phone) && (
                  <a href={`tel:${(viewStudent as any).phone || viewStudent.profile?.phone}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl font-body text-xs">
                      <Phone className="w-3 h-3 mr-1" /> Call Student
                    </Button>
                  </a>
                )}
                {viewStudent.parent_phone && (
                  <a href={`tel:${viewStudent.parent_phone}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl font-body text-xs">
                      <Phone className="w-3 h-3 mr-1" /> Call Parent
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
