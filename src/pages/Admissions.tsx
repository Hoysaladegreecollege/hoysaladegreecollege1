import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, CheckCircle, Calendar, ArrowRight } from "lucide-react";

const steps = [
  { step: "01", title: "Check Eligibility", desc: "Verify you meet the eligibility criteria for your chosen course." },
  { step: "02", title: "Fill Application Form", desc: "Complete the online or offline application form with accurate details." },
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

export default function Admissions() {
  return (
    <div>
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Admissions</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Admissions</p>
        </div>
      </section>

      {/* Open Banner */}
      <section className="bg-secondary/10 py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-display text-lg font-bold text-foreground">Admissions Open for 2026–27</p>
              <p className="font-body text-sm text-muted-foreground">Apply now for BCA, BCom, and BBA programs</p>
            </div>
          </div>
          <Button className="font-body bg-primary text-primary-foreground">Apply Online</Button>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <SectionHeading title="Admission Process" subtitle="Follow these simple steps to join Hoysala Degree College" />
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-4 items-start bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-16 bg-cream">
        <div className="container max-w-3xl">
          <SectionHeading title="Required Documents" />
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            {documents.map((d) => (
              <div key={d} className="flex items-center gap-3 font-body text-sm text-foreground">
                <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                {d}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Have Questions About Admissions?</h2>
          <p className="font-body text-muted-foreground mb-6">Our admissions team is here to help you every step of the way.</p>
          <Link to="/contact">
            <Button variant="outline" className="font-body">
              Contact Admissions Office <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
