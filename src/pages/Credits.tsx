import SEOHead from "@/components/SEOHead";
import { DeveloperShowcase } from "@/components/credits/DeveloperShowcase";
import { ProjectStats } from "@/components/credits/ProjectStats";
import { FeatureHighlights } from "@/components/credits/FeatureHighlights";
import { TechStack } from "@/components/credits/TechStack";
import { CreditsHero } from "@/components/credits/CreditsHero";
import { CreditsFooter } from "@/components/credits/CreditsFooter";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Crown, ArrowRight, Sparkles, Globe, MessageSquare } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function Credits() {
  const sections = [
    <DeveloperShowcase key="dev" />,
    <ProjectStats key="stats" />,
    <FeatureHighlights key="features" />,
    <TechStack key="tech" />,

    // Purchase CTA
    <div key="purchase-cta" className="max-w-3xl mx-auto mt-10">
      <div className="relative rounded-3xl overflow-hidden border border-[hsl(42_87%_55%_/_0.15)]"
        style={{ background: "linear-gradient(135deg, rgba(198,167,94,0.04), rgba(20,24,36,0.95))", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4), 0 0 40px rgba(198,167,94,0.05)" }}>
        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(42 87% 55% / 0.5), transparent)" }} />
        <div className="p-8 sm:p-12 text-center">
          <Crown className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(42, 87%, 55%)" }} />
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">Want This Website?</h3>
          <p className="font-body text-muted-foreground text-sm mb-8 max-w-md mx-auto">Get this complete college management system with all features, dashboards, and source code for your institution.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/purchase"
              className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-[1.25rem] font-body text-base font-bold transition-all duration-500 hover:scale-105 hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, hsl(42,87%,58%), hsl(38,92%,50%), hsl(35,85%,45%))", color: "hsl(30,10%,10%)", boxShadow: "0 16px 48px hsla(42,87%,52%,0.35), inset 0 1px 0 hsla(50,100%,90%,0.35)" }}>
              <span className="absolute inset-0 overflow-hidden rounded-[1.25rem]">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </span>
              <Sparkles className="w-5 h-5 relative z-10" />
              <span className="relative z-10">View Features & Pricing</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            <a href="https://api.whatsapp.com/send/?phone=9036048950&text=Hi+Pavan%2C+I%27m+interested+in+purchasing+the+college+website.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-5 rounded-[1.25rem] font-body text-sm font-bold border border-emerald-500/20 text-emerald-400/80 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(16,185,129,0.05)" }}>
              <MessageSquare className="w-5 h-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <p className="font-body text-[10px] text-muted-foreground/40 mt-6">Starting at ₹15,000 • Full source code • Lifetime ownership</p>
        </div>
      </div>
    </div>,

    <CreditsFooter key="footer" />,
  ];

  return (
    <>
      <SEOHead
        title="Website Credits | Hoysala Degree College"
        description="Credits and acknowledgments for the Hoysala Degree College website."
      />
      <CreditsHero />
      <section className="pb-24 sm:pb-32">
        <div className="container px-5">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={sectionVariants}
            >
              {section}
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
