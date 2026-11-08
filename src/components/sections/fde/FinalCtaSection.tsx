import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

import { Container, StatusDot } from "@/components/ui";
import { CtaAction } from "@/components/CtaAction";
import { Reveal } from "@/components/Reveal";
import { CONTACT_EMAIL } from "@/data/positioning";
import type { CtaBlock } from "@/sanity/types";

/** Closing call to action with the primary booking button and the contact email. */
export function FinalCtaSection({ block }: { block?: CtaBlock }) {
  if (!block?.heading) return null;

  return (
    <section
      className="relative overflow-hidden border-t border-line py-28 sm:py-36"
      aria-label={block.heading}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-80 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 100%, color-mix(in srgb, var(--color-signal) 12%, transparent), transparent 70%)",
        }}
      />
      <Container>
        <Reveal className="text-center">
          <span className="syslabel inline-flex items-center gap-2">
            <StatusDot />
            Start here
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.025em] text-fg sm:text-5xl lg:text-6xl">
            {block.heading}
          </h2>
          {block.description ? (
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {block.description}
            </p>
          ) : null}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {block.button ? (
              <CtaAction
                cta={block.button}
                className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
              >
                {block.button.label}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </CtaAction>
            ) : null}
            {block.secondaryButton ? (
              <Link
                href={block.secondaryButton.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 font-body text-sm font-medium text-fg transition-colors duration-200 hover:border-line-strong hover:bg-bg-elevated"
              >
                {block.secondaryButton.label}
              </Link>
            ) : null}
          </div>
          {block.showEmail !== false ? (
            <p className="mt-8 text-sm text-fg-muted">
              Or email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-1.5 font-medium text-fg underline decoration-line-strong underline-offset-4 hover:text-signal"
              >
                <Mail size={14} aria-hidden />
                {CONTACT_EMAIL}
              </a>
            </p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
