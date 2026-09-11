import Image from "next/image";

import { type CoverFormat, coverUrl } from "@/lib/blog-cover";

type GeneratedCoverProps = {
  slug: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  format?: CoverFormat;
};

/**
 * Stand-in for posts without an uploaded cover. The image is rendered by the
 * /blog/[slug]/cover route and already sized, so it skips the optimizer. It is
 * decorative: the post title always sits next to or directly above it.
 */
export function GeneratedCover({
  slug,
  sizes,
  className,
  priority,
  format = "landscape",
}: GeneratedCoverProps) {
  return (
    <Image
      src={coverUrl(slug, format)}
      alt=""
      fill
      unoptimized
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
