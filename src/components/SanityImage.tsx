import Image from "next/image";

import { urlForImage } from "@/sanity/image";
import type { SanityImageAsset } from "@/sanity/types";

type SanityImageBaseProps = {
  image?: SanityImageAsset;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholderLabel?: string;
};

type SanityImageFillProps = SanityImageBaseProps & {
  fill: true;
  width?: never;
  height?: never;
};

type SanityImageFixedProps = SanityImageBaseProps & {
  fill?: false;
  width: number;
  height: number;
};

type SanityImageProps = SanityImageFillProps | SanityImageFixedProps;

function hasImageAsset(
  image?: SanityImageAsset,
): image is SanityImageAsset & {
  asset: NonNullable<SanityImageAsset["asset"]>;
} {
  return Boolean(image?.asset?._ref || image?.asset?._id || image?.asset?.url);
}

function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted text-center ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="px-4 font-body text-sm text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function SanityImage({
  image,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  placeholderLabel = "Image placeholder — add in Sanity Studio",
  ...layoutProps
}: SanityImageProps) {
  if (!hasImageAsset(image)) {
    if (layoutProps.fill) {
      return (
        <ImagePlaceholder
          label={placeholderLabel}
          className={`absolute inset-0 ${className}`}
        />
      );
    }

    return (
      <ImagePlaceholder
        label={placeholderLabel}
        className={`aspect-video w-full ${className}`}
      />
    );
  }

  const imageUrl = urlForImage(image)
    .auto("format")
    .fit("max")
    .url();

  const imageAlt = alt ?? image.alt ?? placeholderLabel;
  const blurDataURL = image.lqip;

  if (layoutProps.fill) {
    return (
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={imageAlt}
      width={layoutProps.width}
      height={layoutProps.height}
      sizes={sizes}
      priority={priority}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      className={className}
    />
  );
}
