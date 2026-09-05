import { ArrowRight } from "lucide-react";

import { Container, StatusDot } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { CtaAction } from "@/components/CtaAction";
import type { CtaButton } from "@/sanity/types";

type ServiceCtaSectionProps = {
  heading?: string;
  description?: string;
  button?: CtaButton;
};

export function ServiceCtaSection({
  heading,
  description,
  button,
}: ServiceCtaSectionProps) {
  if (!heading && !description) return null;

  return (
    <section
      className="relative overflow-hidden border-t border-line py-28 sm:py-36"
      aria-label={heading}
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
            Ready when you are
          </span>
          {heading ? (
            <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.025em] text-fg sm:text-5xl lg:text-6xl">
              {heading}
            </h2>
          ) : null}
          {description ? (
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {description}
            </p>
          ) : null}
          {button ? (
            <div className="mt-10 flex justify-center">
              <CtaAction
                cta={button}
                className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90"
              >
                {button.label}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </CtaAction>
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
