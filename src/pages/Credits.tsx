import SEOHead from "@/components/SEOHead";
import { DeveloperShowcase } from "@/components/credits/DeveloperShowcase";
import { ProjectStats } from "@/components/credits/ProjectStats";
import { FeatureHighlights } from "@/components/credits/FeatureHighlights";
import { TechStack } from "@/components/credits/TechStack";
import { CreditsHero } from "@/components/credits/CreditsHero";
import { CreditsFooter } from "@/components/credits/CreditsFooter";
import { motion } from "framer-motion";

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
