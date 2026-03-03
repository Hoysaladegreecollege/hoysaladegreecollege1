import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Search, Download, ArrowLeft, Sparkles, PartyPopper, GraduationCap, Shield } from "lucide-react";
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

  const { data: application, isLoading } = useQuery({
    queryKey: ["track-application", appNumber, email],
    queryFn: async () => {
      const { data } = await supabase
        .rpc("get_application_status", {
          _app_number: appNumber,
          _email: email,
        });
      return data?.[0] || null;
    },
    enabled: searched && !!appNumber && !!email,
  });

  // Confetti on approved - 1.5 seconds
  useEffect(() => {
    if (application?.status === "approved" && !confettiFired.current) {
      confettiFired.current = true;
      import("canvas-confetti").then((mod) => {
        const fire = mod.default;
        const colors = ["#d4a843", "#16a34a", "#fbbf24", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"];
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

  const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string; label: string; ringColor: string }> = {
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Under Review", ringColor: "ring-amber-500/20" },
    approved: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Approved! 🎉", ringColor: "ring-emerald-500/20" },
    rejected: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Not Approved", ringColor: "ring-red-500/20" },
  };

  const handleDownloadPDF = () => {
    if (!application) return;
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Application - ${application.application_number}</title>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; color: #333; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #0a1628 0%, #1a3a6e 60%, #0a1628 100%); color: white; padding: 36px 32px; border-radius: 20px; text-align: center; margin-bottom: 28px; }
    .header h1 { font-size: 24px; margin-bottom: 4px; font-weight: 800; }
    .header .subtitle { font-size: 13px; opacity: 0.7; margin-top: 6px; }
    .header .app-number { background: rgba(212,168,67,0.2); border: 1px solid rgba(212,168,67,0.4); display: inline-block; padding: 10px 28px; border-radius: 12px; margin-top: 16px; font-size: 22px; font-weight: 900; letter-spacing: 3px; color: #d4a843; }
    .card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .section-title { font-size: 11px; font-weight: 800; color: #0a1628; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 10px; border-bottom: 2px solid #d4a843; margin-bottom: 16px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .field { background: #f8fafc; padding: 12px 14px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .field-label { font-size: 9px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.8px; font-weight: 700; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 600; color: #1a202c; }
    .photo-section { text-align: center; margin-bottom: 20px; }
    .photo-section img { width: 100px; height: 100px; border-radius: 16px; object-fit: cover; border: 3px solid #e2e8f0; }
    .status-badge { display: inline-block; padding: 10px 28px; border-radius: 50px; font-weight: 800; font-size: 15px; }
    .status-pending { background: #fef3c7; color: #92400e; border: 2px solid #fcd34d; }
    .status-approved { background: #dcfce7; color: #166534; border: 2px solid #86efac; }
    .status-rejected { background: #fee2e2; color: #991b1b; border: 2px solid #fca5a5; }
    .footer { text-align: center; margin-top: 24px; padding: 16px; background: white; border-radius: 12px; }
    .footer p { font-size: 11px; color: #94a3b8; }
    @media print { body { background: white; } .page { padding: 20px; } }
  </style>
</head>
<body>
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
      </div>
    </div>
    <div class="card">
      <div class="section-title">Academic Details</div>
      <div class="grid">
        <div class="field"><div class="field-label">Previous PU College</div><div class="field-value">${application.previous_school || "—"}</div></div>
        <div class="field"><div class="field-label">12th Percentage</div><div class="field-value">${application.percentage_12th ? application.percentage_12th + "%" : "—"}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Parent / Guardian Details</div>
      <div class="grid">
        <div class="field"><div class="field-label">Father's Name</div><div class="field-value">${application.father_name || "—"}</div></div>
        <div class="field"><div class="field-label">Mother's Name</div><div class="field-value">${application.mother_name || "—"}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Residential Address</div>
      <div class="field"><div class="field-value">${application.address || "—"}</div></div>
    </div>
    <div class="card" style="text-align:center;padding:24px;">
      <div class="section-title" style="border:none;text-align:center;margin-bottom:14px;">Application Status</div>
      <span class="status-badge status-${application.status || "pending"}">${(application.status || "PENDING").toUpperCase()}</span>
      <p style="font-size:12px;color:#94a3b8;margin-top:12px;">Applied on: ${new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
    </div>
    <div class="footer">
      <p>📞 7676272167 | 📧 principal.hoysaladegreecollege@gmail.com</p>
      <p style="margin-top:4px;">This is a system-generated document. Please retain this for future reference.</p>
    </div>
  </div>
  <script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");
    if (!newWindow) {
      // Fallback: direct download
      const a = document.createElement("a");
      a.href = url;
      a.download = `Application-${application.application_number || "HDC"}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const sc = statusConfig[application?.status || "pending"];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Track Application Status" description="Track your admission application status at Hoysala Degree College. Enter your application number and email to check." canonical="/application-status" />
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 sm:py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-navy-dark" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsla(42,87%,55%,0.4), transparent 50%), radial-gradient(circle at 70% 20%, hsla(42,87%,55%,0.3), transparent 40%)" }} />
        {/* Animated orbs */}
        <div className="absolute top-8 left-8 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-secondary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 container px-4">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <GraduationCap className="w-9 h-9 text-secondary" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-3">Track Application</h1>
          <p className="font-body text-sm sm:text-base text-white/60 max-w-md mx-auto">Enter your application number and registered email to check your admission status</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container max-w-2xl px-4">

          {/* Just-Submitted Thank You Banner */}
          {justSubmitted && application && (
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-navy-dark rounded-3xl p-8 mb-8 text-center shadow-2xl border border-primary/20">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsla(42,87%,55%,0.5), transparent 70%)" }} />
              <div className="relative">
                <PartyPopper className="w-12 h-12 text-secondary mx-auto mb-4 animate-bounce" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Application Submitted!</h2>
                <p className="font-body text-sm text-white/70 mb-6">Your application to Hoysala Degree College has been received and is under review.</p>
                <div className="inline-block bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-8 py-4">
                  <p className="font-body text-xs text-white/50 mb-1 uppercase tracking-widest">Application Number</p>
                  <p className="font-display text-3xl font-bold text-secondary tracking-wider">{application.application_number}</p>
                </div>
                <p className="font-body text-xs text-white/40 mt-4">📧 Save this number to track your application anytime</p>
              </div>
            </div>
          )}

          {/* Search Form */}
          {!justSubmitted && (
            <div className={`relative bg-card border border-border rounded-3xl overflow-hidden shadow-xl mb-8 transition-all duration-500 ${submitted && !searched ? "ring-2 ring-primary/20" : ""}`}>
              {/* Top accent bar */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary" />
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="w-18 h-18 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Search className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                      <Sparkles className="w-2.5 h-2.5 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Track Your Application</h3>
                  <p className="font-body text-sm text-muted-foreground mt-2">Enter the details below to check your current status</p>
                </div>

                <form onSubmit={handleSearch} className="space-y-5">
                  <div className="group">
                    <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-primary" /> Application Number *
                    </label>
                    <input
                      value={appNumber}
                      onChange={(e) => setAppNumber(e.target.value)}
                      required
                      placeholder="e.g. HDC-0001"
                      className="w-full border-2 border-border rounded-2xl px-4 py-4 font-body text-sm bg-background focus:outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/8 transition-all duration-300 placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="group">
                    <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-primary" /> Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Your registered email"
                      className="w-full border-2 border-border rounded-2xl px-4 py-4 font-body text-sm bg-background focus:outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/8 transition-all duration-300 placeholder:text-muted-foreground/40"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl font-body font-bold py-6 text-base relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <div className="relative w-5 h-5">
                          <div className="absolute inset-0 border-2 border-white/20 rounded-full" />
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 relative z-10">
                        <Search className="w-5 h-5" /> Check Application Status
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-border" />
                    <p className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-widest">Secure & Private</p>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <Link to="/admissions" className="block text-center font-body text-xs text-primary hover:text-primary/80 transition-colors">
                    ← Back to Admissions
                  </Link>
                </form>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {searched && isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-28 rounded-3xl" />
              <Skeleton className="h-48 rounded-3xl" />
              <Skeleton className="h-20 rounded-3xl" />
            </div>
          )}

          {/* Not Found */}
          {searched && !isLoading && !application && (
            <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-lg">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-destructive/60" />
              </div>
              <p className="font-display text-xl font-bold text-foreground">Application Not Found</p>
              <p className="font-body text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Please double-check your application number and email address.</p>
              <button
                onClick={() => { setSearched(false); setSubmitted(false); }}
                className="mt-6 font-body text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Try Again
              </button>
            </div>
          )}

          {/* Result Card */}
          {application && !isLoading && (
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
              {/* Status Header */}
              <div className={`p-8 text-center ${sc.bg} border-b border-border/50`}>
                {application.status === "approved" && (
                  <div className="mb-3"><PartyPopper className="w-10 h-10 text-secondary mx-auto animate-bounce" /></div>
                )}
                <div className={`w-20 h-20 rounded-2xl ${sc.bg} border-2 ${sc.border} flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ${sc.ringColor}`}>
                  <sc.icon className={`w-10 h-10 ${sc.color}`} />
                </div>
                <p className={`font-display text-2xl font-bold ${sc.color}`}>{sc.label}</p>
                <p className="font-body text-sm text-muted-foreground mt-2 font-bold tracking-wider">Application #{application.application_number}</p>
              </div>

              {/* Photo */}
              {application.photo_url && (
                <div className="flex justify-center py-6 bg-card border-b border-border/50">
                  <div className="relative">
                    <img src={application.photo_url} alt={application.full_name} className="w-28 h-28 rounded-2xl object-cover border-4 border-border shadow-xl" />
                    {application.status === "approved" && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="bg-card p-6 space-y-1">
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
                  <div key={String(label)} className="flex gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <span className="font-body text-[10px] font-bold text-muted-foreground w-28 shrink-0 uppercase tracking-wider pt-0.5">{label}</span>
                    <span className="font-body text-sm text-foreground font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="bg-card border-t border-border/50 p-5 flex flex-wrap gap-3">
                <Button
                  onClick={handleDownloadPDF}
                  className="flex-1 rounded-xl font-body gap-2 bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
                {!justSubmitted && (
                  <Button
                    variant="outline"
                    onClick={() => { setSearched(false); setSubmitted(false); confettiFired.current = false; }}
                    className="rounded-xl font-body"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Search Again
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
