import SEOHead from "@/components/SEOHead";
import ScrollReveal from "@/components/ScrollReveal";
import { DeveloperShowcase } from "@/components/credits/DeveloperShowcase";
import { ProjectStats } from "@/components/credits/ProjectStats";
import { FeatureHighlights } from "@/components/credits/FeatureHighlights";
import { TechStack } from "@/components/credits/TechStack";
import { CreditsHero } from "@/components/credits/CreditsHero";
import { CreditsFooter } from "@/components/credits/CreditsFooter";

export default function Credits() {
  return (
    <>
      <SEOHead
        title="Website Credits | Hoysala Degree College"
        description="Credits and acknowledgments for the Hoysala Degree College website."
      />
      <CreditsHero />
      <section className="pb-24 sm:pb-32">
        <div className="container px-5">
          <ScrollReveal>
            <DeveloperShowcase />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <ProjectStats />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <FeatureHighlights />
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <TechStack />
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <CreditsFooter />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
