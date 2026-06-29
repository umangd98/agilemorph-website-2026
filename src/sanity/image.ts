import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "./client";

const builder = createImageUrlBuilder(client);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

/** PNG portrait URL — preserves alpha for leadership cutouts served from Sanity CDN. */
export function urlForPortraitImage(source: SanityImageSource) {
  return urlForImage(source).width(480).format("png").quality(90);
}
