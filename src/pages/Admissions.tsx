import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Calendar, ArrowRight, X } from "lucide-react";
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
    const { error } = await supabase.from("admission_applications").insert({
      full_name: form.full_name, email: form.email, phone: form.phone,
      date_of_birth: form.date_of_birth || null, gender: form.gender || null,
      course: form.course, father_name: form.father_name || null,
      mother_name: form.mother_name || null, address: form.address || null,
      previous_school: form.previous_school || null, percentage_12th: form.percentage_12th || null,
    });
    setSubmitting(false);
    if (error) toast.error("Failed to submit application. Please try again.");
    else { toast.success("Application submitted successfully!"); setForm(initialForm); setShowForm(false); }
  };

  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Admissions</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Admissions</p>
        </div>
      </section>

      <section className="bg-secondary/10 py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-display text-lg font-bold text-foreground">Admissions Open for 2026–27</p>
              <p className="font-body text-sm text-muted-foreground">Apply now for BCA, B.Com, BBA, CA & CS programs</p>
            </div>
          </div>
          <Button className="font-body bg-primary text-primary-foreground" onClick={() => setShowForm(true)}>Apply Online</Button>
        </div>
      </section>

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Online Application Form</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Full Name *</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} required className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Date of Birth</label>
                  <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Course *</label>
                  <select name="course" value={form.course} onChange={handleChange} required className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select Course</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Com Regular">B.Com Regular</option>
                    <option value="B.Com Professional">B.Com Professional</option>
                    <option value="BBA">BBA</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Father's Name</label>
                  <input name="father_name" value={form.father_name} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Mother's Name</label>
                  <input name="mother_name" value={form.mother_name} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">Previous PU College</label>
                  <input name="previous_school" value={form.previous_school} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-foreground block mb-1">12th Percentage</label>
                  <input name="percentage_12th" value={form.percentage_12th} onChange={handleChange} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground block mb-1">Address</label>
                <textarea name="address" value={form.address} onChange={handleChange as any} rows={2} className="w-full border border-border rounded-lg px-3 py-2 font-body text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full font-body bg-primary text-primary-foreground">
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      )}

      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionHeading title="Admission Process" subtitle="Follow these simple steps to join Hoysala Degree College" />
          <div className="space-y-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100}>
                <div className="flex gap-4 items-start bg-card border border-border rounded-xl p-5 hover-lift">
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
        <div className="container max-w-3xl">
          <SectionHeading title="Required Documents" />
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            {documents.map((d) => (
              <div key={d} className="flex items-center gap-3 font-body text-sm text-foreground"><CheckCircle className="w-4 h-4 text-secondary shrink-0" />{d}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Have Questions?</h2>
          <p className="font-body text-muted-foreground mb-6">Our admissions team is here to help.</p>
          <Link to="/contact"><Button variant="outline" className="font-body">Contact Admissions <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
