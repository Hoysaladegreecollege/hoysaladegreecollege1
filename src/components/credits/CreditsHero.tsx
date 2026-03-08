import { Terminal, Sparkles, Cpu, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

const heroChild = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.3 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function CreditsHero() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card/30" />

      {/* Cyber grid — perspective floor */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--secondary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)/0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, transparent 10%, black 50%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 10%, black 50%, transparent 95%)",
        }}
      />

      {/* Animated neon orbs */}
      <div className="absolute top-16 right-[15%] w-[420px] h-[420px] rounded-full bg-secondary/[0.06] blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 left-[10%] w-[350px] h-[350px] rounded-full bg-primary/[0.05] blur-[100px] animate-[pulse_5s_ease-in-out_infinite_1.5s]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-secondary/[0.03] blur-[150px] animate-[creditsFloat_8s_ease-in-out_infinite]" />

      {/* Scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--secondary)/0.15) 2px, hsl(var(--secondary)/0.15) 4px)",
          animation: "creditsScanLine 8s linear infinite",
        }}
      />

      {/* Floating hex particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-secondary/[0.08]"
            style={{
              left: `${8 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animation: `creditsFloat ${4 + i * 0.6}s ease-in-out infinite ${i * 0.5}s`,
            }}
          >
            <Hexagon className="w-3 h-3" />
          </div>
        ))}
      </div>

      {/* Data stream lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-secondary/20 to-transparent"
            style={{
              top: `${30 + i * 20}%`,
              left: "-100%",
              right: "-100%",
              animation: `creditsDataStream ${6 + i * 2}s linear infinite ${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="container relative px-5 text-center"
        initial="hidden"
        animate="visible"
      >
        {/* HUD corner brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-secondary/20 rounded-tl-sm opacity-60" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-secondary/20 rounded-tr-sm opacity-60" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-secondary/20 rounded-bl-sm opacity-60" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-secondary/20 rounded-br-sm opacity-60" />

        <motion.div custom={0} variants={heroChild}>
          <div className="group/pill inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/5 border border-secondary/15 text-secondary text-xs font-body font-medium mb-6 backdrop-blur-md cursor-default hover:bg-secondary/10 hover:border-secondary/30 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.15),inset_0_0_20px_hsl(var(--secondary)/0.05)] transition-all duration-500">
            <Cpu className="w-3.5 h-3.5 group-hover/pill:animate-[creditsSpin_2s_linear_infinite]" />
            <span className="group-hover/pill:tracking-wider transition-all duration-500 font-mono text-[11px]">
              SYS.CREDITS // INITIALIZED
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
        </motion.div>

        <motion.h1
          custom={1}
          variants={heroChild}
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]"
        >
          Website{" "}
          <span className="text-secondary relative inline-block">
            Credits
            <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent animate-[shimmerLine_3s_ease-in-out_infinite]" />
            {/* Holographic text glow */}
            <span className="absolute inset-0 text-secondary blur-[20px] opacity-30 animate-[creditsPulseGlow_3s_ease-in-out_infinite] pointer-events-none" aria-hidden>Credits</span>
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={heroChild}
          className="mt-6 text-muted-foreground font-body text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Acknowledging the talent, dedication, and modern craft behind this digital experience.
        </motion.p>

        <motion.div custom={3} variants={heroChild} className="flex items-center justify-center gap-3 mt-8">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-secondary/40" />
          <div className="relative">
            <Sparkles className="w-5 h-5 text-secondary/70 animate-[creditsSpin_6s_linear_infinite]" />
            <div className="absolute inset-0 blur-md bg-secondary/20 rounded-full animate-[creditsPulseGlow_2s_ease-in-out_infinite]" />
          </div>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-secondary/40" />
        </motion.div>

        {/* Status ticker */}
        <motion.div custom={4} variants={heroChild} className="mt-6">
          <span className="font-mono text-[10px] text-muted-foreground/40 tracking-widest">
            [ SYSTEM ACTIVE • BUILD v2.5 • UPTIME 99.9% ]
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
