"use client";

import Image from "next/image";
import { useState } from "react";

import { ServiceHeroAnim } from "@/components/service-animations";

type ServiceHeroMediaProps = {
  slug: string;
  imageUrl?: string;
  alt: string;
  blurDataURL?: string;
  isSvg?: boolean;
};

export function ServiceHeroMedia({
  slug,
  imageUrl,
  alt,
  blurDataURL,
  isSvg = false,
}: ServiceHeroMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!imageUrl || failed) {
    return <ServiceHeroAnim slug={slug} />;
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-linear-to-br from-surface via-surface to-mint/40 dark:border-border/80 dark:from-background dark:via-background dark:to-primary/10">
      {isSvg ? (
        // Animated SVGs only play their embedded CSS when served as a raw
        // <img> src - Next/Image would optimize/rasterize and freeze them.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.92] dark:contrast-[1.08] dark:saturate-[0.95]"
          onError={() => setFailed(true)}
        />
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          className="object-cover dark:brightness-[0.94] dark:contrast-[1.05]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
