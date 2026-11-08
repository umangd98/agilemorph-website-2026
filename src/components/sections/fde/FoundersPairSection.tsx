/* eslint-disable @next/next/no-img-element */
import { Reveal } from "@/components/Reveal";
import { hasImageAsset } from "@/components/SanityImage";
import { getInitials } from "@/lib/seo";
import { urlForPortraitImage } from "@/sanity/image";
import type { FoundersBlock } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type FoundersPairSectionProps = {
  id?: string;
  index: string;
  block?: FoundersBlock;
};

/** Founder cards that make the "build fast / build right" contrast explicit. */
export function FoundersPairSection({ id, index, block }: FoundersPairSectionProps) {
  const members = block?.members ?? [];
  if (!members.length) return null;

  return (
    <FdeSection
      id={id}
      index={index}
      eyebrow={block?.eyebrow}
      heading={block?.heading}
      intro={block?.intro}
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {members.map((member, i) => (
          <Reveal as="li" key={member.name} delay={i * 0.08} className="min-w-0">
            <article className="flex h-full flex-col rounded-2xl border border-line bg-bg-elevated p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-bg-raised">
                  {hasImageAsset(member.image) ? (
                    <img
                      src={urlForPortraitImage(member.image).url()}
                      alt={member.image.alt ?? member.name}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-full w-full items-center justify-center font-mono text-sm text-fg-muted"
                    >
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-medium leading-tight tracking-[-0.01em] text-fg">
                    {member.name}
                  </h3>
                  {member.role ? (
                    <p className="mt-1 text-sm text-fg-muted">{member.role}</p>
                  ) : null}
                </div>
                {member.tag ? (
                  <span className="ml-auto hidden shrink-0 rounded-full bg-signal/10 px-3 py-1.5 font-mono text-xs text-signal ring-1 ring-signal/25 sm:inline-flex">
                    {member.tag}
                  </span>
                ) : null}
              </div>
              {member.tag ? (
                <span className="mt-4 inline-flex w-fit rounded-full bg-signal/10 px-3 py-1.5 font-mono text-xs text-signal ring-1 ring-signal/25 sm:hidden">
                  {member.tag}
                </span>
              ) : null}
              {member.bio ? (
                <p className="mt-5 text-pretty text-[0.9375rem] leading-relaxed text-fg-muted sm:text-base">
                  {member.bio}
                </p>
              ) : null}
              {member.points?.length ? (
                <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
                  {member.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[0.9375rem] leading-relaxed text-fg-muted"
                    >
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                      />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          </Reveal>
        ))}
      </ul>
      {block?.note ? (
        <Reveal>
          <p className="mt-10 max-w-3xl text-pretty text-lg font-medium leading-snug tracking-[-0.01em] text-fg sm:text-xl">
            {block.note}
          </p>
        </Reveal>
      ) : null}
    </FdeSection>
  );
}
