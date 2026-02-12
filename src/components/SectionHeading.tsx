interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true, light = false }: Props) {
  return (
    <div className={`mb-10 ${centered ? "text-center" : ""}`}>
      <h2 className={`font-display text-3xl md:text-4xl font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 font-body text-base max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-1 w-16 rounded-full bg-secondary ${centered ? "mx-auto" : ""}`} />
    </div>
  );
}
