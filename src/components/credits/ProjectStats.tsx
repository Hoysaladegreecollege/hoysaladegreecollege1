import { Layers, Code2, Database, Zap } from "lucide-react";
import { motion } from "framer-motion";

const projectStats = [
  { label: "Pages Built", value: "40+", icon: Layers },
  { label: "Components", value: "80+", icon: Code2 },
  { label: "Database Tables", value: "25+", icon: Database },
  { label: "Edge Functions", value: "8+", icon: Zap },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function ProjectStats() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-secondary/20" />
        <span className="font-mono text-[10px] text-secondary/50 tracking-[0.3em] uppercase">System Metrics</span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-secondary/20" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {projectStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
            className="group/stat relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-xl p-6 text-center cursor-default hover:border-secondary/30 hover:-translate-y-1 transition-all duration-500"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center mx-auto mb-3 group-hover/stat:bg-secondary/20 group-hover/stat:border-secondary/30 transition-all duration-500">
                <stat.icon className="w-5 h-5 text-secondary transition-all duration-500" />
              </div>
              <p className="font-mono text-3xl sm:text-4xl font-bold text-foreground tabular-nums group-hover/stat:text-secondary transition-all duration-500">{stat.value}</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-1.5 tracking-[0.15em] uppercase transition-all duration-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
