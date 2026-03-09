import SEOHead from "@/components/SEOHead";
import SectionHeading from "@/components/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal";
import PageHeader from "@/components/PageHeader";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import { Sparkles } from "lucide-react";

export default function Contact() {
  return (
    <div className="page-enter">
      <SEOHead title="Contact Us" description="Contact Hoysala Degree College Nelamangala. Phone: 7676272167, Email: principal.hoysaladegreecollege@gmail.com." canonical="/contact" />
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />

      <section className="py-16 sm:py-28 bg-background relative overflow-hidden">
        {/* Multi-layer ambient lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-secondary/[0.015] rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-6xl px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/15 mb-5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span className="font-body text-[11px] font-bold text-secondary uppercase tracking-[0.15em]">Get in Touch</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
                We're Here to Help
              </h2>
              <p className="font-body text-sm sm:text-base text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
                Reach out for admissions, queries, or campus visits. Our team is ready to assist you.
              </p>
              <div className="mt-6 w-20 h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-10 sm:gap-14 items-start">
            <ContactInfoCards />
            <ContactForm />
          </div>
        </div>
      </section>

      <ContactMap />
    </div>
  );
}
