import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true, light = false }: Props) {
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      <h2 className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 font-body text-sm sm:text-base max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
        <div className="h-px w-10 rounded-full bg-gradient-to-r from-transparent to-secondary" />
        <Sparkles className={`w-3.5 h-3.5 ${light ? "text-secondary/60" : "text-secondary"}`} />
        <div className="h-px w-20 rounded-full bg-secondary" />
        <Sparkles className={`w-3.5 h-3.5 ${light ? "text-secondary/60" : "text-secondary"}`} />
        <div className="h-px w-10 rounded-full bg-gradient-to-l from-transparent to-secondary" />
      </div>
    </div>
  );
}
