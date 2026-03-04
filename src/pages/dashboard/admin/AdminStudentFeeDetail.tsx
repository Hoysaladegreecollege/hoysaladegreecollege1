import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, IndianRupee, Calendar, User, BookOpen, Receipt, Phone, Mail, MapPin, CheckCircle, AlertCircle, Layers, CreditCard, TrendingUp, Plus, Printer, Bell, FileText, Send, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["hsl(142, 70%, 40%)", "hsl(0, 84%, 60%)", "hsl(42, 87%, 55%)", "hsl(217, 72%, 18%)", "hsl(280, 60%, 55%)"];

export default function AdminStudentFeeDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const { user } = useAuth();
  const qc = useQueryClient();

  // Modal states
  const [showPayModal, setShowPayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Payment form
  const [payForm, setPayForm] = useState({ amount: "", payment_method: "Cash", remarks: "", upi_number: "", semester: "" });

  // Edit form
  const [editForm, setEditForm] = useState({ total_fee: "", fee_due_date: "", fee_remarks: "" });

  // Reminder form
  const [reminderMsg, setReminderMsg] = useState("");

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["fee-student-detail", studentId],
    queryFn: async () => {
      const { data } = await supabase.from("students").select("*, courses(name, code)").eq("id", studentId!).single();
      if (!data) return null;
      const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", data.user_id).single();
      return { ...data, profile: prof };
    },
    enabled: !!studentId,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["fee-student-payments", studentId],
    queryFn: async () => {
      const { data } = await supabase.from("fee_payments").select("*").eq("student_id", studentId!).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!studentId,
  });

  // Record Payment mutation
  const recordPayment = useMutation({
    mutationFn: async () => {
      if (!student || !payForm.amount) throw new Error("Fill amount");
      const amount = parseFloat(payForm.amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
      const newPaid = (student.fee_paid || 0) + amount;
      const receipt_number = `RCP-${Date.now().toString().slice(-6)}`;
      const upiInfo = (payForm.payment_method === "Online" || payForm.payment_method === "UPI") && payForm.upi_number
        ? `[UPI: ${payForm.upi_number}] ` : "";
      const remarks = `${upiInfo}${payForm.remarks || ""}`.trim();
      await supabase.from("fee_payments").insert({
        student_id: student.id, amount, payment_method: payForm.payment_method,
        remarks, receipt_number, recorded_by: user?.id,
        semester: payForm.semester ? parseInt(payForm.semester) : (student.semester || null),
      });
      await supabase.from("students").update({ fee_paid: newPaid }).eq("id", student.id);
      // Send receipt email
      const studentEmail = student.profile?.email;
      if (studentEmail) {
        try {
          await supabase.functions.invoke("send-fee-receipt", {
            body: {
              studentEmail, studentName: student.profile?.full_name || "",
              receiptNumber: receipt_number, amount, paymentMethod: payForm.payment_method,
              courseName: student.courses?.name || "", rollNumber: student.roll_number || "",
              remarks, date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            },
          });
        } catch (e) { console.error("Email failed:", e); }
      }
      return { receipt_number, amount };
    },
    onSuccess: () => {
      toast.success("Payment recorded & receipt emailed!");
      qc.invalidateQueries({ queryKey: ["fee-student-detail"] });
      qc.invalidateQueries({ queryKey: ["fee-student-payments"] });
      qc.invalidateQueries({ queryKey: ["fee-students"] });
      qc.invalidateQueries({ queryKey: ["all-fee-payments"] });
      setPayForm({ amount: "", payment_method: "Cash", remarks: "", upi_number: "", semester: "" });
      setShowPayModal(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Update Fee mutation
  const updateFee = useMutation({
    mutationFn: async () => {
      if (!student) return;
      await supabase.from("students").update({
        total_fee: parseFloat(editForm.total_fee) || 0,
        fee_due_date: editForm.fee_due_date || null,
        fee_remarks: editForm.fee_remarks || "",
      }).eq("id", student.id);
    },
    onSuccess: () => {
      toast.success("Fee details updated!");
      qc.invalidateQueries({ queryKey: ["fee-student-detail"] });
      qc.invalidateQueries({ queryKey: ["fee-students"] });
      setShowEditModal(false);
    },
    onError: () => toast.error("Failed to update"),
  });

  // Send reminder mutation
  const sendReminder = useMutation({
    mutationFn: async () => {
      if (!student) return;
      const due = (student.total_fee || 0) - (student.fee_paid || 0);
      const msg = reminderMsg || `Dear ${student.profile?.full_name}, you have a pending fee of ₹${due.toLocaleString()}. Please clear your dues at the earliest. - Hoysala Degree College`;
      await supabase.from("notifications").insert({
        user_id: student.user_id,
        title: "Fee Payment Reminder",
        message: msg,
        type: "fee",
        link: "/dashboard/student/fees",
      });
    },
    onSuccess: () => {
      toast.success("Reminder sent to student!");
      setReminderMsg("");
      setShowReminderModal(false);
    },
    onError: () => toast.error("Failed to send reminder"),
  });

  // Print full report
  const printReport = () => {
    if (!student) return;
    const due = Math.max(0, (student.total_fee || 0) - (student.fee_paid || 0));
    const pctVal = (student.total_fee || 0) > 0 ? Math.round(((student.fee_paid || 0) / (student.total_fee || 0)) * 100) : 0;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    const paymentRows = payments.map((p: any) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;font-family:monospace;color:#4f46e5">${p.receipt_number || "—"}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px">${format(new Date(p.created_at), "dd MMM yyyy, hh:mm a")}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px">${p.semester ? `Sem ${p.semester}` : "—"}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px">${p.payment_method || "Cash"}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;text-align:right;font-weight:bold;color:#16a34a">₹${Number(p.amount).toLocaleString()}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;color:#666">${p.remarks || "—"}</td>
      </tr>
    `).join("");

    w.document.write(`
      <html><head><title>Fee Report - ${student.profile?.full_name}</title>
      <style>
        body{font-family:'Segoe UI',sans-serif;padding:30px;max-width:780px;margin:0 auto;color:#222}
        h1{text-align:center;font-size:22px;margin-bottom:2px}
        .sub{text-align:center;font-size:13px;color:#666;margin-bottom:24px}
        .section{margin:20px 0;padding:16px;border:1px solid #e5e7eb;border-radius:12px}
        .section h2{font-size:14px;color:#4f46e5;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:1px}
        .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
        .grid-item{padding:8px;background:#f9fafb;border-radius:8px}
        .grid-item .label{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px}
        .grid-item .value{font-size:13px;font-weight:600}
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0}
        .stat{text-align:center;padding:12px;background:#f0fdf4;border-radius:10px;border:1px solid #d1fae5}
        .stat.due{background:#fef2f2;border-color:#fecaca}
        .stat .val{font-size:18px;font-weight:bold}
        .stat .lbl{font-size:10px;color:#666;text-transform:uppercase}
        table{width:100%;border-collapse:collapse;margin-top:8px}
        th{text-align:left;padding:10px 8px;background:#f3f4f6;font-size:11px;text-transform:uppercase;color:#666;letter-spacing:0.5px}
        .footer{text-align:center;font-size:10px;color:#999;margin-top:30px;padding-top:16px;border-top:1px solid #e5e7eb}
        @media print{button{display:none!important}.no-print{display:none!important}}
      </style></head><body>
      <h1>Hoysala Degree College</h1>
      <p class="sub">Student Fee Report · Generated on ${format(new Date(), "dd MMM yyyy, hh:mm a")}</p>
      
      <div class="section">
        <h2>Student Information</h2>
        <div class="grid">
          <div class="grid-item"><div class="label">Name</div><div class="value">${student.profile?.full_name || "—"}</div></div>
          <div class="grid-item"><div class="label">Roll No</div><div class="value">${student.roll_number}</div></div>
          <div class="grid-item"><div class="label">Course</div><div class="value">${student.courses?.name || "—"} (${student.courses?.code || ""})</div></div>
          <div class="grid-item"><div class="label">Semester</div><div class="value">${student.semester || 1}</div></div>
          <div class="grid-item"><div class="label">Email</div><div class="value">${student.profile?.email || "—"}</div></div>
          <div class="grid-item"><div class="label">Phone</div><div class="value">${student.profile?.phone || student.phone || "—"}</div></div>
          <div class="grid-item"><div class="label">Father</div><div class="value">${student.father_name || "—"}</div></div>
          <div class="grid-item"><div class="label">Mother</div><div class="value">${student.mother_name || "—"}</div></div>
          <div class="grid-item"><div class="label">Parent Phone</div><div class="value">${student.parent_phone || "—"}</div></div>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><div class="val">₹${(student.total_fee || 0).toLocaleString()}</div><div class="lbl">Total Fee</div></div>
        <div class="stat"><div class="val" style="color:#16a34a">₹${(student.fee_paid || 0).toLocaleString()}</div><div class="lbl">Total Paid</div></div>
        <div class="stat ${due > 0 ? 'due' : ''}"><div class="val" style="color:${due > 0 ? '#dc2626' : '#16a34a'}">₹${due.toLocaleString()}</div><div class="lbl">Balance Due</div></div>
        <div class="stat"><div class="val">${pctVal}%</div><div class="lbl">Collection</div></div>
      </div>

      ${student.fee_due_date ? `<p style="font-size:12px;color:#666">📅 Due Date: <strong>${format(new Date(student.fee_due_date), "dd MMM yyyy")}</strong>${due > 0 && new Date(student.fee_due_date) < new Date() ? ' <span style="color:#dc2626;font-weight:bold">— OVERDUE</span>' : ''}</p>` : ''}
      ${student.fee_remarks ? `<p style="font-size:12px;color:#666;font-style:italic">Remarks: ${student.fee_remarks}</p>` : ''}

      <div class="section">
        <h2>Payment History (${payments.length} transactions)</h2>
        ${payments.length === 0 ? '<p style="text-align:center;color:#999;padding:20px">No payments recorded yet.</p>' : `
        <table>
          <thead><tr>
            <th>Receipt</th><th>Date</th><th>Semester</th><th>Method</th><th style="text-align:right">Amount</th><th>Remarks</th>
          </tr></thead>
          <tbody>${paymentRows}</tbody>
          <tfoot><tr>
            <td colspan="4" style="padding:10px 8px;font-weight:bold;font-size:13px;border-top:2px solid #333">Total Payments</td>
            <td style="padding:10px 8px;text-align:right;font-weight:bold;font-size:14px;border-top:2px solid #333;color:#16a34a">₹${payments.reduce((s: number, p: any) => s + Number(p.amount), 0).toLocaleString()}</td>
            <td style="border-top:2px solid #333"></td>
          </tr></tfoot>
        </table>`}
      </div>

      <div class="footer">
        <p>This is a computer-generated report from Hoysala Degree College Fee Management System.</p>
        <p>Report ID: RPT-${Date.now().toString().slice(-8)}</p>
      </div>
      <div style="text-align:center;margin-top:16px" class="no-print">
        <button onclick="window.print()" style="padding:10px 32px;cursor:pointer;border:1px solid #ccc;border-radius:10px;background:#f5f5f5;font-size:14px">🖨️ Print Report</button>
      </div>
      </body></html>
    `);
    w.document.close();
  };

  // Export CSV for this student
  const exportStudentCSV = () => {
    if (!student || payments.length === 0) { toast.info("No payments to export"); return; }
    const header = "Receipt,Date,Semester,Method,Amount,Remarks";
    const rows = payments.map((p: any) =>
      [p.receipt_number || "", format(new Date(p.created_at), "dd MMM yyyy"), p.semester || "", p.payment_method || "Cash", p.amount, p.remarks || ""].map(v => `"${v}"`).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fee_report_${student.roll_number}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  if (studentLoading || paymentsLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <Skeleton className="h-20 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Student not found.</p>
        <Link to="/dashboard/admin/fees" className="text-primary underline text-sm mt-2 inline-block">← Back to Fee Management</Link>
      </div>
    );
  }

  const totalFee = student.total_fee || 0;
  const feePaid = student.fee_paid || 0;
  const totalDue = Math.max(0, totalFee - feePaid);
  const pct = totalFee > 0 ? Math.round((feePaid / totalFee) * 100) : 0;
  const currentSemester = student.semester || 1;
  const isOverdue = totalDue > 0 && student.fee_due_date && new Date(student.fee_due_date) < new Date();
  const perSemFee = totalFee > 0 ? Math.round(totalFee / 6) : 0;

  const semPayments: Record<number, number> = {};
  payments.forEach((p: any) => {
    const sem = p.semester || 0;
    semPayments[sem] = (semPayments[sem] || 0) + Number(p.amount);
  });

  const semChartData = [1, 2, 3, 4, 5, 6].map(s => ({
    name: `Sem ${s}`,
    paid: semPayments[s] || 0,
    due: Math.max(0, perSemFee - (semPayments[s] || 0)),
  }));

  const methodBreakdown: Record<string, number> = {};
  payments.forEach((p: any) => {
    const m = p.payment_method || "Cash";
    methodBreakdown[m] = (methodBreakdown[m] || 0) + Number(p.amount);
  });
  const methodChartData = Object.entries(methodBreakdown).map(([name, value]) => ({ name, value }));

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6">
        <div className="relative flex items-start gap-4 flex-wrap">
          <Link to="/dashboard/admin/fees" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0 mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-secondary/15 border border-secondary/25 rounded-full px-3 py-1 mb-2">
              <User className="w-3 h-3 text-secondary-foreground" />
              <span className="font-body text-[11px] text-secondary-foreground font-semibold uppercase tracking-wider">Student Fee Report</span>
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">{student.profile?.full_name || "—"}</h2>
            <p className="font-body text-sm text-muted-foreground mt-0.5">{student.roll_number} · {student.courses?.name || "—"} · Semester {currentSemester}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${isOverdue ? "bg-destructive/10 text-destructive" : totalDue > 0 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
            {isOverdue ? "⚠ Overdue" : totalDue > 0 ? "Pending" : "✓ Cleared"}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="relative flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
          <Button size="sm" onClick={() => { setShowPayModal(true); setPayForm(f => ({ ...f, semester: String(currentSemester) })); }} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> Record Payment
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setShowEditModal(true); setEditForm({ total_fee: String(student.total_fee || ""), fee_due_date: student.fee_due_date || "", fee_remarks: student.fee_remarks || "" }); }} className="gap-1.5 text-xs">
            <FileText className="w-3.5 h-3.5" /> Edit Fee Details
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setShowReminderModal(true); const due = totalDue; setReminderMsg(`Dear ${student.profile?.full_name}, you have a pending fee of ₹${due.toLocaleString()}. Please clear your dues at the earliest. - Hoysala Degree College`); }} className="gap-1.5 text-xs">
            <Bell className="w-3.5 h-3.5" /> Send Reminder
          </Button>
          <Button size="sm" variant="outline" onClick={printReport} className="gap-1.5 text-xs">
            <Printer className="w-3.5 h-3.5" /> Print Report
          </Button>
          <Button size="sm" variant="outline" onClick={exportStudentCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Student Personal Info */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Mail, label: "Email", value: student.profile?.email },
            { icon: Phone, label: "Phone", value: student.profile?.phone || student.phone },
            { icon: Phone, label: "Parent Phone", value: student.parent_phone },
            { icon: User, label: "Father", value: student.father_name },
            { icon: User, label: "Mother", value: student.mother_name },
            { icon: MapPin, label: "Address", value: student.address },
            { icon: Calendar, label: "Date of Birth", value: student.date_of_birth ? format(new Date(student.date_of_birth), "dd MMM yyyy") : null },
            { icon: BookOpen, label: "Admission Year", value: student.admission_year },
            { icon: Layers, label: "Year Level", value: student.year_level ? `Year ${student.year_level}` : null },
          ].map(({ icon: Icon, label, value }) => value ? (
            <div key={label} className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="font-body text-sm font-medium text-foreground">{value}</p>
              </div>
            </div>
          ) : null)}
        </div>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Fee", value: `₹${totalFee.toLocaleString()}`, icon: IndianRupee, color: "text-foreground", bg: "bg-primary/10" },
          { label: "Total Paid", value: `₹${feePaid.toLocaleString()}`, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Total Due", value: `₹${totalDue.toLocaleString()}`, icon: AlertCircle, color: totalDue > 0 ? "text-destructive" : "text-emerald-600", bg: totalDue > 0 ? "bg-destructive/10" : "bg-emerald-500/10" },
          { label: "Collection %", value: `${pct}%`, icon: TrendingUp, color: pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-destructive", bg: "bg-secondary/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-2`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`font-display text-lg font-bold ${color}`}>{value}</p>
            <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" /> Payment Progress
        </h3>
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{
            width: `${pct}%`,
            background: pct === 100 ? "hsl(142 70% 40%)" : pct > 50 ? "hsl(42 87% 55%)" : "hsl(0 84% 60%)"
          }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-body text-xs text-muted-foreground">₹{feePaid.toLocaleString()} paid</span>
          <span className="font-body text-xs font-bold text-foreground">{pct}%</span>
          <span className="font-body text-xs text-muted-foreground">₹{totalFee.toLocaleString()} total</span>
        </div>
        {student.fee_due_date && (
          <div className={`mt-3 flex items-center gap-2 text-xs font-body ${isOverdue ? "text-destructive font-bold" : "text-muted-foreground"}`}>
            <Calendar className="w-3 h-3" />
            Due Date: {format(new Date(student.fee_due_date), "dd MMM yyyy")}
            {isOverdue && " — OVERDUE"}
          </div>
        )}
        {student.fee_remarks && (
          <p className="font-body text-xs text-muted-foreground mt-2 italic">Remarks: {student.fee_remarks}</p>
        )}
      </div>

      {/* Semester-wise Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> Semester-wise Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {[1, 2, 3, 4, 5, 6].map(s => {
            const paid = semPayments[s] || 0;
            const due = Math.max(0, perSemFee - paid);
            const semPct = perSemFee > 0 ? Math.round((paid / perSemFee) * 100) : 0;
            const isCurrent = s === currentSemester;
            return (
              <div key={s} className={`rounded-xl border p-3 ${isCurrent ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-xs font-bold text-foreground">Sem {s}</span>
                  {isCurrent && <span className="text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">Current</span>}
                </div>
                <p className="font-body text-xs text-emerald-600 font-semibold">₹{paid.toLocaleString()} <span className="text-muted-foreground font-normal">paid</span></p>
                <p className="font-body text-xs text-destructive font-semibold">₹{due.toLocaleString()} <span className="text-muted-foreground font-normal">due</span></p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full" style={{
                    width: `${semPct}%`,
                    background: semPct === 100 ? "hsl(142 70% 40%)" : semPct > 50 ? "hsl(42 87% 55%)" : "hsl(0 84% 60%)"
                  }} />
                </div>
                <p className="font-body text-[10px] text-muted-foreground text-right mt-0.5">{semPct}%</p>
              </div>
            );
          })}
        </div>
        {semChartData.some(d => d.paid > 0 || d.due > 0) && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Bar dataKey="paid" fill="hsl(142, 70%, 40%)" radius={[4, 4, 0, 0]} name="Paid" />
                <Bar dataKey="due" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Due" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Payment Method Breakdown */}
      {methodChartData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-display text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Payment Method Breakdown
          </h3>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={methodChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {methodChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {methodChartData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="font-body text-xs text-foreground">{d.name}</span>
                  <span className="font-body text-xs text-muted-foreground">₹{d.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" /> Complete Payment History
          </h3>
          <p className="font-body text-xs text-muted-foreground mt-0.5">{payments.length} transaction(s) recorded</p>
        </div>
        {payments.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="font-body text-sm text-muted-foreground">No payments recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Receipt</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Date</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Semester</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Method</th>
                  <th className="text-right font-body text-xs font-semibold text-muted-foreground p-4">Amount</th>
                  <th className="text-left font-body text-xs font-semibold text-muted-foreground p-4">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4"><span className="font-body text-xs font-mono font-semibold text-primary">{p.receipt_number || "—"}</span></td>
                    <td className="p-4">
                      <p className="font-body text-sm text-foreground">{format(new Date(p.created_at), "dd MMM yyyy")}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{format(new Date(p.created_at), "hh:mm a")}</p>
                    </td>
                    <td className="p-4"><span className="font-body text-xs bg-muted px-2 py-1 rounded-lg">{p.semester ? `Sem ${p.semester}` : "—"}</span></td>
                    <td className="p-4"><span className="font-body text-xs text-foreground">{p.payment_method || "Cash"}</span></td>
                    <td className="p-4 text-right"><span className="font-body text-sm font-bold text-emerald-600">₹{Number(p.amount).toLocaleString()}</span></td>
                    <td className="p-4"><span className="font-body text-xs text-muted-foreground">{p.remarks || "—"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}

      {/* Record Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Record Payment</h3>
                <p className="font-body text-xs text-primary font-semibold">{student.profile?.full_name} · {student.roll_number}</p>
              </div>
              <button onClick={() => setShowPayModal(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: `₹${totalFee.toLocaleString()}`, color: "text-foreground" },
                  { label: "Paid", value: `₹${feePaid.toLocaleString()}`, color: "text-emerald-600" },
                  { label: "Due", value: `₹${totalDue.toLocaleString()}`, color: "text-destructive" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-muted/30 rounded-xl p-3 text-center">
                    <p className={`font-display text-base font-bold ${color}`}>{value}</p>
                    <p className="font-body text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Amount *</label>
                <input value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} placeholder="Enter amount" type="number" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Payment Method</label>
                  <select value={payForm.payment_method} onChange={e => setPayForm(f => ({ ...f, payment_method: e.target.value }))} className={inputClass}>
                    {["Cash", "Online", "Cheque", "UPI", "DD"].map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Semester</label>
                  <select value={payForm.semester} onChange={e => setPayForm(f => ({ ...f, semester: e.target.value }))} className={inputClass}>
                    <option value="">Current</option>
                    {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
              </div>
              {(payForm.payment_method === "Online" || payForm.payment_method === "UPI") && (
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Transaction / UPI Number</label>
                  <input value={payForm.upi_number} onChange={e => setPayForm(f => ({ ...f, upi_number: e.target.value }))} placeholder="Enter transaction number" className={inputClass} />
                </div>
              )}
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Remarks</label>
                <input value={payForm.remarks} onChange={e => setPayForm(f => ({ ...f, remarks: e.target.value }))} placeholder="Optional remarks" className={inputClass} />
              </div>
              <Button onClick={() => recordPayment.mutate()} disabled={recordPayment.isPending} className="w-full gap-2">
                <Receipt className="w-4 h-4" /> {recordPayment.isPending ? "Recording..." : "Record Payment"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fee Details Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Edit Fee Details</h3>
                <p className="font-body text-xs text-primary font-semibold">{student.profile?.full_name}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Total Fee (₹)</label>
                <input value={editForm.total_fee} onChange={e => setEditForm(f => ({ ...f, total_fee: e.target.value }))} type="number" className={inputClass} />
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Due Date</label>
                <input value={editForm.fee_due_date} onChange={e => setEditForm(f => ({ ...f, fee_due_date: e.target.value }))} type="date" className={inputClass} />
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Remarks</label>
                <textarea value={editForm.fee_remarks} onChange={e => setEditForm(f => ({ ...f, fee_remarks: e.target.value }))} rows={3} placeholder="Fee remarks..." className={inputClass} />
              </div>
              <Button onClick={() => updateFee.mutate()} disabled={updateFee.isPending} className="w-full gap-2">
                <FileText className="w-4 h-4" /> {updateFee.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">Send Fee Reminder</h3>
                <p className="font-body text-xs text-primary font-semibold">To: {student.profile?.full_name}</p>
              </div>
              <button onClick={() => setShowReminderModal(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-muted/30 rounded-xl p-3">
                <p className="font-body text-xs text-muted-foreground">This will send an in-app notification to the student about their pending fee dues.</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-center">
                    <p className="font-display text-base font-bold text-destructive">₹{totalDue.toLocaleString()}</p>
                    <p className="font-body text-[10px] text-muted-foreground">Pending Due</p>
                  </div>
                  {student.fee_due_date && (
                    <div className="text-center">
                      <p className={`font-display text-base font-bold ${isOverdue ? "text-destructive" : "text-foreground"}`}>{format(new Date(student.fee_due_date), "dd MMM")}</p>
                      <p className="font-body text-[10px] text-muted-foreground">Due Date</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground mb-1 block">Reminder Message</label>
                <textarea value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} rows={4} className={inputClass} />
              </div>
              <Button onClick={() => sendReminder.mutate()} disabled={sendReminder.isPending} className="w-full gap-2">
                <Send className="w-4 h-4" /> {sendReminder.isPending ? "Sending..." : "Send Reminder"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
