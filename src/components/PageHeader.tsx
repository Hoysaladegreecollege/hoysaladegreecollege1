import { Link } from "react-router-dom";
import { Sparkles, ChevronRight } from "lucide-react";

interface Props {
  title: string;
  breadcrumb?: string;
  subtitle?: string;
}

export default function PageHeader({ title, breadcrumb, subtitle }: Props) {
  return (
    <section className="page-header py-20 sm:py-28 text-center text-primary-foreground relative overflow-hidden">
      {/* Layered ambient orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-8 left-[8%] w-40 h-40 rounded-full bg-secondary/6 blur-3xl animate-hero-float" />
        <div className="absolute bottom-8 right-[8%] w-52 h-52 rounded-full bg-secondary/4 blur-3xl animate-hero-float animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-secondary/3 blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-primary-foreground/2 blur-2xl animate-float animation-delay-200" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <div className="relative z-10 container px-4">
        {/* Breadcrumb pill */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-foreground/8 border border-primary-foreground/12 mb-6 backdrop-blur-sm animate-fade-in shadow-sm">
          <Link to="/" className="font-body text-[11px] opacity-55 hover:opacity-90 transition-opacity hover:text-secondary duration-200">Home</Link>
          <ChevronRight className="w-3 h-3 opacity-30" />
          <span className="font-body text-[11px] font-semibold text-secondary">{breadcrumb || title}</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
          {title}
        </h1>

        {subtitle && (
          <p className="font-body text-sm sm:text-base mt-4 opacity-50 max-w-xl mx-auto animate-slide-up animation-delay-200 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Gold sparkle divider */}
        <div className="mt-8 flex items-center gap-3 justify-center animate-fade-in-up animation-delay-400">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-secondary/50 to-secondary/70" />
          <Sparkles className="w-4 h-4 text-secondary animate-sparkle" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent via-secondary/50 to-secondary/70" />
        </div>
      </div>
    </section>
  );
}
