import Link from "next/link";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-foreground";
  const subColor =
    variant === "light" ? "text-white/70" : "text-muted-foreground";
  const chevronColor = variant === "light" ? "#ffffff" : "#111827";

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 24L16 14L28 24"
          stroke={chevronColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 18L16 8L28 18"
          stroke={chevronColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 12L16 2L28 12"
          stroke={chevronColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          className={`font-heading text-sm font-bold tracking-widest uppercase ${textColor}`}
        >
          AgileMorph
        </span>
        <span className={`font-body text-[9px] tracking-widest uppercase ${subColor}`}>
          Digital Accelerators
        </span>
      </div>
    </Link>
  );
}
