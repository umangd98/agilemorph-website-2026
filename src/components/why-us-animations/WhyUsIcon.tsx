import { SanityImage, hasImageAsset } from "@/components/SanityImage";
import type { WhyUsItem } from "@/sanity/types";

type WhyUsIconProps = {
  item: WhyUsItem;
  size?: "sm" | "md";
  className?: string;
};

const SIZE = {
  sm: { box: "h-8 w-8", img: 20 },
  md: { box: "h-11 w-11", img: 28 },
} as const;

export function WhyUsIcon({ item, size = "md", className = "" }: WhyUsIconProps) {
  const dims = SIZE[size];

  if (!hasImageAsset(item.icon)) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-muted ${dims.box} ${className}`}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-primary/10 ${dims.box} ${className}`}
      aria-hidden
    >
      <SanityImage
        image={item.icon!}
        alt={item.icon!.alt ?? item.title}
        width={dims.img}
        height={dims.img}
        className={`object-contain ${size === "sm" ? "h-5 w-5" : "h-7 w-7"}`}
      />
    </div>
  );
}
