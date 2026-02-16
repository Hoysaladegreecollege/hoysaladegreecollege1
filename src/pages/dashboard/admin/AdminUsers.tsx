import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, Trash2, Edit3, X, Save, Users, Phone, UserPlus, Eye, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", roll_number: "", semester: "", parent_phone: "", address: "" });
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [viewStudent, setViewStudent] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [newStudent, setNewStudent] = useState({
    full_name: "", email: "", password: "", phone: "", date_of_birth: "",
    roll_number: "", course_id: "", semester: "1", admission_year: new Date().getFullYear().toString(),
    father_name: "", mother_name: "", parent_phone: "", address: "",
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: roles } = await supabase.from("user_roles").select("*");
      const { data: profiles } = await supabase.from("profiles").select("*");
      const { data: students } = await supabase.from("students").select("*, courses(name, code)");
      if (!roles || !profiles) return [];
      return profiles.map((p) => {
        const roleEntry = roles.find((r) => r.user_id === p.user_id);
        const studentEntry = students?.find((s) => s.user_id === p.user_id);
        return { ...p, role: roleEntry?.role || "student", role_id: roleEntry?.id, student: studentEntry };
      });
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-list"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error } = await supabase.from("user_roles").update({ role: newRole as any }).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Role updated!"); queryClient.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({ userId, full_name, phone, roll_number, semester, parent_phone, address }: any) => {
      const { error } = await supabase.from("profiles").update({ full_name, phone }).eq("user_id", userId);
      if (error) throw error;
      const studentUpdate: any = {};
      if (roll_number) studentUpdate.roll_number = roll_number;
      if (semester) studentUpdate.semester = parseInt(semester);
      if (parent_phone !== undefined) studentUpdate.parent_phone = parent_phone;
      if (address !== undefined) studentUpdate.address = address;
      if (Object.keys(studentUpdate).length > 0) {
        await supabase.from("students").update(studentUpdate).eq("user_id", userId);
      }
    },
    onSuccess: () => { toast.success("Profile updated!"); queryClient.invalidateQueries({ queryKey: ["admin-users"] }); setEditingId(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("delete-user", { body: { userId } });
      if (error) throw new Error(error.message || "Delete failed");
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteConfirm(null);
    },
    onError: (e: any) => toast.error(`Delete failed: ${e.message}`),
  });

  const addStudentMutation = useMutation({
    mutationFn: async () => {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newStudent.email,
        password: newStudent.password,
        options: {
          data: { full_name: newStudent.full_name, role: "student" },
          emailRedirectTo: window.location.origin,
        },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Wait for trigger to create profile & student records
      await new Promise(r => setTimeout(r, 2000));

      // Update profile with phone
      if (newStudent.phone) {
        await supabase.from("profiles").update({ phone: newStudent.phone }).eq("user_id", authData.user.id);
      }

      // Update student record
      const updateData: any = {
        semester: parseInt(newStudent.semester) || 1,
        admission_year: parseInt(newStudent.admission_year),
        parent_phone: newStudent.parent_phone,
        address: newStudent.address,
        date_of_birth: newStudent.date_of_birth || null,
      };
      if (newStudent.roll_number) updateData.roll_number = newStudent.roll_number;
      if (newStudent.course_id) updateData.course_id = newStudent.course_id;
      await supabase.from("students").update(updateData).eq("user_id", authData.user.id);
    },
    onSuccess: () => {
      toast.success("Student created! Email confirmation has been sent.");
      setShowAddStudent(false);
      setNewStudent({ full_name: "", email: "", password: "", phone: "", date_of_birth: "", roll_number: "", course_id: "", semester: "1", admission_year: new Date().getFullYear().toString(), father_name: "", mother_name: "", parent_phone: "", address: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const startEdit = (u: any) => {
    setEditingId(u.user_id);
    setEditForm({
      full_name: u.full_name || "", phone: u.phone || "",
      roll_number: u.student?.roll_number || "", semester: String(u.student?.semester || ""),
      parent_phone: u.student?.parent_phone || "", address: u.student?.address || "",
    });
  };

  const filtered = users.filter((u: any) => {
    const name = (u.full_name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    if (courseFilter === "All") return matchSearch;
    if (courseFilter === "no-course") return matchSearch && u.role === "student" && !u.student?.course_id;
    return matchSearch && u.student?.course_id === courseFilter;
  });

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> User Management
              </h2>
              <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1">{users.length} registered users</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl text-sm" />
            </div>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="border border-border rounded-xl px-3 py-2 font-body text-xs bg-background">
              <option value="All">All Users</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="no-course">No Course</option>
            </select>
            <Button size="sm" onClick={() => setShowAddStudent(true)} className="rounded-xl font-body">
              <UserPlus className="w-4 h-4 mr-1" /> Add Student
            </Button>
          </div>
        </div>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Student</DialogTitle>
            <DialogDescription className="font-body text-sm">Create a student account — email confirmation will be sent automatically</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); addStudentMutation.mutate(); }} className="grid sm:grid-cols-2 gap-4 mt-4">
            <div className="sm:col-span-2"><h4 className="font-body text-xs font-bold text-primary uppercase tracking-wider">Personal Information</h4></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name *</label><input value={newStudent.full_name} onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })} required className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email *</label><input type="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} required className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Password *</label><input type="password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} required minLength={6} className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone</label><input value={newStudent.phone} onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })} className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Date of Birth</label><input type="date" value={newStudent.date_of_birth} onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })} className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Roll Number</label><input value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} placeholder="Auto-generated if empty" className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course *</label>
              <select value={newStudent.course_id} onChange={(e) => setNewStudent({ ...newStudent, course_id: e.target.value })} required className={inputClass}>
                <option value="">Select Course</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
              </select>
            </div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Semester</label>
              <select value={newStudent.semester} onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })} className={inputClass}>
                {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Admission Year</label><input value={newStudent.admission_year} onChange={(e) => setNewStudent({ ...newStudent, admission_year: e.target.value })} className={inputClass} /></div>
            <div className="sm:col-span-2 mt-2"><h4 className="font-body text-xs font-bold text-primary uppercase tracking-wider">Parent Information</h4></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Father's Name</label><input value={newStudent.father_name} onChange={(e) => setNewStudent({ ...newStudent, father_name: e.target.value })} className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Mother's Name</label><input value={newStudent.mother_name} onChange={(e) => setNewStudent({ ...newStudent, mother_name: e.target.value })} className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Parent Phone</label><input value={newStudent.parent_phone} onChange={(e) => setNewStudent({ ...newStudent, parent_phone: e.target.value })} className={inputClass} /></div>
            <div><label className="font-body text-xs font-semibold text-foreground block mb-1.5">Address</label><input value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} className={inputClass} /></div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={addStudentMutation.isPending} className="w-full rounded-xl font-body">
                {addStudentMutation.isPending ? "Creating..." : "Create Student Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-destructive">Confirm Deletion</DialogTitle>
            <DialogDescription className="font-body text-sm">
              Are you sure you want to permanently delete <strong>{deleteConfirm?.full_name || deleteConfirm?.email}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-xl font-body">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteUserMutation.mutate(deleteConfirm.user_id)} disabled={deleteUserMutation.isPending} className="flex-1 rounded-xl font-body">
              {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Student Detail Dialog */}
      <Dialog open={!!viewStudent} onOpenChange={() => setViewStudent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Student Details</DialogTitle>
          </DialogHeader>
          {viewStudent && (
            <div className="space-y-4 mt-2">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">{viewStudent.role === "teacher" ? "📚" : viewStudent.role === "admin" ? "⚙️" : "🎓"}</span>
                </div>
                <p className="font-display text-lg font-bold text-foreground">{viewStudent.full_name || "—"}</p>
                <p className="font-body text-xs text-muted-foreground">{viewStudent.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 rounded-xl p-3"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Role</p><p className="font-body text-sm font-semibold capitalize">{viewStudent.role}</p></div>
                <div className="bg-muted/30 rounded-xl p-3"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Course</p><p className="font-body text-sm font-semibold">{viewStudent.student?.courses?.name || "—"}</p></div>
                <div className="bg-muted/30 rounded-xl p-3"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Roll Number</p><p className="font-body text-sm font-semibold">{viewStudent.student?.roll_number || "—"}</p></div>
                <div className="bg-muted/30 rounded-xl p-3"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Semester</p><p className="font-body text-sm font-semibold">{viewStudent.student?.semester || "—"}</p></div>
                <div className="bg-muted/30 rounded-xl p-3"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Admission Year</p><p className="font-body text-sm font-semibold">{viewStudent.student?.admission_year || "—"}</p></div>
                <div className="bg-muted/30 rounded-xl p-3"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p><p className="font-body text-sm font-semibold">{viewStudent.phone || "—"}</p></div>
                <div className="bg-muted/30 rounded-xl p-3 col-span-2"><p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Address</p><p className="font-body text-sm font-semibold">{viewStudent.student?.address || "—"}</p></div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {viewStudent.phone && (
                  <a href={`tel:${viewStudent.phone}`}>
                    <Button size="sm" variant="outline" className="rounded-xl font-body text-xs"><Phone className="w-3 h-3 mr-1" /> Call Student</Button>
                  </a>
                )}
                {viewStudent.student?.parent_phone && (
                  <a href={`tel:${viewStudent.student.parent_phone}`}>
                    <Button size="sm" variant="outline" className="rounded-xl font-body text-xs"><Phone className="w-3 h-3 mr-1" /> Call Parent</Button>
                  </a>
                )}
                <Button size="sm" variant="outline" onClick={() => { setViewStudent(null); startEdit(viewStudent); }} className="rounded-xl font-body text-xs">
                  <Edit3 className="w-3 h-3 mr-1" /> Edit Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Users List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.map((u: any) => (
          <div key={u.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all group">
            {editingId === u.user_id ? (
              <div className="space-y-2">
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Name" />
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Phone" />
                  <Input value={editForm.roll_number} onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Roll Number" />
                  <Input value={editForm.parent_phone} onChange={(e) => setEditForm({ ...editForm, parent_phone: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Parent Phone" />
                  <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="h-9 text-sm rounded-xl sm:col-span-2" placeholder="Address" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateProfileMutation.mutate({ userId: u.user_id, ...editForm })} className="flex-1 text-xs rounded-xl"><Save className="w-3 h-3 mr-1" /> Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-xs rounded-xl"><X className="w-3 h-3" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-sm font-bold text-foreground">{u.full_name || "—"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-bold ${
                      u.role === "admin" ? "bg-destructive/10 text-destructive" :
                      u.role === "principal" ? "bg-secondary/20 text-secondary-foreground" :
                      u.role === "teacher" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>{u.role}</span>
                    {u.student?.courses?.code && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body">{u.student.courses.code}</span>}
                  </div>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{u.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {u.phone && <a href={`tel:${u.phone}`} className="font-body text-xs text-primary hover:underline flex items-center gap-1"><Phone className="w-3 h-3" /> {u.phone}</a>}
                    {u.student?.parent_phone && <a href={`tel:${u.student.parent_phone}`} className="font-body text-xs text-muted-foreground hover:text-primary flex items-center gap-1"><Phone className="w-3 h-3" /> Parent</a>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <select value={u.role} onChange={(e) => updateRoleMutation.mutate({ userId: u.user_id, newRole: e.target.value })}
                    className="text-[10px] rounded-lg border border-input bg-background px-1.5 py-1 font-body hidden sm:block">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="principal">Principal</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={() => setViewStudent(u)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Edit"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteConfirm(u)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {!isLoading && filtered.length === 0 && <p className="text-center py-8 font-body text-sm text-muted-foreground">No users found.</p>}
      </div>
    </div>
  );
}
