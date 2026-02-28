import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Edit2, Save, X, Plus, Trash2, BookOpen, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminCourses() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [newCourse, setNewCourse] = useState({
    name: "", code: "", department_id: "", duration: "3 Years",
    eligibility: "", fee: "", overview: "", is_active: true,
  });

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("*, departments(name)").order("name");
      return data || [];
    },
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments-list"],
    queryFn: async () => {
      const { data } = await supabase.from("departments").select("id, name").eq("is_active", true).order("name");
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!newCourse.name || !newCourse.code) throw new Error("Name and Code are required");
      const { error } = await supabase.from("courses").insert({
        name: newCourse.name,
        code: newCourse.code,
        department_id: newCourse.department_id || null,
        duration: newCourse.duration,
        eligibility: newCourse.eligibility,
        fee: newCourse.fee,
        overview: newCourse.overview,
        is_active: newCourse.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course created successfully!" });
      setAdding(false);
      setNewCourse({ name: "", code: "", department_id: "", duration: "3 Years", eligibility: "", fee: "", overview: "", is_active: true });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("courses").update({
        name: editData.name,
        code: editData.code,
        department_id: editData.department_id || null,
        fee: editData.fee,
        duration: editData.duration,
        eligibility: editData.eligibility,
        overview: editData.overview,
        is_active: editData.is_active,
      }).eq("id", editing!);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course updated!" });
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Course deleted" });
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const startEdit = (c: any) => {
    setEditing(c.id);
    setEditData({
      name: c.name, code: c.code, department_id: c.department_id || "",
      fee: c.fee, duration: c.duration, eligibility: c.eligibility,
      overview: c.overview, is_active: c.is_active,
    });
  };

  const filtered = courses.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-body text-xl font-semibold text-foreground tracking-tight">Course Management</h2>
          <p className="font-body text-[13px] text-muted-foreground mt-0.5">Add, edit, and manage all courses.</p>
        </div>
        <Button onClick={() => setAdding(!adding)} className="rounded-xl font-body text-[13px] h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Add Course
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl font-body text-[13px] h-9 bg-muted/30 border-border/60"
        />
      </div>

      {/* Add New Course Form */}
      {adding && (
        <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 space-y-4">
          <h3 className="font-body text-[14px] font-semibold text-foreground">New Course</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-[12px] text-muted-foreground mb-1 block">Course Name *</label>
              <Input value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} className="rounded-xl font-body text-[13px]" placeholder="e.g. Bachelor of Computer Applications" />
            </div>
            <div>
              <label className="font-body text-[12px] text-muted-foreground mb-1 block">Course Code *</label>
              <Input value={newCourse.code} onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })} className="rounded-xl font-body text-[13px]" placeholder="e.g. BCA" />
            </div>
            <div>
              <label className="font-body text-[12px] text-muted-foreground mb-1 block">Department</label>
              <Select value={newCourse.department_id} onValueChange={(v) => setNewCourse({ ...newCourse, department_id: v })}>
                <SelectTrigger className="rounded-xl font-body text-[13px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-body text-[12px] text-muted-foreground mb-1 block">Duration</label>
              <Input value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} className="rounded-xl font-body text-[13px]" />
            </div>
            <div>
              <label className="font-body text-[12px] text-muted-foreground mb-1 block">Fee</label>
              <Input value={newCourse.fee} onChange={(e) => setNewCourse({ ...newCourse, fee: e.target.value })} className="rounded-xl font-body text-[13px]" placeholder="e.g. ₹45,000/year" />
            </div>
            <div>
              <label className="font-body text-[12px] text-muted-foreground mb-1 block">Eligibility</label>
              <Input value={newCourse.eligibility} onChange={(e) => setNewCourse({ ...newCourse, eligibility: e.target.value })} className="rounded-xl font-body text-[13px]" placeholder="e.g. 10+2 Pass" />
            </div>
          </div>
          <div>
            <label className="font-body text-[12px] text-muted-foreground mb-1 block">Overview</label>
            <Textarea value={newCourse.overview} onChange={(e) => setNewCourse({ ...newCourse, overview: e.target.value })} className="rounded-xl font-body text-[13px] min-h-[80px]" placeholder="Brief description of the course..." />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setAdding(false)} className="rounded-xl font-body text-[12px]">Cancel</Button>
            <Button size="sm" onClick={() => createMutation.mutate()} disabled={createMutation.isPending} className="rounded-xl font-body text-[12px] gap-1.5">
              <Save className="w-3.5 h-3.5" /> Create Course
            </Button>
          </div>
        </div>
      )}

      {/* Course List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/30 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border/60 rounded-2xl p-8 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-body text-[14px] text-foreground font-medium">No courses found</p>
          <p className="font-body text-[12px] text-muted-foreground mt-1">Add a new course to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c: any) => (
            <div key={c.id} className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 hover:border-border transition-colors duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-body text-[15px] font-semibold text-foreground">{c.name}</h3>
                      <span className={`font-body text-[10px] px-1.5 py-0.5 rounded-md ${c.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="font-body text-[12px] text-muted-foreground">{c.code} • {c.departments?.name || "No department"}</p>
                  </div>
                </div>
                {editing === c.id ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending} className="rounded-xl font-body text-[12px] h-8 gap-1">
                      <Save className="w-3 h-3" /> Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(null)} className="rounded-xl h-8"><X className="w-3 h-3" /></Button>
                  </div>
                ) : (
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)} className="rounded-xl font-body text-[12px] h-8 gap-1">
                      <Edit2 className="w-3 h-3" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      if (confirm(`Delete "${c.name}"? This cannot be undone.`)) deleteMutation.mutate(c.id);
                    }} className="rounded-xl h-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>

              {editing === c.id ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="font-body text-[12px] text-muted-foreground mb-1 block">Name</label>
                      <Input value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="rounded-xl font-body text-[13px]" />
                    </div>
                    <div>
                      <label className="font-body text-[12px] text-muted-foreground mb-1 block">Code</label>
                      <Input value={editData.code} onChange={(e) => setEditData({ ...editData, code: e.target.value })} className="rounded-xl font-body text-[13px]" />
                    </div>
                    <div>
                      <label className="font-body text-[12px] text-muted-foreground mb-1 block">Department</label>
                      <Select value={editData.department_id} onValueChange={(v) => setEditData({ ...editData, department_id: v })}>
                        <SelectTrigger className="rounded-xl font-body text-[13px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((d: any) => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="font-body text-[12px] text-muted-foreground mb-1 block">Fee</label>
                      <Input value={editData.fee} onChange={(e) => setEditData({ ...editData, fee: e.target.value })} className="rounded-xl font-body text-[13px]" />
                    </div>
                    <div>
                      <label className="font-body text-[12px] text-muted-foreground mb-1 block">Duration</label>
                      <Input value={editData.duration} onChange={(e) => setEditData({ ...editData, duration: e.target.value })} className="rounded-xl font-body text-[13px]" />
                    </div>
                    <div>
                      <label className="font-body text-[12px] text-muted-foreground mb-1 block">Eligibility</label>
                      <Input value={editData.eligibility} onChange={(e) => setEditData({ ...editData, eligibility: e.target.value })} className="rounded-xl font-body text-[13px]" />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-[12px] text-muted-foreground mb-1 block">Overview</label>
                    <Textarea value={editData.overview} onChange={(e) => setEditData({ ...editData, overview: e.target.value })} className="rounded-xl font-body text-[13px] min-h-[80px]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="font-body text-[12px] text-muted-foreground">Status:</label>
                    <Button size="sm" variant={editData.is_active ? "default" : "outline"} onClick={() => setEditData({ ...editData, is_active: !editData.is_active })} className="rounded-xl font-body text-[11px] h-7">
                      {editData.is_active ? "Active" : "Inactive"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    { label: "Fee", value: c.fee },
                    { label: "Duration", value: c.duration },
                    { label: "Eligibility", value: c.eligibility },
                    { label: "Overview", value: c.overview },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-2.5 rounded-xl bg-muted/30">
                      <p className="font-body text-[11px] text-muted-foreground">{label}</p>
                      <p className="font-body text-[13px] font-medium text-foreground mt-0.5 line-clamp-2">{value || "—"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
