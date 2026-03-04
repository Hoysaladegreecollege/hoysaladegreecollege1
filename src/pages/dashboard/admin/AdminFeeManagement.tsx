import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DollarSign, Plus, ArrowLeft, Users, TrendingUp, AlertCircle, Phone, CheckCircle,
  Receipt, Download, PieChart, BarChart3, Calendar, Search, Filter, IndianRupee,
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight, Clock, FileText, Layers, Printer
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CHART_COLORS = ["hsl(142, 70%, 40%)", "hsl(0, 84%, 60%)", "hsl(42, 87%, 55%)", "hsl(217, 72%, 18%)", "hsl(280, 60%, 55%)"];

export default function AdminFeeManagement() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({ amount: "", payment_method: "Cash", remarks: "", upi_number: "", semester: "" });
  const [courseFilter, setCourseFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("all");
  const [statsCourseFilter, setStatsCourseFilter] = useState("all");
  const [statsSemFilter, setStatsSemFilter] = useState("all");
  const [statsStudentSearch, setStatsStudentSearch] = useState("");
  const [feeEditStudent, setFeeEditStudent] = useState<any>(null);
  const [feeEditForm, setFeeEditForm] = useState({ total_fee: "", fee_due_date: "", fee_remarks: "", payment_method: "Cash", upi_number: "" });
  const [feeEditMode, setFeeEditMode] = useState<"total" | "semester">("total");
  const [feeEditSemFees, setFeeEditSemFees] = useState<Record<number, string>>({});
  const [receiptStudent, setReceiptStudent] = useState<any>(null);
  const [receiptPayment, setReceiptPayment] = useState<any>(null);

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
      const { data } = await supabase.from("fee_payments").select("*, students(roll_number, user_id)").order("created_at", { ascending: false }).limit(200);
      if (!data) return [];
      // Fetch profiles to get student names
      const userIds = [...new Set(data.map((p: any) => p.students?.user_id).filter(Boolean))];
      let profilesMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
        profs?.forEach((p: any) => { profilesMap[p.user_id] = p.full_name; });
      }
      return data.map((p: any) => ({
        ...p,
        student_name: p.students?.user_id ? profilesMap[p.students.user_id] || "" : "",
        student_roll: p.students?.roll_number || "",
      }));
    },
  });

  const recordPayment = useMutation({
    mutationFn: async () => {
      if (!selectedStudent || !paymentForm.amount) throw new Error("Fill amount");
      const amount = parseFloat(paymentForm.amount);
      const newPaid = (selectedStudent.fee_paid || 0) + amount;
      const receipt_number = `RCP-${Date.now().toString().slice(-6)}`;
      const upiInfo = (paymentForm.payment_method === "Online" || paymentForm.payment_method === "UPI") && paymentForm.upi_number
        ? `[UPI: ${paymentForm.upi_number}] `
        : "";
      const remarks = `${upiInfo}${paymentForm.remarks || ""}`.trim();
      await supabase.from("fee_payments").insert({
        student_id: selectedStudent.id, amount,
        payment_method: paymentForm.payment_method,
        remarks,
        receipt_number,
        recorded_by: user?.id,
        semester: paymentForm.semester ? parseInt(paymentForm.semester) : (selectedStudent.semester || null),
      });
      await supabase.from("students").update({ fee_paid: newPaid }).eq("id", selectedStudent.id);
      return { receipt_number, amount, payment_method: paymentForm.payment_method, remarks };
    },
    onSuccess: async (data) => {
      toast.success("Payment recorded successfully!");
      qc.invalidateQueries({ queryKey: ["fee-students"] });
      qc.invalidateQueries({ queryKey: ["fee-payments"] });
      qc.invalidateQueries({ queryKey: ["all-fee-payments"] });
      setReceiptStudent(selectedStudent);
      setReceiptPayment({ ...data, created_at: new Date().toISOString(), student_name: selectedStudent.profile?.full_name, roll_number: selectedStudent.roll_number, course: selectedStudent.courses?.name });
      // Send receipt email to student
      const studentEmail = selectedStudent.profile?.email;
      if (studentEmail) {
        try {
          await supabase.functions.invoke("send-fee-receipt", {
            body: {
              studentEmail,
              studentName: selectedStudent.profile?.full_name || "",
              receiptNumber: data.receipt_number,
              amount: data.amount,
              paymentMethod: data.payment_method,
              courseName: selectedStudent.courses?.name || "",
              rollNumber: selectedStudent.roll_number || "",
              remarks: data.remarks || "",
              date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            },
          });
          toast.success("Receipt emailed to student!");
        } catch (e) {
          console.error("Email send failed:", e);
        }
      }
      setPaymentForm({ amount: "", payment_method: "Cash", remarks: "", upi_number: "", semester: "" });
      setSelectedStudent((prev: any) => prev ? { ...prev, fee_paid: (prev.fee_paid || 0) + parseFloat(paymentForm.amount) } : null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateFee = useMutation({
    mutationFn: async () => {
      if (!feeEditStudent) return;
      if (feeEditMode === "semester") {
        const entries = Object.entries(feeEditSemFees).filter(([_, v]) => v && parseFloat(v) > 0);
        for (const [sem, amount] of entries) {
          await supabase.from("semester_fees").upsert({
            student_id: feeEditStudent.id,
            semester: parseInt(sem),
            fee_amount: parseFloat(amount) || 0,
            due_date: feeEditForm.fee_due_date || null,
            remarks: feeEditForm.fee_remarks || "",
            updated_by: user?.id,
          }, { onConflict: "student_id,semester" });
        }
        const { data: allSemFees } = await supabase.from("semester_fees").select("fee_amount").eq("student_id", feeEditStudent.id);
        const totalFromSemesters = (allSemFees || []).reduce((sum: number, f: any) => sum + Number(f.fee_amount), 0);
        await supabase.from("students").update({
          total_fee: totalFromSemesters,
          fee_due_date: feeEditForm.fee_due_date || null,
          fee_remarks: feeEditForm.fee_remarks || "",
        }).eq("id", feeEditStudent.id);
      } else {
        await supabase.from("students").update({
          total_fee: parseFloat(feeEditForm.total_fee) || 0,
          fee_due_date: feeEditForm.fee_due_date || null,
          fee_remarks: feeEditForm.fee_remarks || "",
        }).eq("id", feeEditStudent.id);
      }
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
    const email = s.profile?.email || "";
    const phone = s.profile?.phone || s.phone || "";
    const searchLower = search.toLowerCase();
    const matchSearch = !search || name.toLowerCase().includes(searchLower) || roll.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower) || phone.includes(search);
    const due = (s.total_fee || 0) - (s.fee_paid || 0);
    const matchFee = feeFilter === "all" || (feeFilter === "due" && due > 0) || (feeFilter === "paid" && due <= 0) || (feeFilter === "overdue" && due > 0 && s.fee_due_date && new Date(s.fee_due_date) < new Date());
    const matchSem = semesterFilter === "all" || String(s.semester) === semesterFilter;
    return matchSearch && matchFee && matchSem;
  });

  // Stats-filtered students
  const statsFilteredStudents = students.filter((s: any) => {
    const matchCourse = statsCourseFilter === "all" || s.course_id === statsCourseFilter;
    const matchSem = statsSemFilter === "all" || String(s.semester) === statsSemFilter;
    const matchSearch = !statsStudentSearch || (s.profile?.full_name || "").toLowerCase().includes(statsStudentSearch.toLowerCase()) || (s.roll_number || "").toLowerCase().includes(statsStudentSearch.toLowerCase());
    return matchCourse && matchSem && matchSearch;
  });

  const totalFees = statsFilteredStudents.reduce((sum: number, s: any) => sum + (s.total_fee || 0), 0);
  const totalPaid = statsFilteredStudents.reduce((sum: number, s: any) => sum + (s.fee_paid || 0), 0);
  const totalDue = totalFees - totalPaid;
  const dueCount = statsFilteredStudents.filter((s: any) => (s.total_fee || 0) - (s.fee_paid || 0) > 0).length;
  const paidCount = statsFilteredStudents.filter((s: any) => (s.total_fee || 0) > 0 && (s.total_fee || 0) - (s.fee_paid || 0) <= 0).length;
  const overdueCount = statsFilteredStudents.filter((s: any) => {
    const due = (s.total_fee || 0) - (s.fee_paid || 0);
    return due > 0 && s.fee_due_date && new Date(s.fee_due_date) < new Date();
  }).length;
  const collectionRate = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;
  const statsStudentIds = new Set(statsFilteredStudents.map((s: any) => s.id));
  const statsPayments = allPayments.filter((p: any) => statsStudentIds.has(p.student_id));
  const onlinePaymentCount = statsPayments.filter((p: any) => p.payment_method === "Online" || p.payment_method === "UPI").length;

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

  // Monthly collection trends
  const monthlyTrends = (() => {
    const months: Record<string, number> = {};
    allPayments.forEach((p: any) => {
      const m = format(new Date(p.created_at), "MMM yyyy");
      months[m] = (months[m] || 0) + Number(p.amount);
    });
    return Object.entries(months).reverse().slice(0, 12).reverse().map(([month, amount]) => ({ month, amount }));
  })();

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

  const printReceipt = () => {
    if (!receiptPayment) return;
    const w = window.open("", "_blank", "width=400,height=600");
    if (!w) return;
    w.document.write(`
      <html><head><title>Payment Receipt</title>
      <style>body{font-family:sans-serif;padding:20px;max-width:380px;margin:0 auto}
      h1{text-align:center;font-size:18px;margin-bottom:4px}
      .sub{text-align:center;font-size:12px;color:#666;margin-bottom:20px}
      .divider{border-top:1px dashed #ccc;margin:12px 0}
      .row{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}
      .label{color:#666}.value{font-weight:bold}
      .total{font-size:16px;margin-top:8px;padding-top:8px;border-top:2px solid #333}
      .footer{text-align:center;font-size:10px;color:#999;margin-top:24px}
      @media print{button{display:none}}</style></head><body>
      <h1>Hoysala Degree College</h1>
      <p class="sub">Payment Receipt</p>
      <div class="divider"></div>
      <div class="row"><span class="label">Receipt No:</span><span class="value">${receiptPayment.receipt_number}</span></div>
      <div class="row"><span class="label">Date:</span><span class="value">${format(new Date(receiptPayment.created_at), "dd MMM yyyy, hh:mm a")}</span></div>
      <div class="divider"></div>
      <div class="row"><span class="label">Student:</span><span class="value">${receiptPayment.student_name || "—"}</span></div>
      <div class="row"><span class="label">Roll No:</span><span class="value">${receiptPayment.roll_number || "—"}</span></div>
      <div class="row"><span class="label">Course:</span><span class="value">${receiptPayment.course || "—"}</span></div>
      <div class="divider"></div>
      <div class="row"><span class="label">Payment Method:</span><span class="value">${receiptPayment.payment_method}</span></div>
      ${receiptPayment.remarks ? `<div class="row"><span class="label">Remarks:</span><span class="value">${receiptPayment.remarks}</span></div>` : ""}
      <div class="row total"><span>Amount Paid:</span><span>₹${Number(receiptPayment.amount).toLocaleString()}</span></div>
      <div class="footer"><p>Thank you for your payment!</p><p>This is a computer-generated receipt.</p></div>
      <br/><button onclick="window.print()" style="width:100%;padding:8px;cursor:pointer;border:1px solid #ccc;border-radius:8px;background:#f5f5f5">🖨️ Print Receipt</button>
      </body></html>
    `);
    w.document.close();
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
            <p className="font-body text-sm text-muted-foreground mt-1">Track payments, manage dues & generate reports</p>
          </div>
        </div>
      </div>

      {/* Stats Filter Section */}
      <div className="bg-card border border-border/60 rounded-2xl p-4">
        <h3 className="font-body text-xs font-semibold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-primary" /> Filter Fee Summary
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input value={statsStudentSearch} onChange={e => setStatsStudentSearch(e.target.value)}
              placeholder="Search student..."
              className="w-full font-body text-xs border border-border rounded-xl pl-9 pr-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={statsCourseFilter} onChange={e => setStatsCourseFilter(e.target.value)}
            className="font-body text-xs border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">All Courses</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
          <select value={statsSemFilter} onChange={e => setStatsSemFilter(e.target.value)}
            className="font-body text-xs border border-border rounded-xl px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="all">All Semesters</option>
            {[1,2,3,4,5,6].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
          </select>
          {(statsCourseFilter !== "all" || statsSemFilter !== "all" || statsStudentSearch) && (
            <Button variant="ghost" size="sm" onClick={() => { setStatsCourseFilter("all"); setStatsSemFilter("all"); setStatsStudentSearch(""); }} className="rounded-xl font-body text-xs">
              Clear
            </Button>
          )}
        </div>
        {(statsCourseFilter !== "all" || statsSemFilter !== "all" || statsStudentSearch) && (
          <p className="font-body text-[10px] text-muted-foreground mt-2">
            Showing stats for {statsFilteredStudents.length} of {students.length} students
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-7 gap-3">
        {[
          { label: "Total Fees", value: `₹${totalFees.toLocaleString()}`, icon: IndianRupee, gradient: "from-primary/10 to-primary/3", iconColor: "text-primary" },
          { label: "Collected", value: `₹${totalPaid.toLocaleString()}`, icon: CheckCircle, gradient: "from-emerald-500/10 to-emerald-500/3", iconColor: "text-emerald-600" },
          { label: "Pending", value: `₹${totalDue.toLocaleString()}`, icon: AlertCircle, gradient: "from-destructive/10 to-destructive/3", iconColor: "text-destructive" },
          { label: "Collection Rate", value: `${collectionRate}%`, icon: TrendingUp, gradient: "from-secondary/10 to-secondary/3", iconColor: "text-secondary-foreground" },
          { label: "Fee Due", value: dueCount, icon: Users, gradient: "from-orange-500/10 to-orange-500/3", iconColor: "text-orange-600" },
          { label: "Overdue", value: overdueCount, icon: Clock, gradient: "from-red-600/10 to-red-600/3", iconColor: "text-red-600" },
          { label: "Online Payments", value: onlinePaymentCount, icon: CreditCard, gradient: "from-purple-500/10 to-purple-500/3", iconColor: "text-purple-600" },
        ].map(({ label, value, icon: Icon, gradient, iconColor }) => (
          <div key={label} className={`relative overflow-hidden bg-gradient-to-br ${gradient} border border-border rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group`}>
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
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="font-body text-xs text-muted-foreground">Fully Paid</span></div>
                <span className="font-body text-sm font-bold text-foreground">{paidCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500" /><span className="font-body text-xs text-muted-foreground">Partially Paid</span></div>
                <span className="font-body text-sm font-bold text-foreground">{dueCount - overdueCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="font-body text-xs text-muted-foreground">Overdue</span></div>
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

      {/* Monthly Collection Trends */}
      {monthlyTrends.length > 1 && (
        <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all duration-300">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Monthly Collection Trends
          </h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 70%, 40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 70%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fontFamily: "Inter", fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, fontFamily: "Inter", fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} formatter={(v: any) => `₹${Number(v).toLocaleString()}`} />
                <Area type="monotone" dataKey="amount" stroke="hsl(142, 70%, 40%)" fill="url(#feeGrad)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(142, 70%, 40%)", strokeWidth: 2, stroke: "hsl(var(--card))" }} activeDot={{ r: 6 }} name="Collected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
          <div className="relative flex-1 min-w-[250px] sm:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, roll number or email..."
              className={`${inputClass} pl-10 pr-9`} />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors text-sm">✕</button>
            )}
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
                      <div className="flex items-center justify-center gap-1.5">
                        <Link to={`/dashboard/admin/fees/${s.id}`}
                          className="group relative px-3 py-1.5 rounded-xl font-body text-xs font-semibold inline-flex items-center gap-1.5 overflow-hidden border border-primary/20 bg-primary/5 text-primary backdrop-blur-md transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] hover:border-primary/40 hover:bg-primary/10 active:scale-[0.97]">
                          <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                          <Users className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">View</span>
                        </Link>
                        <button onClick={() => setSelectedStudent(s)}
                          className="group relative px-3 py-1.5 rounded-xl font-body text-xs font-semibold inline-flex items-center gap-1.5 overflow-hidden border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 backdrop-blur-md transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_0_20px_hsl(142_70%_40%/0.15)] hover:border-emerald-500/40 hover:bg-emerald-500/10 active:scale-[0.97]">
                          <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <Receipt className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">Pay</span>
                        </button>
                        <button onClick={async () => { setFeeEditStudent(s); setFeeEditForm({ total_fee: String(s.total_fee || ""), fee_due_date: s.fee_due_date || "", fee_remarks: s.fee_remarks || "", payment_method: "Cash", upi_number: "" }); setFeeEditMode("total"); const { data: sf } = await supabase.from("semester_fees").select("*").eq("student_id", s.id); const semMap: Record<number, string> = {}; (sf || []).forEach((f: any) => { semMap[f.semester] = String(f.fee_amount); }); setFeeEditSemFees(semMap); }}
                          className="group relative px-3 py-1.5 rounded-xl font-body text-xs font-semibold inline-flex items-center gap-1.5 overflow-hidden border border-amber-500/20 bg-amber-500/5 text-amber-400 backdrop-blur-md transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_0_20px_hsl(42_87%_55%/0.15)] hover:border-amber-500/40 hover:bg-amber-500/10 active:scale-[0.97]">
                          <span className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <FileText className="w-3.5 h-3.5 relative z-10" />
                          <span className="relative z-10">Edit</span>
                        </button>
                        {s.profile?.phone && (
                          <a href={`tel:${s.profile.phone}`} className="group relative p-1.5 rounded-xl border border-muted-foreground/10 bg-muted/5 text-muted-foreground backdrop-blur-md transition-all duration-300 hover:scale-[1.1] hover:border-muted-foreground/30 hover:bg-muted/10 hover:text-foreground hover:shadow-[0_0_15px_hsl(var(--muted)/0.2)] active:scale-[0.95]">
                            <Phone className="w-3.5 h-3.5 relative z-10" />
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

      {/* Fee Defaulters Section */}
      <div className="bg-card border border-destructive/20 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="p-5 border-b border-border bg-destructive/5 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" /> Fee Defaulters — Not Cleared
          </h3>
          <span className="font-body text-xs bg-destructive/10 text-destructive px-2.5 py-1 rounded-full font-bold">{students.filter((s: any) => (s.total_fee || 0) - (s.fee_paid || 0) > 0).length} student(s)</span>
        </div>
        {(() => {
          const defaulters = students.filter((s: any) => (s.total_fee || 0) - (s.fee_paid || 0) > 0);
          if (defaulters.length === 0) return (
            <div className="p-8 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-body text-sm text-muted-foreground">All fees are cleared! 🎉</p>
            </div>
          );

          // Group by semester
          const bySemester: Record<number, any[]> = {};
          defaulters.forEach((s: any) => {
            const sem = s.semester || 0;
            if (!bySemester[sem]) bySemester[sem] = [];
            bySemester[sem].push(s);
          });

          return (
            <div className="divide-y divide-border/50">
              {Object.entries(bySemester).sort(([a], [b]) => Number(a) - Number(b)).map(([sem, studs]) => (
                <div key={sem}>
                  <div className="px-5 py-2.5 bg-muted/20 flex items-center justify-between">
                    <span className="font-body text-xs font-bold text-foreground flex items-center gap-2">
                      <Layers className="w-3 h-3 text-primary" /> {Number(sem) > 0 ? `Semester ${sem}` : "No Semester"}
                    </span>
                    <span className="font-body text-[10px] text-muted-foreground">{studs.length} defaulter(s) · ₹{studs.reduce((s: number, st: any) => s + ((st.total_fee || 0) - (st.fee_paid || 0)), 0).toLocaleString()} pending</span>
                  </div>
                  {studs.map((s: any) => {
                    const due = (s.total_fee || 0) - (s.fee_paid || 0);
                    return (
                      <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                          <IndianRupee className="w-3.5 h-3.5 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground truncate">{s.profile?.full_name || "—"}</p>
                          <p className="font-body text-[10px] text-muted-foreground">{s.roll_number} · {s.courses?.code || "—"}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-body text-sm font-bold text-destructive">₹{due.toLocaleString()}</p>
                          <p className="font-body text-[10px] text-muted-foreground">of ₹{(s.total_fee || 0).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setSelectedStudent(s)} className="px-2 py-1 rounded-lg bg-primary/10 text-primary font-body text-[10px] font-semibold hover:bg-primary/20 transition-colors">Pay</button>
                          {s.profile?.phone && (
                            <a href={`tel:${s.profile.phone}`} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><Phone className="w-3 h-3" /></a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          );
        })()}
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
                    <p className="font-body text-xs font-semibold text-foreground">{p.student_name || p.receipt_number || "—"}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{p.receipt_number}{p.student_roll ? ` · ${p.student_roll}` : ""} · {p.payment_method}{p.semester ? ` · Sem ${p.semester}` : ""}</p>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
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
                          {p.semester && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">Sem {p.semester}</span>}
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
                  <label className="font-body text-xs font-semibold block mb-1.5">Semester</label>
                  <select value={paymentForm.semester} onChange={e => setPaymentForm({ ...paymentForm, semester: e.target.value })} className={inputClass}>
                    <option value="">Current ({selectedStudent?.semester || "—"})</option>
                    {[1,2,3,4,5,6].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5">Payment Method</label>
                  <select value={paymentForm.payment_method} onChange={e => setPaymentForm({ ...paymentForm, payment_method: e.target.value, upi_number: "" })} className={inputClass}>
                    {["Cash", "Online", "Cheque", "UPI", "DD"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                {(paymentForm.payment_method === "Online" || paymentForm.payment_method === "UPI") && (
                  <div>
                    <label className="font-body text-xs font-semibold block mb-1.5">UPI / Transaction Number</label>
                    <input value={paymentForm.upi_number} onChange={e => setPaymentForm({ ...paymentForm, upi_number: e.target.value })}
                      className={inputClass} placeholder="Enter UPI ID or transaction number" />
                  </div>
                )}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10 rounded-t-2xl">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Edit Fee Details</h3>
                <p className="font-body text-xs text-primary font-semibold">{feeEditStudent.profile?.full_name} · {feeEditStudent.roll_number}</p>
              </div>
              <button onClick={() => setFeeEditStudent(null)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Mode Toggle */}
              <div className="flex gap-2 p-1 bg-muted/40 rounded-xl">
                <button onClick={() => setFeeEditMode("total")}
                  className={`flex-1 py-2 rounded-lg font-body text-xs font-semibold transition-all duration-200 ${feeEditMode === "total" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  Total Fee
                </button>
                <button onClick={() => setFeeEditMode("semester")}
                  className={`flex-1 py-2 rounded-lg font-body text-xs font-semibold transition-all duration-200 ${feeEditMode === "semester" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  Semester-wise Fee
                </button>
              </div>

              {feeEditMode === "total" ? (
                <div>
                  <label className="font-body text-xs font-semibold block mb-1.5">Total Fee (₹)</label>
                  <input type="number" value={feeEditForm.total_fee} onChange={e => setFeeEditForm({ ...feeEditForm, total_fee: e.target.value })}
                    className={inputClass} placeholder="Total fee amount" />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-body text-xs text-muted-foreground">Set fee for each semester. Total fee will be auto-calculated.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <div key={sem}>
                        <label className="font-body text-[11px] text-muted-foreground mb-1 block">Semester {sem}</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-xs text-muted-foreground">₹</span>
                          <input type="number" value={feeEditSemFees[sem] || ""} onChange={e => setFeeEditSemFees(prev => ({ ...prev, [sem]: e.target.value }))}
                            className={`${inputClass} pl-7`} placeholder="0" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-center justify-between">
                    <span className="font-body text-xs font-semibold text-foreground">Auto-calculated Total</span>
                    <span className="font-display text-lg font-bold text-primary tabular-nums">
                      ₹{Object.values(feeEditSemFees).reduce((sum, v) => sum + (parseFloat(v) || 0), 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

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

      {/* Receipt Dialog */}
      <Dialog open={!!receiptPayment} onOpenChange={() => setReceiptPayment(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-500" /> Payment Receipt
            </DialogTitle>
          </DialogHeader>
          {receiptPayment && (
            <div className="space-y-4 mt-2">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-display text-2xl font-bold text-emerald-600">₹{Number(receiptPayment.amount).toLocaleString()}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">Payment Recorded Successfully</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Receipt No</span><span className="font-semibold">{receiptPayment.receipt_number}</span></div>
                <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Student</span><span className="font-semibold">{receiptPayment.student_name}</span></div>
                <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Roll No</span><span className="font-semibold">{receiptPayment.roll_number}</span></div>
                <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Course</span><span className="font-semibold">{receiptPayment.course}</span></div>
                <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Method</span><span className="font-semibold">{receiptPayment.payment_method}</span></div>
                <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Date</span><span className="font-semibold">{format(new Date(receiptPayment.created_at), "dd MMM yyyy, hh:mm a")}</span></div>
                {receiptPayment.remarks && <div className="flex justify-between font-body text-xs"><span className="text-muted-foreground">Remarks</span><span className="font-semibold">{receiptPayment.remarks}</span></div>}
              </div>
              <Button onClick={printReceipt} className="w-full rounded-xl font-body">
                <Printer className="w-4 h-4 mr-2" /> Print / Download Receipt
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
