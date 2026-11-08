import { Reveal } from "@/components/Reveal";
import { StackTag } from "@/components/ui";
import type { CapabilityDetail } from "@/sanity/types";

import { FdeSection } from "./FdeSection";

type CapabilityListSectionProps = {
  index: string;
  capabilities?: CapabilityDetail[];
};

/** One row per capability, each with its own anchor so other pages can link in. */
export function CapabilityListSection({ index, capabilities = [] }: CapabilityListSectionProps) {
  if (!capabilities.length) return null;

  return (
    <FdeSection index={index} eyebrow="Capabilities">
      <Reveal>
        <nav aria-label="Capabilities on this page" className="mb-12 flex flex-wrap gap-2">
          {capabilities.map((capability) => (
            <a
              key={capability.anchor}
              href={`#${capability.anchor}`}
              className="rounded-full border border-line bg-bg-elevated px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              {capability.title}
            </a>
          ))}
        </nav>
      </Reveal>

      <ol className="border-b border-line">
        {capabilities.map((capability, i) => (
          <li key={capability.anchor} id={capability.anchor} className="scroll-mt-28">
            <Reveal className="grid gap-6 border-t border-line py-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12">
              <div className="min-w-0">
                <span className="tnum font-mono text-xs text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.02em] text-fg sm:text-3xl">
                  {capability.title}
                </h2>
                {capability.summary ? (
                  <p className="mt-4 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
                    {capability.summary}
                  </p>
                ) : null}
                {capability.tools?.length ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {capability.tools.map((tool) => (
                      <StackTag key={tool}>{tool}</StackTag>
                    ))}
                  </div>
                ) : null}
              </div>
              {capability.points?.length ? (
                <ul className="flex min-w-0 flex-col gap-3 md:pt-7">
                  {capability.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg-muted sm:text-base"
                    >
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                      <span className="min-w-0">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </FdeSection>
  );
}
