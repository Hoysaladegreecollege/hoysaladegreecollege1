import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Calendar, ArrowRight, X, Sparkles, Upload } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  { step: "01", title: "Check Eligibility", desc: "Verify you meet the eligibility criteria for your chosen course." },
  { step: "02", title: "Fill Application Form", desc: "Complete the online application form with accurate details." },
  { step: "03", title: "Submit Documents", desc: "Submit required documents: 10th & 12th marksheets, ID proof, photos." },
  { step: "04", title: "Pay Registration Fee", desc: "Pay the non-refundable registration fee to confirm your application." },
  { step: "05", title: "Admission Confirmation", desc: "Receive your admission confirmation letter and welcome kit." },
];

const documents = [
  "10th & 12th Marksheets (Original + 2 copies)",
  "Transfer Certificate from previous institution",
  "Migration Certificate (if applicable)",
  "Aadhar Card / ID Proof",
  "Passport size photographs (6 copies)",
  "Caste Certificate (if applicable)",
  "Income Certificate (for scholarship applicants)",
];

const initialForm = {
  full_name: "", email: "", phone: "", date_of_birth: "", gender: "",
  course: "", father_name: "", mother_name: "", address: "",
  previous_school: "", percentage_12th: "",
};

export default function Admissions() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      const path = `applications/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("uploads").upload(path, photoFile);
      if (!uploadErr) {
        const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }
    }

    const insertData: any = {
      full_name: form.full_name, email: form.email, phone: form.phone,
      date_of_birth: form.date_of_birth || null, gender: form.gender || null,
      course: form.course, father_name: form.father_name || null,
      mother_name: form.mother_name || null, address: form.address || null,
      previous_school: form.previous_school || null, percentage_12th: form.percentage_12th || null,
    };
    if (photoUrl) insertData.review_notes = `Photo: ${photoUrl}`;

    const { error } = await supabase.from("admission_applications").insert(insertData);
    setSubmitting(false);
    if (error) toast.error("Failed to submit application. Please try again.");
    else { toast.success("Application submitted successfully! 🎉"); setForm(initialForm); setPhotoFile(null); setShowForm(false); }
  };

  const inputClass = "w-full border border-border rounded-xl px-3 py-2.5 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container px-4">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Admissions</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Admissions</p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-secondary/20 via-secondary/10 to-primary/5 py-8 sm:py-10">
        <div className="container px-4 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 animate-float">
              <Calendar className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-foreground">Admissions Open 2026–27</p>
              <p className="font-body text-sm text-muted-foreground">Apply now for BCA, B.Com, BBA, CA & CS programs</p>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="font-body bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden w-full sm:w-auto"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse relative z-10" />
            <span className="relative z-10 font-bold">Apply Now</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
          </Button>
        </div>
      </section>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Online Application Form</h2>
                <p className="font-body text-xs text-muted-foreground mt-1">Fill all required fields marked with *</p>
              </div>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo upload */}
              <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-border">
                <label className="font-body text-xs font-semibold text-foreground block mb-2 flex items-center gap-1">
                  <Upload className="w-3 h-3" /> Upload Your Photo
                </label>
                <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full font-body text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:text-xs hover:file:bg-primary/20 cursor-pointer" />
                {photoFile && <p className="font-body text-xs text-muted-foreground mt-1">Selected: {photoFile.name}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Full Name *</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Date of Birth</label>
                  <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select</option>
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
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Father's Name</label>
                  <input name="father_name" value={form.father_name} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Mother's Name</label>
                  <input name="mother_name" value={form.mother_name} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Previous PU College</label>
                  <input name="previous_school" value={form.previous_school} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-foreground block mb-1.5">12th Percentage</label>
                  <input name="percentage_12th" value={form.percentage_12th} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="font-body text-xs font-semibold text-foreground block mb-1.5">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange as any} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="font-body rounded-xl flex-1">Cancel</Button>
                <Button type="submit" disabled={submitting} className="font-body rounded-xl flex-1 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform">
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <section className="py-16 sm:py-20 bg-background">
        <div className="container max-w-4xl px-4">
          <SectionHeading title="Admission Process" subtitle="Follow these simple steps to join Hoysala Degree College" />
          <div className="space-y-5">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100}>
                <div className="flex gap-4 items-start bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0">{s.step}</div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container max-w-3xl px-4">
          <SectionHeading title="Required Documents" />
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            {documents.map((d) => (
              <div key={d} className="flex items-center gap-3 font-body text-sm text-foreground"><CheckCircle className="w-4 h-4 text-secondary shrink-0" />{d}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container text-center px-4">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Have Questions?</h2>
          <p className="font-body text-muted-foreground mb-6">Our admissions team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:7676272167"><Button variant="outline" className="font-body rounded-xl">📞 Call: 7676272167</Button></a>
            <Link to="/contact"><Button variant="outline" className="font-body rounded-xl">Contact Admissions <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
