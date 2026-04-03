import { Zap } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface PointItem {
  label: string;
  detail: string;
  value: number;
  gradient: string;
  pct: number;
}

interface Props {
  items: PointItem[];
}

export default function PointsBreakdown({ items }: Props) {
  return (
    <div className="bg-card border border-border/40 rounded-3xl p-6 gamify-card-enter relative overflow-hidden" style={{ animationDelay: "0.3s" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      <h3 className="font-display text-base font-bold text-foreground mb-5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-secondary" />
        </div>
        Points Breakdown
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="space-y-2 p-3.5 rounded-2xl bg-muted/10 border border-border/20 hover:border-border/40 transition-all duration-300 group"
            style={{ animationDelay: `${0.35 + i * 0.08}s` }}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-body text-sm font-semibold text-foreground">{item.label}</span>
                <span className="font-body text-xs text-muted-foreground ml-2">{item.detail}</span>
              </div>
              <AnimatedCounter
                value={item.value}
                suffix=" pts"
                className="font-display text-sm font-bold text-foreground"
              />
            </div>
            <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full gamify-progress-fill relative overflow-hidden"
                style={{
                  width: `${Math.min(item.pct, 100)}%`,
                  background: item.gradient,
                  animationDelay: `${0.4 + i * 0.1}s`,
                }}
              >
                <div className="absolute inset-0 gamify-progress-bar bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
