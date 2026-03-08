import { Code2, Cpu, Palette, Database, Shield, Rocket, Zap, Layers } from "lucide-react";

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

export function TechStack() {
  return (
    <div className="max-w-4xl mx-auto mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-xs font-body font-medium mb-3">
          <Rocket className="w-3.5 h-3.5" />
          Technology
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
          Built With
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {techStack.map((tech, i) => (
          <div
            key={tech.name}
            className="group/tech relative overflow-hidden flex flex-col items-center gap-3 p-5 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/30 cursor-default hover:border-secondary/25 hover:bg-card/70 hover:shadow-[0_10px_40px_-10px_hsl(var(--secondary)/0.15)] hover:-translate-y-2 transition-all duration-500 text-center"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            {/* Background radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--secondary)/0.06),transparent_70%)] opacity-0 group-hover/tech:opacity-100 transition-opacity duration-600" />
            {/* Shimmer sweep */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover/tech:translate-x-full transition-transform duration-[1.2s] ease-in-out" />

            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/[0.02] border border-secondary/10 flex items-center justify-center group-hover/tech:scale-110 group-hover/tech:border-secondary/25 group-hover/tech:shadow-[0_0_25px_hsl(var(--secondary)/0.2)] group-hover/tech:rotate-3 transition-all duration-500">
              <tech.icon className="w-7 h-7 text-secondary/80 group-hover/tech:text-secondary group-hover/tech:scale-110 transition-all duration-500" />
            </div>
            <div className="relative">
              <span className="font-body text-sm font-semibold text-foreground group-hover/tech:text-secondary transition-colors duration-400">{tech.name}</span>
              <p className="font-body text-[10px] text-muted-foreground mt-0.5 tracking-wide group-hover/tech:tracking-widest transition-all duration-500">{tech.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
