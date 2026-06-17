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
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-[#0b1628]">
      {isSvg ? (
        // Animated SVGs only play their embedded CSS when served as a raw
        // <img> src — Next/Image would optimize/rasterize and freeze them.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
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
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
