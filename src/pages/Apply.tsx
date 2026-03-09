import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Upload, GraduationCap, Phone, Calendar, User, Mail, MapPin, School, Percent, Users, Sparkles, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const applySchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(200, "Name must be under 200 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be under 255 characters"),
  phone: z.string().trim().min(1, "Phone is required").max(20, "Phone must be under 20 characters")
    .regex(/^[0-9+\-() ]{7,20}$/, "Invalid phone number format"),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
  course: z.string().min(1, "Course is required").max(100, "Course must be under 100 characters"),
  father_name: z.string().max(200, "Father's name must be under 200 characters").optional().or(z.literal("")),
  mother_name: z.string().max(200, "Mother's name must be under 200 characters").optional().or(z.literal("")),
  address: z.string().max(1000, "Address must be under 1000 characters").optional().or(z.literal("")),
  previous_school: z.string().max(300, "School name must be under 300 characters").optional().or(z.literal("")),
  percentage_12th: z.string().max(20, "Percentage must be under 20 characters").optional().or(z.literal("")),
});

const initialForm = {
  full_name: "", email: "", phone: "", date_of_birth: "", gender: "",
  course: "", father_name: "", mother_name: "", address: "",
  previous_school: "", percentage_12th: ""
};

export default function Apply() {
  const [form, setForm] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ appNumber: string; email: string } | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = applySchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || "Invalid input";
      toast.error(firstError);
      return;
    }
    const validated = result.data;
    setSubmitting(true);

    let photoUrl: string | null = null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("admission-photos").upload(path, photoFile);
      if (!uploadErr) {
        photoUrl = path;
      }
    }

    const { data, error } = await supabase.from("admission_applications").insert({
      full_name: validated.full_name, email: validated.email, phone: validated.phone,
      date_of_birth: validated.date_of_birth || null, gender: validated.gender || null,
      course: validated.course, father_name: validated.father_name || null,
      mother_name: validated.mother_name || null, address: validated.address || null,
      previous_school: validated.previous_school || null, percentage_12th: validated.percentage_12th || null,
      photo_url: photoUrl
    }).select("application_number, id").single();

    if (error) {
      setSubmitting(false);
      toast.error("Failed to submit application. Please try again.");
      return;
    }

    try {
      await supabase.functions.invoke("send-application-email", {
        body: {
          email: form.email,
          fullName: form.full_name,
          applicationNumber: data.application_number,
          status: "submitted"
        }
      });
    } catch (emailErr) {
      console.warn("Email notification failed (non-critical):", emailErr);
    }

    setSubmitting(false);
    setSubmittedData({ appNumber: data.application_number, email: form.email });
    setShowThankYou(true);
  };

  const trackingUrl = submittedData
    ? `/application-status?app=${submittedData.appNumber}&email=${encodeURIComponent(submittedData.email)}`
    : "";

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}${trackingUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => toast.success("Tracking link copied!"));
  };

  const handleGoToTracking = () => {
    setShowThankYou(false);
    setForm(initialForm);
    setPhotoFile(null);
    navigate(trackingUrl);
  };

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-primary/30";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <div className="page-enter">
      <SEOHead title="Apply Online - Admissions 2026-27" description="Submit your online application for admission to Hoysala Degree College." canonical="/apply" />
      <PageHeader title="Online Application" subtitle="Academic Year 2026–27" />

      {/* Thank You Dialog */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-lg p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20"
            style={{ background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--background)))", boxShadow: "0 30px 80px -12px rgba(0,0,0,0.4), 0 0 60px rgba(198,167,94,0.1)" }}>
            {/* Top accent */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)" }} />
            
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: "hsl(var(--primary))" }} />
            
            <div className="relative z-10 p-8 sm:p-10 text-center">
              {/* Success icon */}
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto border border-primary/20 shadow-2xl"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.05))" }}>
                  <CheckCircle className="w-12 h-12 text-primary animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-primary">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>

              {/* Title */}
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
                Thank You! 🎉
              </h2>
              
              {/* Message */}
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
                Thank you for applying to our college! Please wait for some time — our office management will review your profile and contact you shortly.
              </p>

              {/* Application Number Card */}
              {submittedData && (
                <div className="inline-block rounded-2xl px-8 py-5 mb-6 border border-primary/20"
                  style={{ background: "hsl(var(--primary) / 0.06)" }}>
                  <p className="font-body text-[10px] text-muted-foreground/60 mb-1.5 uppercase tracking-[0.2em]">Your Application Number</p>
                  <p className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-[0.12em]">{submittedData.appNumber}</p>
                </div>
              )}

              {/* Info text */}
              <p className="font-body text-xs text-muted-foreground/50 mb-8">
                For more updates, you can track your application on the tracking page anytime.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button onClick={handleGoToTracking}
                  className="w-full group relative overflow-hidden h-13 rounded-2xl font-body text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] bg-primary py-3.5"
                  style={{ boxShadow: "0 4px 24px hsl(var(--primary) / 0.3)" }}>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <span className="relative flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Track Your Application
                  </span>
                </button>

                <button onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl font-body text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/30 hover:border-primary/30 bg-transparent transition-all duration-300">
                  <Copy className="w-3.5 h-3.5" /> Copy Tracking Link
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <section className="py-12 sm:py-20 bg-background">
        <div className="container max-w-4xl px-4">
          <div className="premium-card p-6 sm:p-10 border border-border/50 hover:!transform-none hover:!scale-100">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground tracking-tight">Online Application Form</h2>
                <p className="font-body text-xs text-muted-foreground mt-0.5">All fields marked * are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
              {/* Photo upload */}
              <div className="relative rounded-2xl border border-dashed border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03] group-hover:from-primary/[0.06] group-hover:to-secondary/[0.06] transition-all duration-500" />
                <div className="relative p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <label className="font-body text-sm font-bold text-foreground">Upload Your Photo *</label>
                      <p className="font-body text-[11px] text-muted-foreground">Passport-size photo in JPG or PNG format</p>
                    </div>
                  </div>
                  <input type="file" accept="image/*" required onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="w-full font-body text-sm file:mr-4 file:py-2 file:px-5 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 file:transition-colors file:duration-200 cursor-pointer" />
                  {photoFile &&
                    <div className="mt-3 flex items-center gap-2 text-xs font-body px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 w-fit">
                      <CheckCircle className="w-3.5 h-3.5" /> {photoFile.name}
                    </div>
                  }
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground tracking-tight">Personal Information</h3>
                  <div className="flex-1 h-px bg-border/50 ml-2" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <input name="full_name" type="text" value={form.full_name} onChange={handleChange} required
                        placeholder="Enter your full name" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        placeholder="your@email.com" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                        placeholder="10-digit number" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}
                        className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={selectClass}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course *</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <select name="course" value={form.course} onChange={handleChange} required className={`${selectClass} pl-10`}>
                        <option value="">Select Course</option>
                        <option value="BCA">BCA</option>
                        <option value="B.Com Regular">B.Com Regular</option>
                        <option value="B.Com Professional">B.Com Professional</option>
                        <option value="BBA">BBA</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Details */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground tracking-tight">Family & Academic Details</h3>
                  <div className="flex-1 h-px bg-border/50 ml-2" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Father's Name</label>
                    <input name="father_name" type="text" value={form.father_name} onChange={handleChange}
                      placeholder="Father's full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Mother's Name</label>
                    <input name="mother_name" type="text" value={form.mother_name} onChange={handleChange}
                      placeholder="Mother's full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Previous PU College</label>
                    <div className="relative">
                      <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <input name="previous_school" type="text" value={form.previous_school} onChange={handleChange}
                        placeholder="College name" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">12th Percentage</label>
                    <div className="relative">
                      <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10 pointer-events-none" />
                      <input name="percentage_12th" type="text" value={form.percentage_12th} onChange={handleChange}
                        placeholder="e.g. 78.5%" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground tracking-tight">Address</h3>
                  <div className="flex-1 h-px bg-border/50 ml-2" />
                </div>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3}
                  className={`${inputClass} resize-none`} placeholder="Your complete residential address" />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-3 border-t border-border/50">
                <Button type="button" variant="outline" onClick={() => navigate("/admissions")}
                  className="font-body rounded-xl flex-1 h-12 hover:bg-muted transition-colors text-sm">Cancel</Button>
                <button type="submit" disabled={submitting}
                  className="relative flex-1 group overflow-hidden h-12 rounded-xl font-body text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 bg-primary"
                  style={{ boxShadow: "0 4px 24px hsl(var(--primary) / 0.3)" }}>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <span className="relative flex items-center justify-center gap-2">
                    {submitting ?
                      <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Submitting...</> :
                      <><CheckCircle className="w-4 h-4" /> Submit Application</>
                    }
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
