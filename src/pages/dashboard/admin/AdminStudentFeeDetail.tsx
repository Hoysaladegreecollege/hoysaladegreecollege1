import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, IndianRupee, Calendar, User, BookOpen, Receipt, Phone, Mail, MapPin, Clock, CheckCircle, AlertCircle, Layers, CreditCard, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["hsl(142, 70%, 40%)", "hsl(0, 84%, 60%)", "hsl(42, 87%, 55%)", "hsl(217, 72%, 18%)", "hsl(280, 60%, 55%)"];

export default function AdminStudentFeeDetail() {
  const { studentId } = useParams<{ studentId: string }>();

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

  // Semester-wise payment breakdown
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

  // Payment method breakdown
  const methodBreakdown: Record<string, number> = {};
  payments.forEach((p: any) => {
    const m = p.payment_method || "Cash";
    methodBreakdown[m] = (methodBreakdown[m] || 0) + Number(p.amount);
  });
  const methodChartData = Object.entries(methodBreakdown).map(([name, value]) => ({ name, value }));

  // Monthly payment timeline
  const monthlyPayments: Record<string, number> = {};
  payments.forEach((p: any) => {
    const m = format(new Date(p.created_at), "MMM yyyy");
    monthlyPayments[m] = (monthlyPayments[m] || 0) + Number(p.amount);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-card to-secondary/10 border border-border rounded-2xl p-6">
        <div className="relative flex items-start gap-4">
          <Link to="/dashboard/admin/fees" className="p-2 rounded-xl hover:bg-muted transition-colors shrink-0 mt-1">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
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

      {/* Charts Row */}
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
                    <td className="p-4">
                      <span className="font-body text-xs font-mono font-semibold text-primary">{p.receipt_number || "—"}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-body text-sm text-foreground">{format(new Date(p.created_at), "dd MMM yyyy")}</p>
                      <p className="font-body text-[10px] text-muted-foreground">{format(new Date(p.created_at), "hh:mm a")}</p>
                    </td>
                    <td className="p-4">
                      <span className="font-body text-xs bg-muted px-2 py-1 rounded-lg">{p.semester ? `Sem ${p.semester}` : "—"}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-body text-xs text-foreground">{p.payment_method || "Cash"}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-body text-sm font-bold text-emerald-600">₹{Number(p.amount).toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-body text-xs text-muted-foreground">{p.remarks || "—"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
