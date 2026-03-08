import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { X, CheckCircle, AlertTriangle, TrendingUp, Clock } from "lucide-react";

export default function AttendanceSummaryPopup() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ["attendance-summary-popup", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: student } = await supabase.from("students").select("id, courses(name)").eq("user_id", user.id).single();
      if (!student) return null;
      const { data: attendance } = await supabase.from("attendance").select("status").eq("student_id", student.id);
      const total = attendance?.length || 0;
      const present = attendance?.filter(a => a.status === "present").length || 0;
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;
      return { pct, present, absent: total - present, total, course: (student as any).courses?.name || "" };
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!data || dismissed) return;
    const key = `hdc_att_popup_${new Date().toISOString().split("T")[0]}`;
    if (sessionStorage.getItem(key)) return;
    const timer = setTimeout(() => { setVisible(true); sessionStorage.setItem(key, "1"); }, 1500);
    return () => clearTimeout(timer);
  }, [data, dismissed]);

  if (!visible || !data || data.total === 0) return null;

  const isLow = data.pct < 75;
  const isCritical = data.pct < 60;

  return (
    <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => { setVisible(false); setDismissed(true); }}>
      <div className={`bg-card rounded-2xl border-2 w-full max-w-sm shadow-2xl overflow-hidden animate-scale-in ${
        isCritical ? "border-red-500/30" : isLow ? "border-amber-500/30" : "border-emerald-500/30"
      }`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-5 pb-4 ${isCritical ? "bg-red-500/5" : isLow ? "bg-amber-500/5" : "bg-emerald-500/5"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isCritical ? <AlertTriangle className="w-5 h-5 text-red-500" /> : isLow ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
              <h3 className="font-body text-base font-bold text-foreground">
                {isCritical ? "⚠️ Critical Attendance!" : isLow ? "⚡ Attendance Warning" : "✅ Attendance Summary"}
              </h3>
            </div>
            <button onClick={() => { setVisible(false); setDismissed(true); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {data.course && <p className="font-body text-[11px] text-muted-foreground mt-1">{data.course}</p>}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Big percentage */}
          <div className="text-center">
            <p className={`font-body text-5xl font-bold tabular-nums ${isCritical ? "text-red-500" : isLow ? "text-amber-500" : "text-emerald-500"}`}>
              {data.pct}%
            </p>
            <p className="font-body text-xs text-muted-foreground mt-1">Overall Attendance</p>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-body text-[10px] text-muted-foreground">Progress</span>
              <span className="font-body text-[10px] font-bold text-muted-foreground">75% required</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden relative">
              <div className={`h-full rounded-full transition-all duration-1000 ${isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-emerald-500"}`}
                style={{ width: `${data.pct}%` }} />
              <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-foreground/20" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-emerald-500/5 rounded-xl p-2.5 text-center">
              <p className="font-body text-lg font-bold text-emerald-500 tabular-nums">{data.present}</p>
              <p className="font-body text-[9px] text-muted-foreground">Present</p>
            </div>
            <div className="bg-red-500/5 rounded-xl p-2.5 text-center">
              <p className="font-body text-lg font-bold text-red-500 tabular-nums">{data.absent}</p>
              <p className="font-body text-[9px] text-muted-foreground">Absent</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-2.5 text-center">
              <p className="font-body text-lg font-bold text-foreground tabular-nums">{data.total}</p>
              <p className="font-body text-[9px] text-muted-foreground">Total</p>
            </div>
          </div>

          {/* Warning message */}
          {isLow && (
            <div className={`p-3 rounded-xl border ${isCritical ? "bg-red-500/5 border-red-500/15" : "bg-amber-500/5 border-amber-500/15"}`}>
              <p className={`font-body text-xs font-semibold ${isCritical ? "text-red-500" : "text-amber-500"}`}>
                {isCritical
                  ? `You need ${75 - data.pct}% more attendance to meet the minimum requirement. Please attend classes regularly!`
                  : `Your attendance is below 75%. Attend classes regularly to avoid shortage.`}
              </p>
            </div>
          )}

          <button onClick={() => { setVisible(false); setDismissed(true); }}
            className={`w-full py-3 rounded-xl font-body text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] ${
              isCritical ? "bg-red-500 hover:bg-red-600" : isLow ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
            }`}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
