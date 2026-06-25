"use client";

import { useEffect, useState } from "react";

import { hasImageAsset } from "@/components/SanityImage";
import { urlForImage } from "@/sanity/image";
import type { SanityImageAsset } from "@/sanity/types";

const MAX_PROCESS_WIDTH = 560;

function resolveImageUrl(image: SanityImageAsset) {
  return image.asset?.url ?? urlForImage(image).format("png").url();
}

function keyOutFakeTransparency(imageData: ImageData) {
  const { data, width, height } = imageData;
  const total = width * height;
  const removable = new Uint8Array(total);

  for (let i = 0; i < total; i += 1) {
    const offset = i * 4;
    const r = data[offset]!;
    const g = data[offset + 1]!;
    const b = data[offset + 2]!;
    const a = data[offset + 3]!;

    if (a < 10) continue;

    const channelSpread = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    if (channelSpread > 14) continue;

    const brightness = (r + g + b) / 3;
    if ((brightness >= 168 && brightness <= 236) || brightness >= 242) {
      removable[i] = 1;
    }
  }

  const connected = new Uint8Array(total);
  const queue = new Uint32Array(total);
  let head = 0;
  let tail = 0;

  const tryEnqueue = (index: number) => {
    if (index < 0 || index >= total || !removable[index] || connected[index]) return;
    connected[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    tryEnqueue(x);
    tryEnqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    tryEnqueue(y * width);
    tryEnqueue(y * width + (width - 1));
  }

  while (head < tail) {
    const index = queue[head++]!;
    const x = index % width;
    const y = (index - x) / width;

    if (x > 0) tryEnqueue(index - 1);
    if (x < width - 1) tryEnqueue(index + 1);
    if (y > 0) tryEnqueue(index - width);
    if (y < height - 1) tryEnqueue(index + width);
  }

  for (let i = 0; i < total; i += 1) {
    if (connected[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  return imageData;
}

async function processPortrait(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.decoding = "async";
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error(`Failed to decode image: ${url}`));
      element.src = blobUrl;
    });

    const scale = Math.min(1, MAX_PROCESS_WIDTH / img.naturalWidth);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas unavailable");
    }

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    keyOutFakeTransparency(imageData);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

type TransparentKeyedImageProps = {
  image?: SanityImageAsset;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function TransparentKeyedImage({
  image,
  alt,
  className = "",
  priority = false,
}: TransparentKeyedImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  const imageUrl = hasImageAsset(image) ? resolveImageUrl(image) : null;

  useEffect(() => {
    if (!imageUrl) {
      setSrc(null);
      return;
    }

    let cancelled = false;

    processPortrait(imageUrl)
      .then((dataUrl) => {
        if (!cancelled) setSrc(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(imageUrl);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  if (!hasImageAsset(image)) return null;

  if (!src) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    // Native img keeps processed PNG alpha without Next.js recompression.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
