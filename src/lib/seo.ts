import type { Metadata } from "next";

import { urlForImage } from "@/sanity/image";
import type { SanityImageAsset, Seo } from "@/sanity/types";

function hasOgImage(image: SanityImageAsset): boolean {
  return Boolean(image.asset?._ref || image.asset?._id || image.asset?.url);
}

export function seoToMetadata(
  seo: Seo | undefined,
  fallback: Metadata,
): Metadata {
  if (!seo) return fallback;

  const ogImageUrl =
    seo.ogImage && hasOgImage(seo.ogImage)
      ? urlForImage(seo.ogImage).width(1200).height(630).url()
      : undefined;

  return {
    ...fallback,
    title: seo.title ?? fallback.title,
    description: seo.description ?? fallback.description,
    openGraph: {
      title: seo.title ?? undefined,
      description: seo.description ?? undefined,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
