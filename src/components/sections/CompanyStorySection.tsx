import { Sparkles } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { CompanyStoryArtwork } from "@/components/sections/CompanyStoryArtwork";

type CompanyStorySectionProps = {
  heading?: string;
  body?: string;
  promiseHeading?: string;
  promise?: string;
};

export function CompanyStorySection({
  heading,
  body,
  promiseHeading,
  promise,
}: CompanyStorySectionProps) {
  return (
    <section className="border-t border-line py-24 sm:py-32" aria-labelledby="company-story-heading">
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <AnimateOnScroll className="min-w-0">
            <div className="rounded-3xl border border-line bg-bg-elevated p-6 sm:p-8">
              {heading ? (
                <h2
                  id="company-story-heading"
                  className="mb-6 font-heading text-3xl font-extrabold text-foreground sm:text-4xl"
                >
                  {heading}
                </h2>
              ) : null}
              {body ? (
                <div className="space-y-4 font-body text-base leading-relaxed text-muted-foreground">
                  {body.split("\n\n").map((paragraph) => (
                    <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {promise ? (
                <div className="mt-10 rounded-2xl border border-primary/20 border-l-4 border-l-primary bg-primary/5 p-6">
                  <div className="mb-3 flex items-center gap-2 text-primary">
                    <Sparkles size={16} aria-hidden />
                    {promiseHeading ? (
                      <h3 className="font-heading text-xl font-bold text-foreground">
                        {promiseHeading}
                      </h3>
                    ) : null}
                  </div>
                  <p className="font-body text-sm leading-relaxed text-muted-foreground">
                    {promise}
                  </p>
                </div>
              ) : null}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={150} className="min-w-0">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-line bg-bg-raised">
              {/* faint blueprint grid to seat the line art in the console aesthetic */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--color-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <CompanyStoryArtwork className="relative" />
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  );
}
