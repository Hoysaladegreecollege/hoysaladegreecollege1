import { Code2, Cpu, Palette, Database, Shield, Rocket, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";

const techStack = [
  { name: "React 18", icon: Code2, desc: "Component Library" },
  { name: "TypeScript", icon: Cpu, desc: "Type Safety" },
  { name: "Tailwind CSS", icon: Palette, desc: "Utility Styling" },
  { name: "Lovable Cloud", icon: Database, desc: "Backend & Auth" },
  { name: "Vite", icon: Rocket, desc: "Build Tool" },
  { name: "RLS Security", icon: Shield, desc: "Row-Level Security" },
  { name: "Web Push", icon: Zap, desc: "Notifications" },
  { name: "Recharts", icon: Layers, desc: "Data Visualization" },
];

const techVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function TechStack() {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/15 text-secondary text-xs font-mono font-medium mb-3 backdrop-blur-sm">
          <Rocket className="w-3.5 h-3.5" />
          <span className="tracking-[0.2em] uppercase text-[10px]">Tech Stack</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Built With
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {techStack.map((tech, i) => (
          <motion.div
            key={tech.name}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={techVariants}
            className="group/tech relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 cursor-default hover:border-secondary/30 hover:bg-card/60 transition-all duration-500 text-center"
          >
            {/* Top edge neon line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-secondary/0 group-hover/tech:bg-secondary/40 group-hover/tech:shadow-[0_0_10px_hsl(var(--secondary)/0.3)] transition-all duration-500" />

            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/[0.02] border border-secondary/15 flex items-center justify-center group-hover/tech:scale-110 group-hover/tech:border-secondary/30 group-hover/tech:shadow-[0_0_25px_hsl(var(--secondary)/0.25)] transition-all duration-500">
              <tech.icon className="w-7 h-7 text-secondary/80 group-hover/tech:text-secondary group-hover/tech:drop-shadow-[0_0_8px_hsl(var(--secondary)/0.5)] transition-all duration-500" />
            </div>
            <div className="relative">
              <span className="font-body text-sm font-semibold text-foreground group-hover/tech:text-secondary transition-colors duration-400">{tech.name}</span>
              <p className="font-mono text-[9px] text-muted-foreground mt-1 tracking-[0.15em] uppercase group-hover/tech:text-muted-foreground/80 transition-all duration-500">{tech.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
