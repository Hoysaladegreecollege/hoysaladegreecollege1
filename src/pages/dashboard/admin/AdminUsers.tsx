import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [editForm, setEditForm] = useState({ full_name: "", phone: "", roll_number: "", semester: "", parent_phone: "", address: "", date_of_birth: "", course_id: "", total_fee: "", fee_paid: "", fee_due_date: "", fee_remarks: "" });
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
        return { ...p, role: roleEntry?.role || "student", role_id: roleEntry?.id, student: studentEntry, avatarUrl: (studentEntry as any)?.avatar_url };
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
    mutationFn: async ({ userId, full_name, phone, roll_number, semester, parent_phone, address, date_of_birth, course_id, total_fee, fee_paid, fee_due_date, fee_remarks }: any) => {
      const { error } = await supabase.from("profiles").update({ full_name, phone }).eq("user_id", userId);
      if (error) throw error;
      const studentUpdate: any = {};
      if (roll_number) studentUpdate.roll_number = roll_number;
      if (semester) studentUpdate.semester = parseInt(semester);
      if (parent_phone !== undefined) studentUpdate.parent_phone = parent_phone;
      if (address !== undefined) studentUpdate.address = address;
      if (date_of_birth) studentUpdate.date_of_birth = date_of_birth;
      if (course_id) studentUpdate.course_id = course_id;
      if (total_fee !== undefined && total_fee !== "") studentUpdate.total_fee = parseFloat(total_fee) || 0;
      if (fee_paid !== undefined && fee_paid !== "") studentUpdate.fee_paid = parseFloat(fee_paid) || 0;
      if (fee_due_date) studentUpdate.fee_due_date = fee_due_date;
      if (fee_remarks !== undefined) studentUpdate.fee_remarks = fee_remarks;
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
      date_of_birth: u.student?.date_of_birth || "", course_id: u.student?.course_id || "",
      total_fee: String(u.student?.total_fee || ""), fee_paid: String(u.student?.fee_paid || ""),
      fee_due_date: u.student?.fee_due_date || "", fee_remarks: u.student?.fee_remarks || "",
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
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-5 sm:p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5 mb-1">
                <span className="font-body text-[10px] text-primary font-semibold uppercase tracking-wider">Admin Panel</span>
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">User Management</h2>
              <p className="font-body text-xs text-muted-foreground">{users.length} registered users</p>
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
                {viewStudent.avatarUrl ? (
                  <img src={viewStudent.avatarUrl} alt={viewStudent.full_name} className="w-20 h-20 rounded-2xl object-cover border-4 border-secondary/30 shadow-lg mx-auto mb-2" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">{viewStudent.role === "teacher" ? "📚" : viewStudent.role === "admin" ? "⚙️" : "🎓"}</span>
                  </div>
                )}
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
      <div className="space-y-2.5">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3 rounded-lg" />
                    <Skeleton className="h-3 w-1/2 rounded-lg" />
                  </div>
                  <Skeleton className="w-24 h-8 rounded-xl shrink-0" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.map((u: any, idx: number) => (
          <div
            key={u.id}
            className="relative overflow-hidden bg-card border border-border rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group card-stack border-glow animate-fade-in"
            style={{ animationDelay: `${idx * 30}ms` }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none spotlight" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {editingId === u.user_id ? (
              <div className="relative space-y-2">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Name" />
                  <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Phone" />
                  <Input value={editForm.roll_number} onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Roll Number" />
                  <Input value={editForm.parent_phone} onChange={(e) => setEditForm({ ...editForm, parent_phone: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Parent Phone" />
                  <Input type="date" value={editForm.date_of_birth} onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="DOB" />
                  <select value={editForm.course_id} onChange={(e) => setEditForm({ ...editForm, course_id: e.target.value })} className="h-9 text-sm rounded-xl border border-input bg-background px-3">
                    <option value="">Select Course</option>
                    {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={editForm.semester} onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })} className="h-9 text-sm rounded-xl border border-input bg-background px-3">
                    {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                  <Input type="number" value={editForm.total_fee} onChange={(e) => setEditForm({ ...editForm, total_fee: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Total Fee" />
                  <Input type="number" value={editForm.fee_paid} onChange={(e) => setEditForm({ ...editForm, fee_paid: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Fee Paid" />
                  <Input type="date" value={editForm.fee_due_date} onChange={(e) => setEditForm({ ...editForm, fee_due_date: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Fee Due Date" />
                  <Input value={editForm.fee_remarks} onChange={(e) => setEditForm({ ...editForm, fee_remarks: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Fee Remarks" />
                  <Input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="h-9 text-sm rounded-xl" placeholder="Address" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateProfileMutation.mutate({ userId: u.user_id, ...editForm })} className="flex-1 text-xs rounded-xl"><Save className="w-3 h-3 mr-1" /> Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="text-xs rounded-xl"><X className="w-3 h-3" /></Button>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0 font-bold text-primary font-display text-base group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {(u.full_name || u.email || "?")[0].toUpperCase()}
                  </div>
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
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <select value={u.role} onChange={(e) => updateRoleMutation.mutate({ userId: u.user_id, newRole: e.target.value })}
                    className="text-[10px] rounded-lg border border-input bg-background px-1.5 py-1 font-body hidden sm:block">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="principal">Principal</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button onClick={() => setViewStudent(u)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:scale-110 transition-all duration-200" title="View"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary hover:scale-110 transition-all duration-200" title="Edit"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteConfirm(u)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive hover:scale-110 transition-all duration-200" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
