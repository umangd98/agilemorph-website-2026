import type { Metadata } from "next";

import { SHARE_CARDS, shareImageUrl } from "@/lib/share-images";

/**
 * Metadata for a marketing page: title, description, self canonical, and Open
 * Graph and Twitter tags carrying the page's own share card. A page's openGraph
 * replaces the layout's rather than merging with it, so every field is set here.
 */
export function pageMetadata({
  title,
  description,
  path,
  share,
}: {
  title: Metadata["title"];
  description: string;
  path: string;
  share: keyof typeof SHARE_CARDS & string;
}): Metadata {
  const socialTitle = typeof title === "string" ? title : (title as { absolute?: string })?.absolute;
  const image = shareImageUrl(share);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: "Agilemorph",
      url: path,
      title: socialTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: SHARE_CARDS[share]?.headline }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [image] },
  };
}
