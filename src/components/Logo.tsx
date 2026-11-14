import Image from "next/image";
import Link from "next/link";

import { BRAND_LOGO } from "@/lib/brand";

export function Logo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Agilemorph home">
      <Image
        src={BRAND_LOGO.black}
        alt={BRAND_LOGO.alt}
        width={BRAND_LOGO.width}
        height={BRAND_LOGO.height}
        priority={priority}
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  );
}
