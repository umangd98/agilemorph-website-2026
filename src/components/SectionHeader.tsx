type SectionHeaderProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
  className?: string;
  headingClassName?: string;
};

export function SectionHeader({
  id,
  eyebrow,
  heading,
  subheading,
  align = "center",
  className = "",
  headingClassName = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow ? (
        <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2
        id={id}
        className={`font-heading font-bold tracking-tight text-foreground ${headingClassName}`}
      >
        {heading}
      </h2>
      {subheading ? (
        <p className="font-body max-w-2xl text-base leading-relaxed text-muted-foreground">
          {subheading}
        </p>
      ) : null}
    </div>
  );
}
