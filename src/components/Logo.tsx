import Image from "next/image";
import Link from "next/link";

import { BRAND_LOGO } from "@/lib/brand";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  const src = variant === "light" ? BRAND_LOGO.light : BRAND_LOGO.dark;

  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src={src}
        alt={BRAND_LOGO.alt}
        width={BRAND_LOGO.width}
        height={BRAND_LOGO.height}
        className="h-9 w-auto sm:h-10"
        priority
      />
    </Link>
  );
}
