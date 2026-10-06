import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@/sanity/types";
export function HeroTagline({ value }: { value?: PortableTextBlock[] }) {
  return value?.length ? <PortableText value={value} /> : null;
}
