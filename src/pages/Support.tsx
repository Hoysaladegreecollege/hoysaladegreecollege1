import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import { HelpCircle, MessageSquare, Phone, Mail, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "How do I apply for admission?", a: "You can apply online through our Admissions page or visit the college office in person. Fill the application form and submit the required documents." },
  { q: "What are the fee payment options?", a: "We accept payments via bank transfer, UPI, demand draft, and cash at the college fee counter. Installment options are available." },
  { q: "How can I access my attendance and marks?", a: "Registered students can log in to the Student Dashboard to view their attendance and marks in real time." },
  { q: "Does the college provide placement assistance?", a: "Yes, our placement cell works actively with companies to provide job and internship opportunities to students." },
  { q: "How do I get a bonafide certificate?", a: "Submit a request through the student portal or visit the admin office. Certificates are usually processed within 3 working days." },
  { q: "Who do I contact for hostel queries?", a: "Please contact the hostel warden or the admin office for any hostel-related queries at the numbers listed on our Contact page." },
];

export default function Support() {
  return (
    <div>
      <SEOHead title="Support & Help" description="Get help with admissions, fees, attendance, placements, and more at Hoysala Degree College. FAQs and contact support team." canonical="/support" />
      <section className="bg-primary py-16 text-center text-primary-foreground">
        <div className="container">
          <h1 className="font-display text-4xl md:text-5xl font-bold">Support & Help</h1>
          <p className="font-body text-sm mt-2 opacity-70">Home / Support</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container max-w-3xl">
          <SectionHeading title="Frequently Asked Questions" subtitle="Find answers to the most common queries" />
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="bg-card border border-border rounded-xl group">
                <summary className="cursor-pointer px-5 py-4 font-body text-sm font-medium text-foreground flex items-center gap-3 list-none">
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  {f.q}
                </summary>
                <div className="px-5 pb-4 pt-0 font-body text-sm text-muted-foreground leading-relaxed ml-7">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="container text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Still Need Help?</h2>
          <p className="font-body text-muted-foreground mb-6">Our support team is ready to assist you.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button className="font-body bg-primary text-primary-foreground">
                <Mail className="w-4 h-4 mr-2" /> Contact Us
              </Button>
            </Link>
            <Button variant="outline" className="font-body">
              <Phone className="w-4 h-4 mr-2" /> +91 80 XXXX XXXX
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
