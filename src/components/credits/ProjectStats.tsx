import { Layers, Code2, Database, Zap } from "lucide-react";

const projectStats = [
  { label: "Pages Built", value: "40+", icon: Layers },
  { label: "Components", value: "80+", icon: Code2 },
  { label: "Database Tables", value: "25+", icon: Database },
  { label: "Edge Functions", value: "8+", icon: Zap },
];

export function ProjectStats() {
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {projectStats.map((stat, i) => (
          <div
            key={stat.label}
            className="group/stat relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-xl p-6 text-center cursor-default hover:border-secondary/25 hover:shadow-[0_10px_40px_-10px_hsl(var(--secondary)/0.15)] hover:-translate-y-2 transition-all duration-500"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.03] to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-secondary/[0.05] to-transparent rounded-bl-full opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />

            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/10 flex items-center justify-center mx-auto mb-3 group-hover/stat:scale-125 group-hover/stat:bg-secondary/20 group-hover/stat:border-secondary/25 group-hover/stat:shadow-[0_0_20px_hsl(var(--secondary)/0.2)] transition-all duration-500">
                <stat.icon className="w-5 h-5 text-secondary group-hover/stat:rotate-12 transition-transform duration-500" />
              </div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-foreground tabular-nums group-hover/stat:text-secondary transition-colors duration-500">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground mt-1 tracking-wide group-hover/stat:tracking-widest transition-all duration-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
