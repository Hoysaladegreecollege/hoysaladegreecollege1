import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FileText, CheckCircle, Calendar, ArrowRight, X, Sparkles, Upload, GraduationCap, Phone, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
{ step: "01", title: "Check Eligibility", desc: "Verify you meet the eligibility criteria for your chosen course.", icon: Shield, color: "from-blue-500/20 to-blue-500/5" },
{ step: "02", title: "Fill Application Form", desc: "Complete the online application form with accurate details.", icon: FileText, color: "from-primary/15 to-primary/5" },
{ step: "03", title: "Submit Documents", desc: "Submit required documents: 10th & 12th marksheets, ID proof, photos.", icon: Upload, color: "from-secondary/20 to-secondary/5" },
{ step: "04", title: "Pay Registration Fee", desc: "Pay the non-refundable registration fee to confirm your application.", icon: CheckCircle, color: "from-emerald-500/15 to-emerald-500/5" },
{ step: "05", title: "Admission Confirmation", desc: "Receive your admission confirmation letter and welcome kit.", icon: GraduationCap, color: "from-purple-500/15 to-purple-500/5" }];


const documents = [
"10th & 12th Marksheets (Original + 2 copies)",
"Transfer Certificate from previous institution",
"Migration Certificate (if applicable)",
"Aadhar Card / ID Proof",
"Passport size photographs (6 copies)",
"Caste Certificate (if applicable)",
"Income Certificate (for scholarship applicants)"];


const courses = [
{ name: "BCA", seats: "60 Seats", fee: "₹35,000/yr", icon: "🖥️" },
{ name: "B.Com Regular", seats: "120 Seats", fee: "₹25,000/yr", icon: "📊" },
{ name: "B.Com Professional", seats: "60 Seats", fee: "₹30,000/yr", icon: "📈" },
{ name: "BBA", seats: "60 Seats", fee: "₹30,000/yr", icon: "💼" }];


const initialForm = {
  full_name: "", email: "", phone: "", date_of_birth: "", gender: "",
  course: "", father_name: "", mother_name: "", address: "",
  previous_school: "", percentage_12th: ""
};

