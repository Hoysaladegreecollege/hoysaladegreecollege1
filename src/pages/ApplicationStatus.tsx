import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Search, Download, ArrowLeft, Sparkles, PartyPopper, GraduationCap, Shield, Lock, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationStatus() {
  const [searchParams] = useSearchParams();
  const initialApp = searchParams.get("app") || "";
  const initialEmail = searchParams.get("email") || "";
  const justSubmitted = !!initialApp && !!initialEmail;

  const [appNumber, setAppNumber] = useState(initialApp);
  const [email, setEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(justSubmitted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const confettiFired = useRef(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const { data: application, isLoading } = useQuery({
    queryKey: ["track-application", appNumber, email],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_application_status", { _app_number: appNumber, _email: email });
      return data?.[0] || null;
    },
    enabled: searched && !!appNumber && !!email,
  });

  useEffect(() => {
    if (application?.status === "approved" && !confettiFired.current) {
      confettiFired.current = true;
      import("canvas-confetti").then((mod) => {
        const fire = mod.default;
        const colors = ["#C6A75E", "#16a34a", "#fbbf24", "#8b5cf6", "#ec4899"];
        fire({ particleCount: 100, spread: 90, origin: { y: 0.4 }, colors });
        const end = Date.now() + 1500;
        (function frame() {
          fire({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors });
          fire({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      });
    }
  }, [application?.status]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    confettiFired.current = false;
    setSubmitted(true);
    await new Promise(r => setTimeout(r, 800));
    setSearched(true);
    setIsSubmitting(false);
  };

  const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string; label: string; glow: string }> = {
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Under Review", glow: "shadow-[0_0_40px_rgba(245,158,11,0.15)]" },
    approved: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Approved! 🎉", glow: "shadow-[0_0_40px_rgba(16,185,129,0.15)]" },
    rejected: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Not Approved", glow: "shadow-[0_0_40px_rgba(239,68,68,0.15)]" },
  };

  const handleDownloadPDF = () => {
    if (!application) return;
    const htmlContent = `<!DOCTYPE html>
<html><head><title>Application - ${application.application_number}</title><meta charset="utf-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial, sans-serif; background: #0E1016; color: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
.header { background: linear-gradient(135deg, #141824 0%, #1A1F2B 60%, #141824 100%); color: white; padding: 36px 32px; border-radius: 20px; text-align: center; margin-bottom: 28px; border: 1px solid rgba(198,167,94,0.2); }
.header h1 { font-size: 24px; margin-bottom: 4px; font-weight: 800; color: #C6A75E; }
.header .subtitle { font-size: 13px; opacity: 0.5; margin-top: 6px; }
.header .app-number { background: rgba(198,167,94,0.1); border: 1px solid rgba(198,167,94,0.3); display: inline-block; padding: 10px 28px; border-radius: 16px; margin-top: 16px; font-size: 22px; font-weight: 900; letter-spacing: 3px; color: #C6A75E; }
.card { background: #141824; border-radius: 16px; padding: 24px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.06); }
.section-title { font-size: 11px; font-weight: 800; color: #C6A75E; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 10px; border-bottom: 1px solid rgba(198,167,94,0.2); margin-bottom: 16px; }
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.field { background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); }
.field-label { font-size: 9px; text-transform: uppercase; color: #64748b; letter-spacing: 0.8px; font-weight: 700; margin-bottom: 4px; }
.field-value { font-size: 14px; font-weight: 600; color: #e2e8f0; }
.photo-section { text-align: center; margin-bottom: 20px; }
.photo-section img { width: 100px; height: 100px; border-radius: 16px; object-fit: cover; border: 3px solid rgba(198,167,94,0.3); }
.status-badge { display: inline-block; padding: 10px 28px; border-radius: 50px; font-weight: 800; font-size: 15px; }
.status-pending { background: rgba(245,158,11,0.1); color: #f59e0b; border: 2px solid rgba(245,158,11,0.3); }
.status-approved { background: rgba(16,185,129,0.1); color: #10b981; border: 2px solid rgba(16,185,129,0.3); }
.status-rejected { background: rgba(239,68,68,0.1); color: #ef4444; border: 2px solid rgba(239,68,68,0.3); }
.footer { text-align: center; margin-top: 24px; padding: 16px; background: #141824; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); }
.footer p { font-size: 11px; color: #64748b; }
@media print { body { background: white; color: #333; } .card { background: white; border-color: #e2e8f0; } .field { background: #f8fafc; border-color: #e2e8f0; } .field-value { color: #1a202c; } .header { background: #0a1628; } .footer { background: #f8fafc; border-color: #e2e8f0; } }
</style></head><body>
<div class="page">
<div class="header">
<div style="font-size:40px;margin-bottom:8px;">🎓</div>
<h1>Hoysala Degree College</h1>
<div class="subtitle">Affiliated to Bangalore University | Recognized by Government of Karnataka</div>
<div class="app-number">${application.application_number || "HDC-XXXX"}</div>
</div>
${application.photo_url ? `<div class="photo-section"><img src="${application.photo_url}" alt="Applicant Photo"/></div>` : ""}
<div class="card">
<div class="section-title">Personal Information</div>
<div class="grid">
<div class="field"><div class="field-label">Full Name</div><div class="field-value">${application.full_name || "—"}</div></div>
<div class="field"><div class="field-label">Course Applied</div><div class="field-value">${application.course || "—"}</div></div>
<div class="field"><div class="field-label">Email Address</div><div class="field-value">${application.email || "—"}</div></div>
<div class="field"><div class="field-label">Phone Number</div><div class="field-value">${application.phone || "—"}</div></div>
<div class="field"><div class="field-label">Date of Birth</div><div class="field-value">${application.date_of_birth || "—"}</div></div>
<div class="field"><div class="field-label">Gender</div><div class="field-value">${application.gender || "—"}</div></div>
</div></div>
<div class="card">
<div class="section-title">Academic Details</div>
<div class="grid">
<div class="field"><div class="field-label">Previous PU College</div><div class="field-value">${application.previous_school || "—"}</div></div>
<div class="field"><div class="field-label">12th Percentage</div><div class="field-value">${application.percentage_12th ? application.percentage_12th + "%" : "—"}</div></div>
</div></div>
<div class="card">
<div class="section-title">Parent / Guardian Details</div>
<div class="grid">
<div class="field"><div class="field-label">Father's Name</div><div class="field-value">${application.father_name || "—"}</div></div>
<div class="field"><div class="field-label">Mother's Name</div><div class="field-value">${application.mother_name || "—"}</div></div>
</div></div>
<div class="card">
<div class="section-title">Residential Address</div>
<div class="field"><div class="field-value">${application.address || "—"}</div></div>
</div>
<div class="card" style="text-align:center;padding:24px;">
<div class="section-title" style="border:none;text-align:center;margin-bottom:14px;">Application Status</div>
<span class="status-badge status-${application.status || "pending"}">${(application.status || "PENDING").toUpperCase()}</span>
<p style="font-size:12px;color:#64748b;margin-top:12px;">Applied on: ${new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
</div>
<div class="footer">
<p>📞 7676272167 | 📧 principal.hoysaladegreecollege@gmail.com</p>
<p style="margin-top:4px;">This is a system-generated document. Please retain this for future reference.</p>
</div></div>
<script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});</script>
</body></html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    if (!newWindow) {
      const a = document.createElement("a");
      a.href = url; a.download = `Application-${application.application_number || "HDC"}.html`; a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const sc = statusConfig[application?.status || "pending"];
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, hsl(222 47% 5%) 0%, hsl(222 47% 7%) 50%, hsl(222 47% 5%) 100%)" }}>
      <SEOHead title="Track Application Status" description="Track your admission application status at Hoysala Degree College." canonical="/application-status" />

      {/* Hero Header — Ultra Premium Dark */}
      <section className="relative overflow-hidden py-20 sm:py-28 text-center">
        {/* Deep ambient gradient */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(198,167,94,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(198,167,94,0.05) 0%, transparent 50%)" }} />
        {/* Floating orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, hsl(45 80% 55%), transparent 70%)", animation: "float 20s ease-in-out infinite" }} />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: "radial-gradient(circle, hsl(45 80% 55%), transparent 70%)", animation: "float 16s ease-in-out infinite reverse" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(198,167,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(198,167,94,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to top, hsl(222 47% 5%), transparent)" }} />

        <div className="relative z-10 container px-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl border border-[hsl(45_80%_55%_/_0.2)]"
              style={{ background: "linear-gradient(135deg, rgba(198,167,94,0.15), rgba(198,167,94,0.05))", backdropFilter: "blur(20px)" }}>
              <GraduationCap className="w-10 h-10" style={{ color: "hsl(45, 80%, 55%)" }} />
            </div>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3 tracking-tight">Track Application</h1>
          <p className="font-body text-sm sm:text-base text-muted-foreground/60 max-w-md mx-auto">Enter your application number and registered email to check your admission status</p>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/20" style={{ background: "rgba(198,167,94,0.06)" }}>
              <Lock className="w-3 h-3" style={{ color: "hsl(45, 80%, 55%)" }} />
              <span className="font-body text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">Encrypted & Secure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-10 -mt-8">
        <div className="container max-w-2xl px-4">

          {/* Just-Submitted Banner */}
          {justSubmitted && application && (
            <div ref={cardRef} onMouseMove={handleMouseMove}
              className="relative overflow-hidden rounded-3xl p-8 sm:p-10 mb-8 text-center border border-[hsl(45_80%_55%_/_0.15)]"
              style={{ background: "linear-gradient(135deg, hsl(222 30% 10%), hsl(222 30% 8%))", boxShadow: "0 25px 80px -12px rgba(0,0,0,0.5), 0 0 40px rgba(198,167,94,0.08)" }}>
              <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(198,167,94,0.1), transparent 60%)` }} />
              <div className="relative">
                <PartyPopper className="w-14 h-14 mx-auto mb-4 animate-bounce" style={{ color: "hsl(45, 80%, 55%)" }} />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Application Submitted!</h2>
                <p className="font-body text-sm text-muted-foreground/60 mb-6">Your application has been received and is under review.</p>
                <div className="inline-block rounded-2xl px-8 py-5 border border-[hsl(45_80%_55%_/_0.2)]"
                  style={{ background: "rgba(198,167,94,0.06)", backdropFilter: "blur(10px)" }}>
                  <p className="font-body text-[10px] text-muted-foreground/50 mb-1.5 uppercase tracking-[0.2em]">Application Number</p>
                  <p className="font-display text-3xl font-bold tracking-[0.15em]" style={{ color: "hsl(45, 80%, 55%)" }}>{application.application_number}</p>
                </div>
                <p className="font-body text-xs text-muted-foreground/40 mt-5">📧 Save this number to track your application anytime</p>
              </div>
            </div>
          )}

          {/* Search Form */}
          {!justSubmitted && (
            <div ref={cardRef} onMouseMove={handleMouseMove}
              className={`relative overflow-hidden rounded-3xl border border-border/10 mb-8 transition-all duration-500 ${submitted && !searched ? "ring-1 ring-[hsl(45_80%_55%_/_0.3)]" : ""}`}
              style={{ background: "linear-gradient(135deg, hsl(222 30% 11% / 0.98), hsl(222 30% 8% / 0.99))", boxShadow: "0 25px 80px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)" }}>
              {/* Spotlight */}
              <div className="absolute inset-0 pointer-events-none opacity-30"
                style={{ background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(198,167,94,0.08), transparent 60%)` }} />
              {/* Top accent */}
              <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(45 80% 55% / 0.4), transparent)" }} />

              <div className="p-8 sm:p-10 relative z-10">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/10"
                      style={{ background: "linear-gradient(135deg, rgba(198,167,94,0.1), rgba(198,167,94,0.03))", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
                      <Search className="w-7 h-7" style={{ color: "hsl(45, 80%, 55%)" }} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "hsl(45, 80%, 55%)" }}>
                      <Sparkles className="w-2.5 h-2.5 text-background" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Track Your Application</h3>
                  <p className="font-body text-sm text-muted-foreground/50 mt-2">Enter the details below to check your current status</p>
                </div>

                <form onSubmit={handleSearch} className="space-y-5">
                  <div>
                    <label className="font-body text-[10px] font-bold text-muted-foreground/60 block mb-2 uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <FileText className="w-3 h-3" style={{ color: "hsl(45, 80%, 55%)" }} /> Application Number
                    </label>
                    <input
                      value={appNumber} onChange={(e) => setAppNumber(e.target.value)} required
                      placeholder="e.g. HDC-0001"
                      onFocus={() => setFocused("app")} onBlur={() => setFocused(null)}
                      className={`w-full border ${focused === "app" ? "border-[hsl(45_80%_55%_/_0.4)] shadow-[0_0_20px_rgba(198,167,94,0.1)]" : "border-border/15"} rounded-2xl px-5 py-4 font-body text-sm bg-transparent text-foreground placeholder:text-muted-foreground/30 focus:outline-none transition-all duration-300`}
                    />
                  </div>
                  <div>
                    <label className="font-body text-[10px] font-bold text-muted-foreground/60 block mb-2 uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <Shield className="w-3 h-3" style={{ color: "hsl(45, 80%, 55%)" }} /> Email Address
                    </label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      placeholder="Your registered email"
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      className={`w-full border ${focused === "email" ? "border-[hsl(45_80%_55%_/_0.4)] shadow-[0_0_20px_rgba(198,167,94,0.1)]" : "border-border/15"} rounded-2xl px-5 py-4 font-body text-sm bg-transparent text-foreground placeholder:text-muted-foreground/30 focus:outline-none transition-all duration-300`}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}
                    className="w-full rounded-2xl font-body font-bold py-6 text-base relative overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group border-0"
                    style={{ background: "linear-gradient(135deg, hsl(45 80% 45%), hsl(45 80% 55%), hsl(40 85% 50%))" }}>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    {isSubmitting ? (
                      <span className="flex items-center gap-3 relative z-10 text-background">
                        <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative z-10 text-background">
                        <Search className="w-5 h-5" /> Check Application Status
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-border/10" />
                    <p className="font-body text-[9px] text-muted-foreground/30 uppercase tracking-[0.2em]">Secure & Private</p>
                    <div className="flex-1 h-px bg-border/10" />
                  </div>

                  <Link to="/admissions" className="block text-center font-body text-xs hover:opacity-80 transition-opacity" style={{ color: "hsl(45, 80%, 55%)" }}>
                    ← Back to Admissions
                  </Link>
                </form>
              </div>
            </div>
          )}

          {/* Loading */}
          {searched && isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-28 rounded-3xl bg-border/5" />
              <Skeleton className="h-48 rounded-3xl bg-border/5" />
              <Skeleton className="h-20 rounded-3xl bg-border/5" />
            </div>
          )}

          {/* Not Found */}
          {searched && !isLoading && !application && (
            <div className="rounded-3xl p-12 text-center border border-border/10"
              style={{ background: "linear-gradient(135deg, hsl(222 30% 11%), hsl(222 30% 8%))", boxShadow: "0 25px 60px -12px rgba(0,0,0,0.4)" }}>
              <div className="w-20 h-20 rounded-3xl bg-red-500/8 border border-red-500/15 flex items-center justify-center mx-auto mb-5">
                <XCircle className="w-10 h-10 text-red-400/60" />
              </div>
              <p className="font-display text-xl font-bold text-foreground">Application Not Found</p>
              <p className="font-body text-sm text-muted-foreground/50 mt-2 max-w-xs mx-auto">Please double-check your application number and email address.</p>
              <button onClick={() => { setSearched(false); setSubmitted(false); }}
                className="mt-6 font-body text-sm font-semibold flex items-center gap-1 mx-auto transition-opacity hover:opacity-80" style={{ color: "hsl(45, 80%, 55%)" }}>
                <ArrowLeft className="w-3.5 h-3.5" /> Try Again
              </button>
            </div>
          )}

          {/* Result Card */}
          {application && !isLoading && (
            <div className="rounded-3xl overflow-hidden border border-border/10"
              style={{ background: "linear-gradient(135deg, hsl(222 30% 11%), hsl(222 30% 8%))", boxShadow: "0 30px 80px -12px rgba(0,0,0,0.5)" }}>
              {/* Status Header */}
              <div className={`p-8 sm:p-10 text-center relative overflow-hidden ${sc.glow}`}>
                <div className="absolute inset-0 opacity-50" style={{ background: application.status === "approved" ? "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.1), transparent 70%)" : application.status === "rejected" ? "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.08), transparent 70%)" : "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08), transparent 70%)" }} />
                <div className="relative z-10">
                  {application.status === "approved" && (
                    <div className="mb-3"><PartyPopper className="w-10 h-10 mx-auto animate-bounce" style={{ color: "hsl(45, 80%, 55%)" }} /></div>
                  )}
                  <div className={`w-20 h-20 rounded-3xl ${sc.bg} border ${sc.border} flex items-center justify-center mx-auto mb-5`}
                    style={{ boxShadow: application.status === "approved" ? "0 0 40px rgba(16,185,129,0.15)" : "none" }}>
                    <sc.icon className={`w-10 h-10 ${sc.color}`} />
                  </div>
                  <p className={`font-display text-2xl font-bold ${sc.color}`}>{sc.label}</p>
                  <p className="font-body text-sm text-muted-foreground/50 mt-2 font-bold tracking-wider">Application #{application.application_number}</p>
                </div>
              </div>

              {/* Photo */}
              {application.photo_url && (
                <div className="flex justify-center py-6 border-t border-border/5">
                  <div className="relative">
                    <img src={application.photo_url} alt={application.full_name}
                      className="w-28 h-28 rounded-2xl object-cover shadow-2xl"
                      style={{ border: "3px solid rgba(198,167,94,0.2)" }} />
                    {application.status === "approved" && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="p-6 sm:p-8 space-y-1 border-t border-border/5">
                {[
                  ["Full Name", application.full_name],
                  ["Course Applied", application.course],
                  ["Email", application.email],
                  ["Phone", application.phone],
                  ["Father's Name", application.father_name],
                  ["Mother's Name", application.mother_name],
                  ["Date of Birth", application.date_of_birth],
                  ["Gender", application.gender],
                  ["12th Percentage", application.percentage_12th ? application.percentage_12th + "%" : null],
                  ["Previous School", application.previous_school],
                  ["Address", application.address],
                  ["Applied On", new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
                  ...(application.review_notes ? [["Review Notes", application.review_notes]] : []),
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={String(label)} className="flex gap-3 p-3.5 rounded-xl hover:bg-white/[0.02] transition-colors">
                    <span className="font-body text-[10px] font-bold text-muted-foreground/40 w-28 shrink-0 uppercase tracking-wider pt-0.5">{label}</span>
                    <span className="font-body text-sm text-foreground/90 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-border/5 p-5 sm:p-6 flex flex-wrap gap-3">
                <Button onClick={handleDownloadPDF}
                  className="flex-1 rounded-2xl font-body gap-2 shadow-lg border-0 text-background"
                  style={{ background: "linear-gradient(135deg, hsl(45 80% 45%), hsl(45 80% 55%))" }}>
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                {!justSubmitted && (
                  <Button variant="outline" onClick={() => { setSearched(false); setSubmitted(false); confettiFired.current = false; }}
                    className="rounded-2xl font-body border-border/15 bg-transparent text-muted-foreground hover:bg-white/[0.03]">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Search Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
        }
      `}</style>
    </div>
  );
}
