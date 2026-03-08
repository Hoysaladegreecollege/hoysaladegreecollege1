import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true, light = false }: Props) {
  return (
    <div className={`mb-14 sm:mb-16 ${centered ? "text-center" : ""}`}>
      {/* Premium label chip */}
      <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full mb-5 border ${
        light 
          ? "bg-white/[0.06] border-white/[0.08]" 
          : "bg-secondary/[0.06] border-secondary/[0.12]"
      }`}>
        <Sparkles className={`w-3 h-3 ${light ? "text-secondary/60" : "text-secondary"} animate-sparkle`} />
        <span className={`font-body text-[10px] font-bold tracking-[0.2em] uppercase ${
          light ? "text-white/50" : "text-secondary"
        }`}>
          {title.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>

      <h2 className={`font-display text-[1.65rem] sm:text-3xl md:text-[2.5rem] font-bold leading-[1.15] tracking-[-0.01em] ${
        light ? "text-primary-foreground" : "text-foreground"
      }`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 font-body text-sm sm:text-[15px] max-w-2xl leading-relaxed ${centered ? "mx-auto" : ""} ${
          light ? "text-primary-foreground/50" : "text-muted-foreground"
        }`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 flex items-center gap-2.5 ${centered ? "justify-center" : ""}`}>
        <div className="h-[1.5px] w-8 rounded-full bg-gradient-to-r from-transparent to-secondary/70" />
        <div className="relative w-1.5 h-1.5 rounded-full bg-secondary">
          <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-30" />
        </div>
        <div className="h-[1.5px] w-16 rounded-full bg-secondary/80" />
        <div className="relative w-1.5 h-1.5 rounded-full bg-secondary">
          <div className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-30" style={{ animationDelay: "0.3s" }} />
        </div>
        <div className="h-[1.5px] w-8 rounded-full bg-gradient-to-l from-transparent to-secondary/70" />
      </div>
    </div>
  );
}
