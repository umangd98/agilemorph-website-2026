import { Reveal } from "@/components/Reveal";
import type { ProseBlock } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type ProseSectionProps = {
  id?: string;
  index: string;
  block?: ProseBlock;
};

export function ProseSection({ id, index, block }: ProseSectionProps) {
  if (!block?.heading && !block?.body) return null;

  const paragraphs = (block.body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <FdeSection id={id} index={index} eyebrow={block.eyebrow} heading={block.heading}>
      <Reveal>
        <div className="flex max-w-3xl flex-col gap-5">
          {paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-pretty text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </FdeSection>
  );
}
