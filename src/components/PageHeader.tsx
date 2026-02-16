import { Link } from "react-router-dom";

interface Props {
  title: string;
  breadcrumb?: string;
  subtitle?: string;
}

export default function PageHeader({ title, breadcrumb, subtitle }: Props) {
  return (
    <section className="page-header py-16 sm:py-20 text-center text-primary-foreground">
      <div className="relative z-10 container px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/10 mb-5">
          <Link to="/" className="font-body text-xs opacity-70 hover:opacity-100 transition-opacity">Home</Link>
          <span className="text-xs opacity-40">/</span>
          <span className="font-body text-xs font-medium">{breadcrumb || title}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-sm sm:text-base mt-3 opacity-60 max-w-xl mx-auto">{subtitle}</p>
        )}
        <div className="mt-6 flex items-center gap-2 justify-center">
          <div className="h-px w-12 bg-secondary/40" />
          <div className="w-2 h-2 rounded-full bg-secondary/60" />
          <div className="h-px w-12 bg-secondary/40" />
        </div>
      </div>
    </section>
  );
}
