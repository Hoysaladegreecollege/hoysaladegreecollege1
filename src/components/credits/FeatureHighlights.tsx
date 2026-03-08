import { Sparkles, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  "Multi-role dashboards (Admin, Teacher, Student, Principal)",
  "Real-time attendance tracking & analytics",
  "Fee management with email & WhatsApp reminders",
  "Push notifications for instant alerts",
  "Admission application portal with tracking",
  "Study materials & timetable management",
  "Birthday wishes automation",
  "Top ranker showcase with achievements",
];

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export function FeatureHighlights() {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/5 border border-secondary/15 text-secondary text-xs font-mono font-medium mb-3 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-[0.2em] uppercase text-[10px]">Feature Matrix</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          What's Inside
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="group/f relative flex items-start gap-4 p-5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 overflow-hidden cursor-default hover:border-secondary/25 hover:bg-card/60 hover:shadow-[0_0_25px_hsl(var(--secondary)/0.08),inset_0_0_15px_hsl(var(--secondary)/0.02)] hover:-translate-y-0.5 transition-all duration-400"
          >
            {/* Shimmer on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover/f:translate-x-full transition-transform duration-[1s]" />
            {/* Neon left accent line */}
            <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-secondary/0 group-hover/f:bg-secondary/50 group-hover/f:shadow-[0_0_8px_hsl(var(--secondary)/0.4)] transition-all duration-500" />

            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/15 flex items-center justify-center shrink-0 mt-0.5 group-hover/f:scale-110 group-hover/f:border-secondary/30 group-hover/f:shadow-[0_0_15px_hsl(var(--secondary)/0.2)] transition-all duration-400">
              <ChevronRight className="w-3.5 h-3.5 text-secondary group-hover/f:translate-x-0.5 transition-transform duration-300" />
            </div>
            <span className="relative font-body text-sm text-foreground/90 leading-relaxed group-hover/f:text-foreground transition-colors duration-300">{feature}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
