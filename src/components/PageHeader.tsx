import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  breadcrumb?: string;
  subtitle?: string;
}

export default function PageHeader({ title, breadcrumb, subtitle }: Props) {
  return (
    <section className="page-header py-20 sm:py-28 text-center text-primary-foreground relative">
      {/* Enhanced decorative elements */}
      <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-secondary/5 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-[10%] w-40 h-40 rounded-full bg-primary-foreground/3 blur-3xl animate-float animation-delay-400" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-secondary/3 blur-[100px]" />
      
      <div className="relative z-10 container px-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary-foreground/8 border border-primary-foreground/10 mb-6 backdrop-blur-sm animate-fade-in">
          <Link to="/" className="font-body text-xs opacity-60 hover:opacity-100 transition-opacity hover:text-secondary">Home</Link>
          <span className="text-xs opacity-30">/</span>
          <span className="font-body text-xs font-medium text-secondary">{breadcrumb || title}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-sm sm:text-base mt-4 opacity-50 max-w-xl mx-auto animate-fade-in-up animation-delay-200">{subtitle}</p>
        )}
        <div className="mt-8 flex items-center gap-3 justify-center animate-fade-in-up animation-delay-400">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary/40" />
          <Sparkles className="w-4 h-4 text-secondary/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary/40" />
        </div>
      </div>
    </section>
  );
}
