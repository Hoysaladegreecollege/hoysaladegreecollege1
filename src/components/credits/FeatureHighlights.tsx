import { Sparkles, Star } from "lucide-react";

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

export function FeatureHighlights() {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-xs font-body font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Feature Highlights
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          What's Inside
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {features.map((feature, i) => (
          <div
            key={i}
            className="group/f relative flex items-start gap-4 p-5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 overflow-hidden cursor-default hover:border-secondary/20 hover:bg-card/70 hover:shadow-[0_8px_30px_-10px_hsl(var(--secondary)/0.12)] hover:-translate-y-0.5 transition-all duration-400"
            style={{ transitionDelay: `${i * 40}ms` }}
          >
            {/* Shimmer on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover/f:translate-x-full transition-transform duration-[1s]" />
            {/* Left accent line */}
            <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-secondary/0 group-hover/f:bg-secondary/40 rounded-full transition-all duration-500" />

            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/f:scale-110 group-hover/f:rotate-6 group-hover/f:shadow-[0_0_15px_hsl(var(--secondary)/0.15)] transition-all duration-400">
              <Star className="w-3.5 h-3.5 text-secondary group-hover/f:animate-[creditsPulseGlow_1.5s_ease-in-out_infinite]" />
            </div>
            <span className="relative font-body text-sm text-foreground/90 leading-relaxed group-hover/f:text-foreground transition-colors duration-300">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
