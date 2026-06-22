import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { SanityImageAsset } from "@/sanity/types";

type CompanyStorySectionProps = {
  heading?: string;
  body?: string;
  promiseHeading?: string;
  promise?: string;
  image?: SanityImageAsset;
};

export function CompanyStorySection({
  heading,
  body,
  promiseHeading,
  promise,
  image,
}: CompanyStorySectionProps) {
  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="company-story-heading">
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <AnimateOnScroll className="min-w-0">
            {heading ? (
              <h2
                id="company-story-heading"
                className="mb-6 font-heading text-4xl font-extrabold text-foreground"
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
              <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                {promiseHeading ? (
                  <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                    {promiseHeading}
                  </h3>
                ) : null}
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {promise}
                </p>
              </div>
            ) : null}
          </AnimateOnScroll>

          {image ? (
            <AnimateOnScroll delay={150} className="min-w-0">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-background p-6">
                <SanityImage
                  image={image}
                  alt={image.alt ?? heading ?? "AgileMorph"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain p-4"
                />
              </div>
            </AnimateOnScroll>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
