import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Search, Download, ArrowLeft, Sparkles, PartyPopper, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ApplicationStatus() {
  const [searchParams] = useSearchParams();
  const initialApp = searchParams.get("app") || "";
  const initialEmail = searchParams.get("email") || "";
  const justSubmitted = !!initialApp && !!initialEmail;

  const [appNumber, setAppNumber] = useState(initialApp);
  const [email, setEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(justSubmitted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confettiFired = useRef(false);

  const { data: application, isLoading } = useQuery({
    queryKey: ["track-application", appNumber, email],
    queryFn: async () => {
      const { data } = await supabase
        .from("admission_applications")
        .select("*")
        .eq("application_number", appNumber)
        .eq("email", email)
        .maybeSingle();
      return data;
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
    await new Promise(r => setTimeout(r, 600));
    setSearched(true);
    setIsSubmitting(false);
  };

  const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string; label: string; gradient: string }> = {
    pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Under Review", gradient: "from-amber-50 to-orange-50" },
    approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Approved! 🎉", gradient: "from-green-50 to-emerald-50" },
    rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Not Approved", gradient: "from-red-50 to-rose-50" },
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
    .header .sub { font-size: 12px; opacity: 0.6; margin-top: 4px; }
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
      <div class="sub">Affiliated to Bangalore University | BU 26</div>
      <div class="app-number">${application.application_number || "HDC-XXXX"}</div>
    </div>
    ${application.photo_url ? `<div class="photo-section"><img src="${application.photo_url}" alt="Photo"/></div>` : ""}
    <div class="card">
      <div class="section-title">Personal Information</div>
      <div class="grid">
        <div class="field"><div class="field-label">Full Name</div><div class="field-value">${application.full_name || "N/A"}</div></div>
        <div class="field"><div class="field-label">Course Applied</div><div class="field-value">${application.course || "N/A"}</div></div>
        <div class="field"><div class="field-label">Email</div><div class="field-value">${application.email || "N/A"}</div></div>
        <div class="field"><div class="field-label">Phone</div><div class="field-value">${application.phone || "N/A"}</div></div>
        <div class="field"><div class="field-label">Date of Birth</div><div class="field-value">${application.date_of_birth || "N/A"}</div></div>
        <div class="field"><div class="field-label">Gender</div><div class="field-value">${application.gender || "N/A"}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Academic Details</div>
      <div class="grid">
        <div class="field"><div class="field-label">Previous PU College</div><div class="field-value">${application.previous_school || "N/A"}</div></div>
        <div class="field"><div class="field-label">12th Percentage</div><div class="field-value">${application.percentage_12th ? application.percentage_12th + "%" : "N/A"}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Parent / Guardian Details</div>
      <div class="grid">
        <div class="field"><div class="field-label">Father's Name</div><div class="field-value">${application.father_name || "N/A"}</div></div>
        <div class="field"><div class="field-label">Mother's Name</div><div class="field-value">${application.mother_name || "N/A"}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title">Address</div>
      <div class="field"><div class="field-value">${application.address || "N/A"}</div></div>
    </div>
    <div class="card" style="text-align:center;padding:20px;">
      <div class="section-title" style="border:none;margin-bottom:12px;">Application Status</div>
      <span class="status-badge status-${application.status || "pending"}">${(application.status || "PENDING").toUpperCase()}</span>
      <p style="font-size:12px;color:#94a3b8;margin-top:10px;">Applied on: ${new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
    </div>
    <div class="footer">
      <p>📞 7676272167 | 📧 principal.hoysaladegreecollege@gmail.com</p>
      <p style="margin-top:4px;">This is a computer-generated document from Hoysala Degree College.</p>
    </div>
  </div>
  <script>window.addEventListener('load',function(){setTimeout(function(){window.print();},500);});</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Application-${application.application_number || "HDC"}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const sc = statusConfig[application?.status || "pending"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 sm:py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-navy-dark" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, hsla(42,87%,55%,0.4), transparent 50%), radial-gradient(circle at 70% 20%, hsla(42,87%,55%,0.3), transparent 40%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 container px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center animate-float">
              <GraduationCap className="w-8 h-8 text-secondary" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white mb-3">Application Status</h1>
          <p className="font-body text-sm sm:text-base text-white/60 max-w-md mx-auto">Track your admission application with your application number and email</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container max-w-2xl px-4">

          {/* Just Submitted Thank You Banner */}
          {justSubmitted && application && (
            <div className="relative overflow-hidden bg-gradient-to-br from-primary to-navy-dark rounded-3xl p-8 mb-8 text-center animate-scale-bounce shadow-2xl">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsla(42,87%,55%,0.5), transparent 70%)" }} />
              <div className="relative">
                <PartyPopper className="w-12 h-12 text-secondary mx-auto mb-4 animate-bounce" />
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Application Submitted!</h2>
                <p className="font-body text-sm text-white/70 mb-6">Your application to Hoysala Degree College has been received.</p>
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
            <div className="bg-card border border-border rounded-3xl p-8 mb-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">Track Your Application</h3>
                <p className="font-body text-sm text-muted-foreground mt-2">Enter your application number and email to check status</p>
              </div>
              <form onSubmit={handleSearch} className="space-y-5">
                <div className="group">
                  <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Application Number *</label>
                  <input
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                    required
                    placeholder="e.g. HDC-0001"
                    className="w-full border-2 border-border rounded-2xl px-4 py-3.5 font-body text-sm bg-background focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 group-hover:border-primary/30"
                  />
                </div>
                <div className="group">
                  <label className="font-body text-xs font-bold text-foreground block mb-2 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Your registered email"
                    className="w-full border-2 border-border rounded-2xl px-4 py-3.5 font-body text-sm bg-background focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 group-hover:border-primary/30"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl font-body font-bold py-6 text-base relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 relative z-10">
                      <Search className="w-5 h-5" /> Check Application Status
                    </span>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Loading State */}
          {searched && isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted/50 rounded-2xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          )}

          {/* Not Found */}
          {searched && !isLoading && !application && (
            <div className="bg-card border border-border rounded-3xl p-12 text-center animate-scale-bounce">
              <XCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="font-display text-xl font-bold text-foreground">Application Not Found</p>
              <p className="font-body text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Please double-check your application number and email address.</p>
              <button onClick={() => setSearched(false)} className="mt-6 font-body text-sm text-primary hover:underline">← Try Again</button>
            </div>
          )}

          {/* Result Card */}
          {application && (
            <div className={`rounded-3xl overflow-hidden shadow-2xl animate-scale-bounce`}>
              {/* Status Header */}
              <div className={`bg-gradient-to-br ${sc.gradient} p-8 text-center border-b ${sc.border}`}>
                {application.status === "approved" && (
                  <div className="mb-3"><PartyPopper className="w-10 h-10 text-green-600 mx-auto animate-bounce" /></div>
                )}
                <div className={`w-20 h-20 rounded-full ${sc.bg} ${sc.border} border-2 flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <sc.icon className={`w-10 h-10 ${sc.color}`} />
                </div>
                <p className={`font-display text-2xl font-bold ${sc.color}`}>{sc.label}</p>
                <p className="font-body text-sm text-muted-foreground mt-2 font-bold tracking-wider">Application #{application.application_number}</p>
              </div>

              {/* Photo */}
              {application.photo_url && (
                <div className="flex justify-center py-6 bg-card border-b border-border">
                  <div className="relative">
                    <img src={application.photo_url} alt={application.full_name} className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl" />
                    {application.status === "approved" && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="bg-card p-6 space-y-2">
                {[
                  ["Full Name", application.full_name],
                  ["Course Applied", application.course],
                  ["Email", application.email],
                  ["Phone", application.phone],
                  ["Applied On", new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
                ].map(([k, v], i) => (
                  <div key={k as string} className="flex justify-between items-center p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wider font-semibold">{k}</span>
                    <span className="font-body text-sm font-semibold text-foreground">{v || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Approval message */}
              {application.status === "approved" && (
                <div className="bg-green-50 border-t border-green-100 p-6">
                  <h4 className="font-display text-base font-bold text-green-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Next Steps
                  </h4>
                  <div className="space-y-2">
                    {["Visit campus with original documents", "Complete fee payment at accounts office", "Collect your student ID card"].map((step, i) => (
                      <div key={i} className="flex items-center gap-3 font-body text-sm text-green-700">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-card border-t border-border p-5 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownloadPDF} className="flex-1 rounded-2xl font-body bg-primary text-primary-foreground hover:bg-primary/90 py-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Link to="/admissions" className="flex-1">
                  <Button variant="outline" className="w-full rounded-2xl font-body py-5 border-2 hover:bg-muted/50">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Admissions
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
