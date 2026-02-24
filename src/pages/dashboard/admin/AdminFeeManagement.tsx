import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Plus, ArrowLeft, Users, TrendingUp, AlertCircle, Phone, CheckCircle,
  Receipt, Download, PieChart, BarChart3, Calendar, Search, Filter, IndianRupee,
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Clock, FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CHART_COLORS = ["hsl(142, 70%, 40%)", "hsl(0, 84%, 60%)", "hsl(42, 87%, 55%)", "hsl(217, 72%, 18%)"];

export default function AdminFeeManagement() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: "", payment_method: "Cash", remarks: "" });
  const [courseFilter, setCourseFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [feeEditStudent, setFeeEditStudent] = useState<any>(null);
  const [feeEditForm, setFeeEditForm] = useState({ total_fee: "", fee_due_date: "", fee_remarks: "" });

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

  const { data: allPayments = [] } = useQuery({
    queryKey: ["all-fee-payments"],
    queryFn: async () => {
      const { data } = await supabase.from("fee_payments").select("*").order("created_at", { ascending: false }).limit(50);
      return data || [];
    },
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
      qc.invalidateQueries({ queryKey: ["all-fee-payments"] });
      setPaymentForm({ amount: "", payment_method: "Cash", remarks: "" });
      setSelectedStudent((prev: any) => prev ? { ...prev, fee_paid: (prev.fee_paid || 0) + parseFloat(paymentForm.amount) } : null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateFee = useMutation({
    mutationFn: async () => {
      if (!feeEditStudent) return;
      await supabase.from("students").update({
        total_fee: parseFloat(feeEditForm.total_fee) || 0,
        fee_due_date: feeEditForm.fee_due_date || null,
        fee_remarks: feeEditForm.fee_remarks || "",
      }).eq("id", feeEditStudent.id);
    },
    onSuccess: () => {
      toast.success("Fee details updated!");
      qc.invalidateQueries({ queryKey: ["fee-students"] });
      setFeeEditStudent(null);
    },
    onError: () => toast.error("Failed to update fee details"),
  });

  const filteredStudents = students.filter((s: any) => {
    const name = s.profile?.full_name || "";
    const roll = s.roll_number || "";
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || roll.toLowerCase().includes(search.toLowerCase());
    const due = (s.total_fee || 0) - (s.fee_paid || 0);
    const matchFee = feeFilter === "all" || (feeFilter === "due" && due > 0) || (feeFilter === "paid" && due <= 0) || (feeFilter === "overdue" && due > 0 && s.fee_due_date && new Date(s.fee_due_date) < new Date());
    const matchSem = semesterFilter === "all" || String(s.semester) === semesterFilter;
    return matchSearch && matchFee && matchSem;
  });

  const totalFees = students.reduce((sum: number, s: any) => sum + (s.total_fee || 0), 0);
  const totalPaid = students.reduce((sum: number, s: any) => sum + (s.fee_paid || 0), 0);
  const totalDue = totalFees - totalPaid;
  const dueCount = students.filter((s: any) => (s.total_fee || 0) - (s.fee_paid || 0) > 0).length;
  const paidCount = students.filter((s: any) => (s.total_fee || 0) > 0 && (s.total_fee || 0) - (s.fee_paid || 0) <= 0).length;
  const overdueCount = students.filter((s: any) => {
    const due = (s.total_fee || 0) - (s.fee_paid || 0);
    return due > 0 && s.fee_due_date && new Date(s.fee_due_date) < new Date();
  }).length;
  const collectionRate = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;

  // Payment method breakdown
  const methodBreakdown = allPayments.reduce((acc: Record<string, number>, p: any) => {
    acc[p.payment_method || "Cash"] = (acc[p.payment_method || "Cash"] || 0) + Number(p.amount);
    return acc;
  }, {});
  const methodChartData = Object.entries(methodBreakdown).map(([name, value]) => ({ name, value }));

  // Course-wise fee collection
  const courseWiseFees = courses.map((c: any) => {
    const courseStudents = students.filter((s: any) => s.course_id === c.id);
    const total = courseStudents.reduce((s: number, st: any) => s + (st.total_fee || 0), 0);
    const paid = courseStudents.reduce((s: number, st: any) => s + (st.fee_paid || 0), 0);
    return { name: c.code, total, paid, due: total - paid };
  }).filter(c => c.total > 0);

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200";

  const exportCSV = () => {
    const rows = filteredStudents.map((s: any) => {
      const due = (s.total_fee || 0) - (s.fee_paid || 0);
      return [s.profile?.full_name || "", s.roll_number, s.courses?.name || "", s.semester, s.total_fee || 0, s.fee_paid || 0, due, s.fee_due_date || "", s.profile?.phone || "", s.fee_remarks || ""].map(v => `"${v}"`).join(",");
    });
    const header = "Name,Roll No,Course,Semester,Total Fee,Fee Paid,Fee Due,Due Date,Phone,Remarks";
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `fee_report_${new Date().toISOString().split("T")[0]}.csv`; a.click();
    toast.success("Fee report exported!");
  };

  const exportDefaultersCSV = () => {
    const defaulters = filteredStudents.filter((s: any) => (s.total_fee || 0) - (s.fee_paid || 0) > 0);
    if (defaulters.length === 0) { toast.info("No defaulters to export"); return; }
    const rows = defaulters.map((s: any) => {
      const due = (s.total_fee || 0) - (s.fee_paid || 0);
      return [s.profile?.full_name || "", s.roll_number, s.courses?.name || "", s.semester, s.total_fee || 0, s.fee_paid || 0, due, s.fee_due_date || "", s.profile?.phone || "", s.parent_phone || ""].map(v => `"${v}"`).join(",");
    });
    const csv = ["Name,Roll No,Course,Semester,Total Fee,Paid,Due,Due Date,Phone,Parent Phone", ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `fee_defaulters_${new Date().toISOString().split("T")[0]}.csv`; a.click();
    toast.success("Defaulters report exported!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6 md:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <Link to="/dashboard/admin" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0"><ArrowLeft className="w-4 h-4" /></Link>
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/25 rounded-full px-3 py-1 mb-2">
              <IndianRupee className="w-3 h-3 text-secondary-foreground" />
              <span className="font-body text-[11px] text-secondary-foreground font-semibold uppercase tracking-wider">Financial Hub</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Fee Management Console</h2>
            <p className="font-body text-sm text-muted-foreground mt-1">Track payments, manage dues, generate reports & analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Fees", value: `₹${totalFees.toLocaleString()}`, icon: IndianRupee, gradient: "from-primary/10 to-primary/3", iconColor: "text-primary" },
          { label: "Collected", value: `₹${totalPaid.toLocaleString()}`, icon: CheckCircle, gradient: "from-emerald-500/10 to-emerald-500/3", iconColor: "text-emerald-600" },
          { label: "Pending", value: `₹${totalDue.toLocaleString()}`, icon: AlertCircle, gradient: "from-destructive/10 to-destructive/3", iconColor: "text-destructive" },
          { label: "Collection Rate", value: `${collectionRate}%`, icon: TrendingUp, gradient: "from-secondary/10 to-secondary/3", iconColor: "text-secondary-foreground" },
          { label: "Fee Due", value: dueCount, icon: Users, gradient: "from-orange-500/10 to-orange-500/3", iconColor: "text-orange-600" },
          { label: "Overdue", value: overdueCount, icon: Clock, gradient: "from-red-600/10 to-red-600/3", iconColor: "text-red-600" },
        ].map(({ label, value, icon: Icon, gradient, iconColor }) => (
          <div key={label} className={`relative overflow-hidden bg-gradient-to-br ${gradient} border border-border rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none spotlight" />
            <Icon className={`w-5 h-5 ${iconColor} mb-2 group-hover:scale-110 transition-transform duration-300`} />
            <p className="font-display text-xl font-bold text-foreground">{value}</p>
            <p className="font-body text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Collection Progress Ring */}
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" /> Collection Overview
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={collectionRate >= 80 ? "hsl(142, 70%, 40%)" : collectionRate >= 50 ? "hsl(42, 87%, 55%)" : "hsl(0, 84%, 60%)"}
                  strokeWidth="10"
                  strokeDasharray={`${(collectionRate / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-bold text-foreground">{collectionRate}%</span>
                <span className="font-body text-[9px] text-muted-foreground">Collected</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-body text-xs text-muted-foreground">Fully Paid</span>
                </div>
                <span className="font-body text-sm font-bold text-foreground">{paidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-body text-xs text-muted-foreground">Partially Paid</span>
                </div>
                <span className="font-body text-sm font-bold text-foreground">{dueCount - overdueCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-body text-xs text-muted-foreground">Overdue</span>
                </div>
                <span className="font-body text-sm font-bold text-foreground">{overdueCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-secondary-foreground" /> Payment Methods
          </h3>
          {methodChartData.length > 0 ? (
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={methodChartData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value"
                    label={({ name, value }) => `${name}: ₹${Number(value).toLocaleString()}`}
                    style={{ fontSize: 10, fontFamily: "Inter" }}>
                    {methodChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-44 text-muted-foreground font-body text-sm">No payment data yet</div>
          )}
        </div>
      </div>

      {/* Course-wise Fee Collection Chart */}
      {courseWiseFees.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Course-wise Fee Collection
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseWiseFees} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
                <Bar dataKey="paid" fill="hsl(142, 70%, 40%)" radius={[4, 4, 0, 0]} name="Collected" />
                <Bar dataKey="due" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or roll number..."
              className={`${inputClass} pl-9`} />
          </div>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className={`${inputClass} w-auto`}>
            <option value="all">All Courses</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)} className={`${inputClass} w-auto`}>
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6].map(s => <option key={s} value={String(s)}>Sem {s}</option>)}
          </select>
          <select value={feeFilter} onChange={e => setFeeFilter(e.target.value)} className={`${inputClass} w-auto`}>
            <option value="all">All Students</option>
            <option value="due">Fee Due</option>
            <option value="paid">Fully Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={exportCSV} className="rounded-xl font-body text-xs">
            <Download className="w-3 h-3 mr-1" /> Export All
          </Button>
          <Button variant="outline" size="sm" onClick={exportDefaultersCSV} className="rounded-xl font-body text-xs">
            <AlertCircle className="w-3 h-3 mr-1" /> Export Defaulters
          </Button>
          <div className="ml-auto font-body text-xs text-muted-foreground flex items-center gap-1">
            <Filter className="w-3 h-3" /> Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Student</th>
                <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Course</th>
                <th className="text-right font-body text-xs font-semibold text-muted-foreground p-4">Total Fee</th>
                <th className="text-right font-body text-xs font-semibold text-muted-foreground p-4">Paid</th>
                <th className="text-right font-body text-xs font-semibold text-muted-foreground p-4">Due</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Due Date</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Progress</th>
                <th className="text-center font-body text-xs font-semibold text-muted-foreground p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={8} className="p-3"><Skeleton className="h-12 rounded-xl" /></td></tr>
              )) : filteredStudents.map((s: any) => {
                const due = (s.total_fee || 0) - (s.fee_paid || 0);
                const pct = s.total_fee > 0 ? Math.round(((s.fee_paid || 0) / s.total_fee) * 100) : 0;
                const isOverdue = due > 0 && s.fee_due_date && new Date(s.fee_due_date) < new Date();
                return (
                  <tr key={s.id} className={`border-b border-border/50 hover:bg-muted/20 transition-all duration-200 ${isOverdue ? "bg-destructive/3" : ""}`}>
                    <td className="p-4">
                      <p className="font-body text-sm font-semibold text-foreground">{s.profile?.full_name || "—"}</p>
                      <p className="font-body text-xs text-muted-foreground">{s.roll_number}</p>
                    </td>
                    <td className="font-body text-sm p-4 text-muted-foreground">{s.courses?.code || "—"} · Sem {s.semester}</td>
                    <td className="font-body text-sm p-4 font-semibold text-right tabular-nums">₹{(s.total_fee || 0).toLocaleString()}</td>
                    <td className="font-body text-sm p-4 text-emerald-600 font-semibold text-right tabular-nums">₹{(s.fee_paid || 0).toLocaleString()}</td>
                    <td className="font-body text-sm p-4 font-semibold text-right tabular-nums" style={{ color: due > 0 ? "hsl(0 84.2% 60.2%)" : "hsl(142 70% 40%)" }}>
                      {due > 0 ? `₹${due.toLocaleString()}` : "✓ Cleared"}
                    </td>
                    <td className="p-4 text-center">
                      {s.fee_due_date ? (
                        <span className={`font-body text-xs px-2 py-1 rounded-lg ${isOverdue ? "bg-destructive/10 text-destructive font-bold" : "text-muted-foreground"}`}>
                          {format(new Date(s.fee_due_date), "MMM d, yyyy")}
                        </span>
                      ) : <span className="font-body text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 justify-center">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-[50px] max-w-[80px]">
                          <div className="h-full rounded-full transition-all duration-700" style={{
                            width: `${pct}%`,
                            background: pct === 100 ? "hsl(142 70% 40%)" : pct > 50 ? "hsl(42 87% 55%)" : "hsl(0 84% 60%)"
                          }} />
                        </div>
                        <span className="font-body text-xs font-bold text-muted-foreground tabular-nums w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setSelectedStudent(s)}
                          className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-body text-xs font-semibold hover:bg-primary/20 transition-all duration-200 hover:scale-105">
                          <Receipt className="w-3 h-3 inline mr-1" /> Pay
                        </button>
                        <button onClick={() => { setFeeEditStudent(s); setFeeEditForm({ total_fee: String(s.total_fee || ""), fee_due_date: s.fee_due_date || "", fee_remarks: s.fee_remarks || "" }); }}
                          className="px-2.5 py-1.5 rounded-lg bg-secondary/10 text-secondary-foreground font-body text-xs font-semibold hover:bg-secondary/20 transition-all duration-200 hover:scale-105">
                          <FileText className="w-3 h-3 inline mr-1" /> Edit
                        </button>
                        {s.profile?.phone && (
                          <a href={`tel:${s.profile.phone}`} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all duration-200 hover:scale-110">
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredStudents.length === 0 && (
                <tr><td colSpan={8} className="text-center font-body text-sm text-muted-foreground p-8">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Payments */}
      {allPayments.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Recent Transactions
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {allPayments.slice(0, 15).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">{p.receipt_number || "—"}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{p.payment_method} · {p.remarks || "No remarks"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-body text-sm font-bold text-emerald-600">₹{Number(p.amount).toLocaleString()}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Record Payment</h3>
                <p className="font-body text-xs text-primary font-semibold">{selectedStudent.profile?.full_name} · {selectedStudent.roll_number}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: `₹${(selectedStudent.total_fee || 0).toLocaleString()}`, color: "text-foreground" },
                  { label: "Paid", value: `₹${(selectedStudent.fee_paid || 0).toLocaleString()}`, color: "text-emerald-600" },
                  { label: "Due", value: `₹${((selectedStudent.total_fee || 0) - (selectedStudent.fee_paid || 0)).toLocaleString()}`, color: "text-destructive" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className={`font-display text-base font-bold ${color}`}>{value}</p>
                    <p className="font-body text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              {payments.length > 0 && (
                <div>
                  <h4 className="font-body text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Payment History</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {payments.map((p: any) => (
                      <div key={p.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/20 font-body text-xs">
                        <div>
                          <span className="font-semibold text-emerald-600">₹{p.amount}</span>
                          <span className="text-muted-foreground ml-2">{p.payment_method}</span>
                          {p.receipt_number && <span className="text-muted-foreground ml-1">· {p.receipt_number}</span>}
                        </div>
                        <span className="text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

      {/* Fee Edit Modal */}
      {feeEditStudent && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Edit Fee Details</h3>
                <p className="font-body text-xs text-primary font-semibold">{feeEditStudent.profile?.full_name} · {feeEditStudent.roll_number}</p>
              </div>
              <button onClick={() => setFeeEditStudent(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="font-body text-xs font-semibold block mb-1.5">Total Fee (₹)</label>
                <input type="number" value={feeEditForm.total_fee} onChange={e => setFeeEditForm({ ...feeEditForm, total_fee: e.target.value })}
                  className={inputClass} placeholder="Total fee amount" />
              </div>
              <div>
                <label className="font-body text-xs font-semibold block mb-1.5">Due Date</label>
                <input type="date" value={feeEditForm.fee_due_date} onChange={e => setFeeEditForm({ ...feeEditForm, fee_due_date: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className="font-body text-xs font-semibold block mb-1.5">Remarks</label>
                <input value={feeEditForm.fee_remarks} onChange={e => setFeeEditForm({ ...feeEditForm, fee_remarks: e.target.value })}
                  className={inputClass} placeholder="Fee remarks..." />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setFeeEditStudent(null)} className="flex-1 rounded-xl font-body">Cancel</Button>
                <Button onClick={() => updateFee.mutate()} disabled={updateFee.isPending} className="flex-1 rounded-xl font-body">
                  <CheckCircle className="w-4 h-4 mr-1" /> Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}