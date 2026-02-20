import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Search, Download, ArrowLeft, Sparkles, PartyPopper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ApplicationStatus() {
  const [searchParams] = useSearchParams();
  const initialApp = searchParams.get("app") || "";
  const initialEmail = searchParams.get("email") || "";
  const justSubmitted = !!initialApp && !!initialEmail;

  const [appNumber, setAppNumber] = useState(initialApp);
  const [email, setEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(justSubmitted);
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

  // Enhanced confetti on approved status
  useEffect(() => {
    if (application?.status === "approved" && !confettiFired.current) {
      confettiFired.current = true;
      import("canvas-confetti").then((mod) => {
        const fire = mod.default;

        // Burst from center
        fire({ particleCount: 120, spread: 100, origin: { y: 0.4 }, colors: ["#d4a843", "#0a1628", "#16a34a", "#fbbf24", "#ef4444", "#3b82f6", "#8b5cf6"] });

        // Sides cannons with staggered timing
        const duration = 3000;
        const end = Date.now() + duration;
        const colors = ["#d4a843", "#16a34a", "#fbbf24", "#3b82f6", "#ef4444", "#8b5cf6", "#ec4899"];

        (function frame() {
          fire({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors, shapes: ["circle", "square"] });
          fire({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors, shapes: ["circle", "square"] });
          fire({ particleCount: 3, angle: 90, spread: 45, origin: { x: 0.5, y: 0 }, colors, ticks: 200 });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();

        // Final grand burst at end
        setTimeout(() => {
          fire({ particleCount: 200, spread: 160, origin: { y: 0.5 }, colors, scalar: 1.2 });
        }, 2500);
      });
    }
  }, [application?.status]);


  const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string; label: string }> = {
    pending: { icon: Clock, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/30", label: "Under Review" },
    approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", border: "border-green-300", label: "✅ Approved" },
    rejected: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-300", label: "❌ Not Approved" },
  };

  const handleDownloadPDF = () => {
    if (!application) return;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Application Form - ${application.application_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4f8; color: #333; }
    .page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #0a1628 0%, #1a3a6e 60%, #0a1628 100%); color: white; padding: 36px 32px; border-radius: 20px; text-align: center; margin-bottom: 28px; position: relative; overflow: hidden; }
    .header::before { content: ''; position: absolute; top: -50%; right: -20%; width: 200px; height: 200px; background: rgba(212,168,67,0.1); border-radius: 50%; }
    .header h1 { font-size: 24px; margin-bottom: 4px; font-weight: 800; letter-spacing: -0.5px; }
    .header .sub { font-size: 12px; opacity: 0.6; margin-top: 4px; }
    .header .app-number { background: rgba(212,168,67,0.2); border: 1px solid rgba(212,168,67,0.4); display: inline-block; padding: 10px 28px; border-radius: 12px; margin-top: 16px; font-size: 22px; font-weight: 900; letter-spacing: 3px; color: #d4a843; }
    .card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .section-title { font-size: 11px; font-weight: 800; color: #0a1628; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 10px; border-bottom: 2px solid #d4a843; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .field { background: #f8fafc; padding: 12px 14px; border-radius: 10px; border: 1px solid #e2e8f0; }
    .field-label { font-size: 9px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.8px; font-weight: 700; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 600; color: #1a202c; }
    .photo-section { text-align: center; margin-bottom: 20px; }
    .photo-section img { width: 100px; height: 100px; border-radius: 16px; object-fit: cover; border: 3px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
    .status-section { text-align: center; padding: 20px; }
    .status-badge { display: inline-block; padding: 10px 28px; border-radius: 50px; font-weight: 800; font-size: 15px; letter-spacing: 1px; }
    .status-pending { background: #fef3c7; color: #92400e; border: 2px solid #fcd34d; }
    .status-approved { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; border: 2px solid #86efac; }
    .status-rejected { background: #fee2e2; color: #991b1b; border: 2px solid #fca5a5; }
    .footer { text-align: center; margin-top: 24px; padding: 16px; background: white; border-radius: 12px; }
    .footer p { font-size: 11px; color: #94a3b8; }
    @media print { body { background: white; } .page { padding: 20px; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div style="font-size:40px; margin-bottom:8px;">🎓</div>
      <h1>Hoysala Degree College</h1>
      <div class="sub">Affiliated to Bangalore University | BU 26</div>
      <div class="sub" style="margin-top:2px;">ಶ್ರೀಶಿರಡಿ ಸಾಯಿ ಎಜುಕೇಷನಲ್ ಟ್ರಸ್ಟ್ (ರಿ.)</div>
      <div class="app-number">${application.application_number}</div>
    </div>

    ${application.photo_url ? `<div class="photo-section"><img src="${application.photo_url}" alt="Applicant Photo" /></div>` : ""}

    <div class="card">
      <div class="section-title">👤 Personal Information</div>
      <div class="grid">
        <div class="field"><div class="field-label">Full Name</div><div class="field-value">${application.full_name}</div></div>
        <div class="field"><div class="field-label">Course Applied</div><div class="field-value">${application.course}</div></div>
        <div class="field"><div class="field-label">Email</div><div class="field-value">${application.email}</div></div>
        <div class="field"><div class="field-label">Phone</div><div class="field-value">${application.phone}</div></div>
        <div class="field"><div class="field-label">Date of Birth</div><div class="field-value">${application.date_of_birth || "N/A"}</div></div>
        <div class="field"><div class="field-label">Gender</div><div class="field-value">${application.gender || "N/A"}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">🎓 Academic Details</div>
      <div class="grid">
        <div class="field"><div class="field-label">Previous PU College</div><div class="field-value">${application.previous_school || "N/A"}</div></div>
        <div class="field"><div class="field-label">12th Percentage</div><div class="field-value">${application.percentage_12th || "N/A"}%</div></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">👨‍👩‍👧 Parent / Guardian Details</div>
      <div class="grid">
        <div class="field"><div class="field-label">Father's Name</div><div class="field-value">${application.father_name || "N/A"}</div></div>
        <div class="field"><div class="field-label">Mother's Name</div><div class="field-value">${application.mother_name || "N/A"}</div></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">🏠 Address</div>
      <div class="field" style="width:100%"><div class="field-value">${application.address || "N/A"}</div></div>
    </div>

    <div class="card">
      <div class="status-section">
        <div class="section-title" style="justify-content:center; border:none; margin-bottom:12px;">📋 Application Status</div>
        <span class="status-badge status-${application.status}">${application.status?.toUpperCase()}</span>
        <p style="font-size:12px; color:#94a3b8; margin-top:10px;">Applied on: ${new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>
    </div>

    <div class="footer">
      <p>📞 7676272167 | 📧 principal.hoysaladegreecollege@gmail.com</p>
      <p style="margin-top:4px;">This is a computer-generated document from Hoysala Degree College admission portal.</p>
    </div>
  </div>
  <script>
    window.onload = function() {
      window.print();
      // After print dialog closes, if user chose to save as PDF, the blob download handles it
    };
  </script>
</body>
</html>`;

    // Use blob + object URL to force download dialog with filename
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.document.title = `Application-${application.application_number}.pdf`;
        printWindow.print();
      };
    }
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };


  const sc = statusConfig[application?.status || "pending"];

  return (
    <div>
      <section className="page-header py-16 sm:py-20 text-center text-primary-foreground relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative z-10 container px-4">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Application Status</h1>
          <p className="font-body text-sm mt-2 opacity-70">Track your admission application</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container max-w-2xl px-4">
          {justSubmitted && application && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/30 rounded-2xl p-6 mb-8 text-center animate-fade-in">
              <PartyPopper className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h2 className="font-display text-xl font-bold text-foreground">Thank You for Applying!</h2>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Your application to Hoysala Degree College has been received successfully.
              </p>
              <div className="mt-4 inline-block bg-card border border-border rounded-xl px-6 py-3">
                <p className="font-body text-xs text-muted-foreground">Your Application Number</p>
                <p className="font-display text-2xl font-bold text-primary">{application.application_number}</p>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4">
                Save this number to track your application status anytime.
              </p>
            </div>
          )}

          {/* Search form */}
          {!justSubmitted && (
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> Track Your Application
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); confettiFired.current = false; setSearched(true); }} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Application Number *</label>
                  <input value={appNumber} onChange={(e) => setAppNumber(e.target.value)} required placeholder="e.g. HDC-0001"
                    className="w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email Address *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Your registered email"
                    className="w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <Button type="submit" className="w-full rounded-xl font-body btn-premium">
                  <Search className="w-4 h-4 mr-2" /> Check Status
                </Button>
              </form>
            </div>
          )}

          {/* Result */}
          {searched && isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />)}
            </div>
          )}

          {searched && !isLoading && !application && (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-display text-lg font-bold text-foreground">Application Not Found</p>
              <p className="font-body text-sm text-muted-foreground mt-2">Please check your application number and email address.</p>
            </div>
          )}

          {application && (
            <div className={`bg-card border-2 rounded-2xl overflow-hidden animate-fade-in ${sc.border}`}>
              {/* Status header - green/red/gold based on status */}
              <div className={`${sc.bg} p-6 text-center border-b ${sc.border}`}>
                {application.status === "approved" && (
                  <div className="mb-2">
                    <PartyPopper className="w-8 h-8 text-green-600 mx-auto animate-bounce" />
                  </div>
                )}
                <sc.icon className={`w-12 h-12 mx-auto mb-2 ${sc.color}`} />
                <p className={`font-display text-xl font-bold ${sc.color}`}>{sc.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Application #{application.application_number}
                </p>
              </div>

              {/* Photo */}
              {application.photo_url && (
                <div className="flex justify-center py-4 border-b border-border">
                  <img src={application.photo_url} alt={application.full_name} className="w-24 h-24 rounded-2xl object-cover border-2 border-border shadow-lg" />
                </div>
              )}

              {/* Details */}
              <div className="p-6 space-y-3">
                {[
                  ["Name", application.full_name],
                  ["Course", application.course],
                  ["Email", application.email],
                  ["Phone", application.phone],
                  ["Applied On", new Date(application.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })],
                ].map(([k, v]) => (
                  <div key={k as string} className="flex justify-between items-center p-3 rounded-xl bg-muted/20">
                    <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{k}</span>
                    <span className="font-body text-sm font-semibold text-foreground">{v || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 rounded-xl font-body">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Link to="/admissions" className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl font-body">
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