export default function Admissions() {
  const [showForm, setShowForm] = useState(false);
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
      const path = `applications/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, photoFile);
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
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

    // Send confirmation email to the applicant
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
    setShowForm(false);
    navigate(`/application-status?app=${data.application_number}&email=${encodeURIComponent(form.email)}`);
  };

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all duration-300 placeholder:text-muted-foreground/40 hover:border-primary/30";

  return (
    <div className="page-enter">
      <SEOHead title="Admissions 2026-27" description="Apply for admission to Hoysala Degree College Nelamangala. BCA, B.Com, BBA programs. Online application, eligibility, fees, required documents." canonical="/admissions" />
      <PageHeader title="Admissions" subtitle="Join Hoysala Degree College and shape your future" />

      {/* Hero CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-secondary/10 to-primary/8" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="relative container px-4 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-secondary/25 border border-secondary/30 flex items-center justify-center shrink-0 animate-float shadow-lg">
                <Calendar className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-body text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Now Open
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">Admissions Open 2026–27</p>
                <p className="font-body text-sm text-muted-foreground mt-1">Apply for BCA, B.Com, BBA, CA & CS programs</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
              <button
                onClick={() => setShowForm(true)}
                className="relative group overflow-hidden px-6 sm:px-8 py-3.5 rounded-2xl font-body text-sm sm:text-base font-bold text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-0.5 w-full sm:w-auto text-center"
                style={{ background: "linear-gradient(135deg, hsl(42,87%,52%), hsl(38,92%,44%), hsl(42,87%,60%))", boxShadow: "0 8px 32px hsla(42,87%,52%,0.4), inset 0 1px 0 rgba(255,255,255,0.2)" }}>

                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                  Apply Now
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              <Link to="/application-status" className="w-full sm:w-auto">
                <Button variant="outline" className="font-body rounded-2xl w-full h-full py-3.5 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 text-sm sm:text-base">
                  <FileText className="w-4 h-4 mr-2" /> Track Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Course seats overview */}
      <section className="py-16 sm:py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
        <div className="container px-4 relative">
          <ScrollReveal><SectionHeading title="Available Programs" subtitle="Choose the right course for your future" /></ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {courses.map((c, i) =>
            <ScrollReveal key={c.name} delay={i * 80}>
                <div className="relative premium-card p-5 sm:p-7 text-center group cursor-pointer overflow-hidden border-glow card-stack" onClick={() => setShowForm(true)}>
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-400 inline-block filter group-hover:drop-shadow-lg">{c.icon}</div>
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{c.name}</h3>
                    <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1.5">{c.seats}</p>
                    <p className="font-body text-xs sm:text-sm text-secondary font-bold mt-2 sm:mt-3 bg-secondary/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full inline-block border border-secondary/20">{c.fee}</p>
                    





                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {showForm &&
      <div className="fixed inset-0 bg-foreground/60 backdrop-blur-md z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 animate-fade-in overflow-y-auto"
      onClick={(e) => {if (e.target === e.currentTarget) setShowForm(false);}}>
          <div className="bg-card sm:rounded-2xl border-0 sm:border border-border w-full max-w-3xl min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-bounce relative">
            {/* Modal header */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">Online Application Form</h2>
                  <p className="font-body text-xs text-muted-foreground">Fill all required fields marked with *</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
              {/* Photo upload */}
              <div className="bg-gradient-to-br from-primary/4 to-secondary/4 rounded-xl p-4 border border-dashed border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <label className="font-body text-xs font-bold text-foreground block mb-2 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-primary" /> Upload Your Photo *
                </label>
                <input type="file" accept="image/*" required onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full font-body text-sm file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer" />
                {photoFile &&
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-body">
                    <CheckCircle className="w-3.5 h-3.5" /> {photoFile.name}
                  </div>
              }
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
              { label: "Full Name *", name: "full_name", type: "text", required: true, placeholder: "Enter your full name" },
              { label: "Email *", name: "email", type: "email", required: true, placeholder: "your@email.com" },
              { label: "Phone *", name: "phone", type: "tel", required: true, placeholder: "10-digit number" },
              { label: "Date of Birth", name: "date_of_birth", type: "date", required: false, placeholder: "" }].
              map((f) =>
              <div key={f.name}>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">{f.label}</label>
                    <input name={f.name} type={f.type} value={(form as any)[f.name]} onChange={handleChange} required={f.required}
                placeholder={f.placeholder} className={inputClass} />
                  </div>
              )}
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
                  <select name="course" value={form.course} onChange={handleChange} required className={inputClass}>
                    <option value="">Select Course</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Com Regular">B.Com Regular</option>
                    <option value="B.Com Professional">B.Com Professional</option>
                    <option value="BBA">BBA</option>
                  </select>
                </div>
                {[
              { label: "Father's Name", name: "father_name", placeholder: "Father's full name" },
              { label: "Mother's Name", name: "mother_name", placeholder: "Mother's full name" },
              { label: "Previous PU College", name: "previous_school", placeholder: "College name" },
              { label: "12th Percentage", name: "percentage_12th", placeholder: "e.g. 78.5%" }].
              map((f) =>
              <div key={f.name}>
                    <label className="font-body text-xs font-semibold text-foreground block mb-1.5">{f.label}</label>
                    <input name={f.name} value={(form as any)[f.name]} onChange={handleChange}
                placeholder={f.placeholder} className={inputClass} />
                  </div>
              )}
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange as any} rows={2}
              className={`${inputClass} resize-none`} placeholder="Your full address" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}
              className="font-body rounded-xl flex-1 hover:bg-muted transition-colors">Cancel</Button>
                <button type="submit" disabled={submitting}
              className="relative flex-1 group overflow-hidden px-6 py-2.5 rounded-xl font-body text-sm font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--navy-dark)))", boxShadow: "0 4px 20px hsl(var(--primary) / 0.3)" }}>
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <span className="relative flex items-center justify-center gap-2">
                    {submitting ?
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> :

                  <><CheckCircle className="w-4 h-4" /> Submit Application</>
                  }
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      {/* Admission Steps */}
      <section className="py-20 sm:py-28 bg-cream relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 section-pattern opacity-30" />
        <div className="container max-w-4xl px-4 relative">
          <ScrollReveal><SectionHeading title="Admission Process" subtitle="Follow these simple steps to join Hoysala Degree College" /></ScrollReveal>
          <div className="space-y-4">
            {steps.map((s, i) =>
            <ScrollReveal key={s.step} delay={i * 80}>
                <div className="flex gap-4 sm:gap-5 items-start bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-400 relative overflow-hidden group border-glow">
                  <div className={`absolute inset-0 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                  {/* Connector line */}
                  {i < steps.length - 1 &&
                <div className="absolute left-[2.1rem] top-[4.5rem] bottom-[-1rem] w-0.5 bg-gradient-to-b from-primary/20 to-transparent z-20 pointer-events-none" />
                }
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-navy-dark flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {s.step}
                  </div>
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{s.title}</h3>
                    </div>
                    <p className="font-body text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-muted-foreground/20 group-hover:text-emerald-500 transition-all duration-500 group-hover:scale-110 shrink-0 mt-1 relative z-10" />
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-20 sm:py-24 bg-background">
        <div className="container max-w-3xl px-4">
          <ScrollReveal><SectionHeading title="Required Documents" subtitle="Prepare these documents before applying" /></ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="premium-card p-7 sm:p-10">
              <div className="grid sm:grid-cols-2 gap-4">
                {documents.map((d, i) =>
                <div key={d} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors duration-200 group">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-body text-sm text-foreground/80 group-hover:text-foreground transition-colors duration-200">{d}</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-16 bg-cream">
        <div className="container text-center px-4">
          <ScrollReveal>
            <div className="max-w-xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">Have Questions?</h2>
              <p className="font-body text-muted-foreground mb-8 text-sm">Our admissions team is here to help you through every step.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:7676272167" className="w-full sm:w-auto">
                  <Button variant="outline" className="font-body rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group w-full">
                    <Phone className="w-4 h-4 mr-2 group-hover:animate-pulse" /> Call: 7676272167
                  </Button>
                </a>
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="outline" className="font-body rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 group w-full">
                    Contact Admissions <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>);

}