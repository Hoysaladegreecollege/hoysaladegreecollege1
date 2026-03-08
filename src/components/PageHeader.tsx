import { Link } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  breadcrumb?: string;
  subtitle?: string;
}

export default function PageHeader({ title, breadcrumb, subtitle }: Props) {
  return (
    <section className="relative py-14 sm:py-20 text-center overflow-hidden bg-[hsl(230,15%,6%)] dark:bg-[hsl(230,15%,4%)]">
      {/* Multi-layer ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-white/[0.015] blur-[120px]" />
        <div className="absolute top-0 right-[15%] w-40 h-40 rounded-full bg-[hsl(var(--gold))]/[0.04] blur-[60px]" />
        <div className="absolute bottom-0 left-[20%] w-32 h-32 rounded-full bg-primary/[0.03] blur-[50px]" />
      </div>

      {/* Diagonal line pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 40px)" }} />

      {/* Top + bottom accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/25 to-transparent" />

      <div className="relative z-10 container px-4">
        {/* Breadcrumb pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.07] mb-6 animate-fade-in backdrop-blur-sm">
          <Link to="/" className="font-body text-[11px] text-white/35 hover:text-white/70 transition-colors duration-200">Home</Link>
          <ChevronRight className="w-3 h-3 text-white/15" />
          <span className="font-body text-[11px] font-semibold text-[hsl(var(--gold))]">{breadcrumb || title}</span>
        </div>

        <h1 className="font-display text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-[-0.02em] text-white animate-fade-in-up">
          {title}
        </h1>

        {subtitle && (
          <p className="font-body text-sm sm:text-[15px] mt-4 text-white/35 max-w-xl mx-auto animate-slide-up animation-delay-200 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Premium divider */}
        <div className="mt-7 flex items-center gap-3 justify-center animate-fade-in-up animation-delay-400">
          <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/25 to-[hsl(var(--gold))]/50" />
          <div className="relative">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold))]/50" />
            <div className="absolute inset-0 blur-md bg-[hsl(var(--gold))]/20" />
          </div>
          <div className="h-[1.5px] w-10 bg-gradient-to-l from-transparent via-[hsl(var(--gold))]/25 to-[hsl(var(--gold))]/50" />
        </div>
      </div>
    </section>
  );
}
