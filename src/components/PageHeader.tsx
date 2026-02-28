import { Link } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  breadcrumb?: string;
  subtitle?: string;
}

export default function PageHeader({ title, breadcrumb, subtitle }: Props) {
  return (
    <section className="relative py-12 sm:py-16 text-center overflow-hidden bg-[hsl(230,15%,6%)] dark:bg-[hsl(230,15%,4%)]">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-white/[0.02] blur-[100px]" />
        <div className="absolute top-0 right-[15%] w-32 h-32 rounded-full bg-[hsl(var(--gold))]/[0.04] blur-3xl" />
      </div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/20 to-transparent" />

      <div className="relative z-10 container px-4">
        {/* Breadcrumb */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] mb-5 animate-fade-in">
          <Link to="/" className="font-body text-[11px] text-white/40 hover:text-white/70 transition-colors duration-200">Home</Link>
          <ChevronRight className="w-3 h-3 text-white/20" />
          <span className="font-body text-[11px] font-semibold text-[hsl(var(--gold))]">{breadcrumb || title}</span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white animate-fade-in-up">
          {title}
        </h1>

        {subtitle && (
          <p className="font-body text-sm sm:text-base mt-3 text-white/40 max-w-xl mx-auto animate-slide-up animation-delay-200 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Gold divider */}
        <div className="mt-6 flex items-center gap-3 justify-center animate-fade-in-up animation-delay-400">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[hsl(var(--gold))]/30 to-[hsl(var(--gold))]/50" />
          <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--gold))]/60" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent via-[hsl(var(--gold))]/30 to-[hsl(var(--gold))]/50" />
        </div>
      </div>
    </section>
  );
}
