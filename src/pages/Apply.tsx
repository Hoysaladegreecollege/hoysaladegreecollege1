import SEOHead from "@/components/SEOHead";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Upload, GraduationCap, Phone, Calendar, User, Mail, MapPin, School, Percent, Users, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const initialForm = {
  full_name: "", email: "", phone: "", date_of_birth: "", gender: "",
  course: "", father_name: "", mother_name: "", address: "",
  previous_school: "", percentage_12th: ""
};

export default function Apply() {
  const [form, setForm] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.course) {
      toast.error("Please fill in all required fields");
      return;
    }
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
      full_name: form.full_name, email: form.email, phone: form.phone,
      date_of_birth: form.date_of_birth || null, gender: form.gender || null,
      course: form.course, father_name: form.father_name || null,
      mother_name: form.mother_name || null, address: form.address || null,
      previous_school: form.previous_school || null, percentage_12th: form.percentage_12th || null,
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
    setForm(initialForm);
    setPhotoFile(null);
    navigate(`/application-status?app=${data.application_number}&email=${encodeURIComponent(form.email)}`);
  };

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-primary/30";

  return (
    <div className="page-enter">
      <SEOHead title="Apply Online - Admissions 2026-27" description="Submit your online application for admission to Hoysala Degree College." canonical="/apply" />
      <PageHeader title="Online Application" subtitle="Academic Year 2026–27" />

      <section className="py-12 sm:py-20 bg-background">
        <div className="container max-w-4xl px-4">
          <div className="premium-card p-6 sm:p-10 border border-border/50">
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

            <form onSubmit={handleSubmit} className="space-y-7">
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
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input name="full_name" type="text" value={form.full_name} onChange={handleChange} required
                        placeholder="Enter your full name" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input name="email" type="email" value={form.email} onChange={handleChange} required
                        placeholder="your@email.com" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required
                        placeholder="10-digit number" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}
                        className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Course *</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <select name="course" value={form.course} onChange={handleChange} required className={`${inputClass} pl-10`}>
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
                    <input name="father_name" value={form.father_name} onChange={handleChange}
                      placeholder="Father's full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Mother's Name</label>
                    <input name="mother_name" value={form.mother_name} onChange={handleChange}
                      placeholder="Mother's full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Previous PU College</label>
                    <div className="relative">
                      <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input name="previous_school" value={form.previous_school} onChange={handleChange}
                        placeholder="College name" className={`${inputClass} pl-10`} />
                    </div>
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">12th Percentage</label>
                    <div className="relative">
                      <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input name="percentage_12th" value={form.percentage_12th} onChange={handleChange}
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
                <textarea name="address" value={form.address} onChange={handleChange as any} rows={3}
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
