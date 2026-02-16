import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, XCircle, Clock, Search, Download, ArrowLeft, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function ApplicationStatus() {
  const [searchParams] = useSearchParams();
  const initialApp = searchParams.get("app") || "";
  const initialEmail = searchParams.get("email") || "";
  const justSubmitted = !!initialApp && !!initialEmail;

  const [appNumber, setAppNumber] = useState(initialApp);
  const [email, setEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(justSubmitted);

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

  const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    pending: { icon: Clock, color: "text-secondary", bg: "bg-secondary/10", label: "Under Review" },
    approved: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10", label: "Approved ✓" },
    rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Not Approved" },
  };

  const handleDownload = () => {
    if (!application) return;
    const content = `
HOYSALA DEGREE COLLEGE - APPLICATION FORM
==========================================
Application No: ${application.application_number}
Date: ${new Date(application.created_at).toLocaleDateString()}
Status: ${application.status?.toUpperCase()}

PERSONAL DETAILS
-----------------
Name: ${application.full_name}
Email: ${application.email}
Phone: ${application.phone}
DOB: ${application.date_of_birth || "N/A"}
Gender: ${application.gender || "N/A"}

ACADEMIC DETAILS
-----------------
Course Applied: ${application.course}
Previous College: ${application.previous_school || "N/A"}
12th Percentage: ${application.percentage_12th || "N/A"}

PARENT DETAILS
-----------------
Father: ${application.father_name || "N/A"}
Mother: ${application.mother_name || "N/A"}

Address: ${application.address || "N/A"}
==========================================
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${application.application_number}-application.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sc = statusConfig[application?.status || "pending"];

  return (
    <div>
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <div className="container px-4">
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Application Status</h1>
          <p className="font-body text-sm mt-2 opacity-70">Track your admission application</p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-background">
        <div className="container max-w-2xl px-4">
          {justSubmitted && application && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/30 rounded-2xl p-6 mb-8 text-center animate-fade-in">
              <Sparkles className="w-10 h-10 text-secondary mx-auto mb-3" />
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
              <form onSubmit={(e) => { e.preventDefault(); setSearched(true); }} className="space-y-4">
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
                <Button type="submit" className="w-full rounded-xl font-body">
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
            <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
              {/* Status header */}
              <div className={`${sc.bg} p-6 text-center border-b border-border`}>
                <sc.icon className={`w-12 h-12 mx-auto mb-2 ${sc.color}`} />
                <p className={`font-display text-xl font-bold ${sc.color}`}>{sc.label}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  Application #{application.application_number}
                </p>
              </div>

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
                <Button onClick={handleDownload} variant="outline" className="flex-1 rounded-xl font-body">
                  <Download className="w-4 h-4 mr-2" /> Download Application
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
