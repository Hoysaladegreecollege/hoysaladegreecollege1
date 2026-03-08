import { Terminal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const heroChild = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function CreditsHero() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Animated ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />
      <div className="absolute top-16 right-[15%] w-[420px] h-[420px] rounded-full bg-secondary/[0.04] blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] rounded-full bg-primary/[0.03] blur-[100px] animate-[pulse_5s_ease-in-out_infinite_1.5s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-secondary/[0.02] blur-[150px]" />

      {/* Floating dot grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--secondary)/0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-secondary/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `creditsFloat ${3 + i * 0.7}s ease-in-out infinite ${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="container relative px-5 text-center"
        initial="hidden"
        animate="visible"
      >
        <motion.div custom={0} variants={heroChild}>
          <div className="group/pill inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-xs font-body font-medium mb-6 backdrop-blur-sm cursor-default hover:bg-secondary/10 hover:border-secondary/25 hover:shadow-[0_0_20px_hsl(var(--secondary)/0.1)] transition-all duration-500">
            <Terminal className="w-3.5 h-3.5 group-hover/pill:rotate-12 transition-transform duration-500" />
            <span className="group-hover/pill:tracking-wider transition-all duration-500">Crafted with passion & precision</span>
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          variants={heroChild}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1]"
        >
          Website{" "}
          <span className="text-secondary relative">
            Credits
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary/60 to-transparent animate-[shimmerLine_3s_ease-in-out_infinite]" />
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={heroChild}
          className="mt-5 text-muted-foreground font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Acknowledging the talent, dedication, and modern craft behind this digital experience.
        </motion.p>

        <motion.div custom={3} variants={heroChild} className="flex items-center justify-center gap-2 mt-6">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-secondary/40" />
          <Sparkles className="w-4 h-4 text-secondary/60 animate-[creditsSpin_6s_linear_infinite]" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-secondary/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
