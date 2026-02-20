import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, ArrowLeft, Users, TrendingUp, AlertCircle, Phone, CheckCircle, Receipt, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function AdminFeeManagement() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: "", payment_method: "Cash", remarks: "" });
  const [courseFilter, setCourseFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: courses = [] } = useQuery({
    queryKey: ["fee-courses"],
    queryFn: async () => {
      const { data } = await supabase.from("courses").select("id, name, code").eq("is_active", true);
      return data || [];
    },
  });

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["fee-students", courseFilter],
    queryFn: async () => {
      let q = supabase.from("students").select("*, courses(name, code)").eq("is_active", true);
      if (courseFilter !== "all") q = q.eq("course_id", courseFilter);
      const { data: studs } = await q;
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name, email, phone");
      return (studs || []).map((s: any) => ({
        ...s,
        profile: profs?.find((p: any) => p.user_id === s.user_id),
      }));
    },
  });

  const { data: payments = [] } = useQuery({
    queryKey: ["fee-payments", selectedStudent?.id],
    queryFn: async () => {
      if (!selectedStudent) return [];
      const { data } = await supabase.from("fee_payments").select("*").eq("student_id", selectedStudent.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!selectedStudent,
  });

  const recordPayment = useMutation({
    mutationFn: async () => {
      if (!selectedStudent || !paymentForm.amount) throw new Error("Fill amount");
      const amount = parseFloat(paymentForm.amount);
      const newPaid = (selectedStudent.fee_paid || 0) + amount;
      const receipt_number = `RCP-${Date.now().toString().slice(-6)}`;
      
      await supabase.from("fee_payments").insert({
        student_id: selectedStudent.id, amount,
        payment_method: paymentForm.payment_method,
        remarks: paymentForm.remarks,
        receipt_number,
        recorded_by: user?.id,
      });
      
      await supabase.from("students").update({ fee_paid: newPaid }).eq("id", selectedStudent.id);
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      qc.invalidateQueries({ queryKey: ["fee-students"] });
      qc.invalidateQueries({ queryKey: ["fee-payments"] });
      setPaymentForm({ amount: "", payment_method: "Cash", remarks: "" });
      // Refresh selected student data
      setSelectedStudent((prev: any) => prev ? { ...prev, fee_paid: (prev.fee_paid || 0) + parseFloat(paymentForm.amount) } : null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filteredStudents = students.filter((s: any) => {
    const name = s.profile?.full_name || "";
    const roll = s.roll_number || "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || roll.toLowerCase().includes(search.toLowerCase());
    const due = (s.total_fee || 0) - (s.fee_paid || 0);
    const matchFee = feeFilter === "all" || (feeFilter === "due" && due > 0) || (feeFilter === "paid" && due <= 0);
    return matchSearch && matchFee;
  });

  const totalFees = students.reduce((sum: number, s: any) => sum + (s.total_fee || 0), 0);
  const totalPaid = students.reduce((sum: number, s: any) => sum + (s.fee_paid || 0), 0);
  const totalDue = totalFees - totalPaid;
  const dueCount = students.filter((s: any) => (s.total_fee || 0) - (s.fee_paid || 0) > 0).length;

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  const exportCSV = () => {
    const rows = filteredStudents.map((s: any) => {
      const due = (s.total_fee || 0) - (s.fee_paid || 0);
      return [s.profile?.full_name || "", s.roll_number, s.courses?.name || "", s.semester, s.total_fee || 0, s.fee_paid || 0, due, s.fee_due_date || "", s.profile?.phone || ""].map(v => `"${v}"`).join(",");
    });
    const header = "Name,Roll No,Course,Semester,Total Fee,Fee Paid,Fee Due,Due Date,Phone";
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "fee_report.csv"; a.click();
    toast.success("Fee report exported!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <DollarSign className="w-5 h-5 text-secondary" />
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Fee Management</h2>
            <p className="font-body text-sm text-muted-foreground">Track payments, record receipts, manage dues</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Fees", value: `₹${totalFees.toLocaleString()}`, icon: DollarSign, color: "from-primary/10 to-primary/5" },
          { label: "Collected", value: `₹${totalPaid.toLocaleString()}`, icon: CheckCircle, color: "from-green-500/10 to-green-500/5" },
          { label: "Pending", value: `₹${totalDue.toLocaleString()}`, icon: AlertCircle, color: "from-red-500/10 to-red-500/5" },
          { label: "Students with Due", value: dueCount, icon: Users, color: "from-secondary/10 to-secondary/5" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border border-border rounded-2xl p-4`}>
            <Icon className="w-5 h-5 text-foreground/50 mb-2" />
            <p className="font-display text-xl font-bold text-foreground">{value}</p>
            <p className="font-body text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or roll number..."
          className={`${inputClass} flex-1`} />
        <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background">
          <option value="all">All Courses</option>
          {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={feeFilter} onChange={e => setFeeFilter(e.target.value)} className="border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background">
          <option value="all">All Students</option>
          <option value="due">Fee Due</option>
          <option value="paid">Fully Paid</option>
        </select>
        <Button variant="outline" onClick={exportCSV} className="rounded-xl font-body text-xs whitespace-nowrap">
          <Download className="w-3 h-3 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Students Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Student</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Course</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Total Fee</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Paid</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Due</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Status</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="p-3"><Skeleton className="h-10 rounded-xl" /></td></tr>
              )) : filteredStudents.map((s: any) => {
                const due = (s.total_fee || 0) - (s.fee_paid || 0);
                const pct = s.total_fee > 0 ? Math.round(((s.fee_paid || 0) / s.total_fee) * 100) : 0;
                return (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="font-body text-sm font-semibold text-foreground">{s.profile?.full_name || "—"}</p>
                      <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
                    </td>
                    <td className="font-body text-sm p-4 text-muted-foreground">{s.courses?.code || "—"} · Sem {s.semester}</td>
                    <td className="font-body text-sm p-4 font-semibold">₹{(s.total_fee || 0).toLocaleString()}</td>
                    <td className="font-body text-sm p-4 text-green-600 font-semibold">₹{(s.fee_paid || 0).toLocaleString()}</td>
                    <td className="font-body text-sm p-4 font-semibold" style={{ color: due > 0 ? "hsl(0 84.2% 60.2%)" : "hsl(142 70% 40%)" }}>
                      {due > 0 ? `₹${due.toLocaleString()}` : "Cleared ✓"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[60px]">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct === 100 ? "hsl(142 70% 40%)" : "hsl(42 87% 55%)" }} />
                        </div>
                        <span className="font-body text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedStudent(s)}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-body text-xs font-semibold hover:bg-primary/20 transition-colors">
                          <Receipt className="w-3 h-3 inline mr-1" /> Record
                        </button>
                        {s.profile?.phone && (
                          <a href={`tel:${s.profile.phone}`} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredStudents.length === 0 && (
                <tr><td colSpan={7} className="text-center font-body text-sm text-muted-foreground p-8">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Record Payment</h3>
                <p className="font-body text-xs text-primary font-semibold">{selectedStudent.profile?.full_name} · {selectedStudent.roll_number}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: `₹${(selectedStudent.total_fee || 0).toLocaleString()}`, color: "text-foreground" },
                  { label: "Paid", value: `₹${(selectedStudent.fee_paid || 0).toLocaleString()}`, color: "text-green-600" },
                  { label: "Due", value: `₹${((selectedStudent.total_fee || 0) - (selectedStudent.fee_paid || 0)).toLocaleString()}`, color: "text-red-500" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className={`font-display text-base font-bold ${color}`}>{value}</p>
                    <p className="font-body text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Payment History */}
              {payments.length > 0 && (
                <div>
                  <h4 className="font-body text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Payment History</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {payments.map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/20 font-body text-xs">
                        <div>
                          <span className="font-semibold text-green-600">₹{p.amount}</span>
                          <span className="text-muted-foreground ml-2">{p.payment_method}</span>
                        </div>
                        <span className="text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5">Amount (₹) *</label>
                  <input type="number" value={paymentForm.amount} onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className={inputClass} placeholder="Enter amount" min="1" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5">Payment Method</label>
                  <select value={paymentForm.payment_method} onChange={e => setPaymentForm({ ...paymentForm, payment_method: e.target.value })} className={inputClass}>
                    {["Cash", "Online Transfer", "DD", "Cheque", "UPI"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5">Remarks</label>
                  <input value={paymentForm.remarks} onChange={e => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                    className={inputClass} placeholder="Optional notes..." />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedStudent(null)} className="flex-1 rounded-xl font-body">Cancel</Button>
                <Button onClick={() => recordPayment.mutate()} disabled={!paymentForm.amount || recordPayment.isPending} className="flex-1 rounded-xl font-body">
                  <CheckCircle className="w-4 h-4 mr-1" /> Record Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
