import Link from "next/link";

import { BRAND_LOGO } from "@/lib/brand";

type LogoProps = {
  /** Force white logo on dark surfaces (e.g. hero navbar overlay). */
  onDarkSurface?: boolean;
  /** Manual override: dark = black logo, light = white logo. */
  variant?: "dark" | "light";
  className?: string;
  priority?: boolean;
};

export function Logo({
  onDarkSurface = false,
  variant,
  className = "",
  priority = false,
}: LogoProps) {
  const imgClass = "h-9 w-auto sm:h-10";

  if (variant === "light" || variant === "dark") {
    const src = variant === "light" ? BRAND_LOGO.white : BRAND_LOGO.black;
    return (
      <Link href="/" className={`inline-flex items-center ${className}`}>
        <img
          src={src}
          alt={BRAND_LOGO.alt}
          width={BRAND_LOGO.width}
          height={BRAND_LOGO.height}
          className={imgClass}
          fetchPriority={priority ? "high" : undefined}
        />
      </Link>
    );
  }

  const showWhite = onDarkSurface;

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <img
        src={BRAND_LOGO.black}
        alt={BRAND_LOGO.alt}
        width={BRAND_LOGO.width}
        height={BRAND_LOGO.height}
        className={`${imgClass} ${showWhite ? "hidden" : "block dark:hidden"}`}
        fetchPriority={priority ? "high" : undefined}
      />
      <img
        src={BRAND_LOGO.white}
        alt=""
        aria-hidden
        width={BRAND_LOGO.width}
        height={BRAND_LOGO.height}
        className={`${imgClass} ${showWhite ? "block" : "hidden dark:block"}`}
        fetchPriority={priority ? "high" : undefined}
      />
    </Link>
  );
}
