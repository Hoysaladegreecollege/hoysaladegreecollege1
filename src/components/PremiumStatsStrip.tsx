import { LucideIcon } from "lucide-react";

interface StatItem {
  icon?: LucideIcon;
  emoji?: string;
  value: string;
  label: string;
}

const colorThemes = [
  { bg: "bg-blue-500/15", shadow: "shadow-blue-500/20", color: "#60a5fa" },
  { bg: "bg-emerald-500/15", shadow: "shadow-emerald-500/20", color: "#34d399" },
  { bg: "bg-amber-500/15", shadow: "shadow-amber-500/20", color: "#fbbf24" },
  { bg: "bg-purple-500/15", shadow: "shadow-purple-500/20", color: "#a78bfa" },
];

export default function PremiumStatsStrip({ stats }: { stats: StatItem[] }) {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Ultra-premium dark graphite background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(230,12%,6%) 0%, hsl(228,14%,9%) 50%, hsl(230,10%,5%) 100%)",
        }}
      />
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, hsl(var(--gold)), transparent 70%)",
        }}
      />
      {/* Top gold accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.2) 50%, transparent 90%)",
        }}
      />
      {/* Bottom gold accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 10%, hsl(var(--gold) / 0.15) 50%, transparent 90%)",
        }}
      />

      <div className="relative container px-4">
        <div className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => {
              const theme = colorThemes[i % colorThemes.length];
              return (
                <div
                  key={s.label}
                  className="group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {s.icon ? (
                    <div
                      className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg ${theme.shadow} border border-white/[0.06]`}
                    >
                      <s.icon
                        className="w-6 h-6"
                        style={{ color: theme.color }}
                      />
                    </div>
                  ) : s.emoji ? (
                    <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                      {s.emoji}
                    </div>
                  ) : null}
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white/90">
                    {s.value}
                  </div>
                  <div className="font-body text-[10px] text-white/40 mt-1.5 uppercase tracking-widest">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
