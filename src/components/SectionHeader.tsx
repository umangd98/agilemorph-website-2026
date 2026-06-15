type SectionHeaderProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
  headingClassName?: string;
  lightMode?: boolean;
};

export function SectionHeader({
  id,
  eyebrow,
  heading,
  subheading,
  align = "center",
  className = "",
  headingClassName = "",
  lightMode = false,
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "items-start";
  const textColor = lightMode ? "text-white" : "text-foreground";
  const mutedColor = lightMode ? "text-white/70" : "text-muted-foreground";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow ? (
        <span
          className={`font-body text-xs font-semibold uppercase tracking-widest ${lightMode ? "text-primary" : "text-accent"}`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className={`font-heading font-bold tracking-tight ${textColor} ${headingClassName}`}
      >
        {heading}
      </h2>
      {subheading ? (
        <p className={`font-body max-w-2xl text-base leading-relaxed ${mutedColor}`}>
          {subheading}
        </p>
      ) : null}
    </div>
  );
}
