import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { SanityImageAsset } from "@/sanity/types";

type FounderSectionProps = {
  eyebrow?: string;
  heading?: string;
  name?: string;
  role?: string;
  bio?: string;
  image?: SanityImageAsset;
};

export function FounderSection({
  eyebrow,
  heading,
  name,
  role,
  bio,
  image,
}: FounderSectionProps) {
  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="founder-heading">
      <Container>
        <AnimateOnScroll className="mb-12 text-center">
          {eyebrow ? (
            <p className="mb-3 font-body text-xs font-bold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2
              id="founder-heading"
              className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl"
            >
              {heading}
            </h2>
          ) : null}
        </AnimateOnScroll>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <AnimateOnScroll delay={150} className="order-2 min-w-0 lg:order-1">
            {name ? (
              <h3 className="mb-2 font-heading text-3xl font-extrabold text-foreground">
                {name}
              </h3>
            ) : null}
            {role ? (
              <p className="mb-6 font-body text-sm font-bold uppercase tracking-widest text-primary">
                {role}
              </p>
            ) : null}
            {bio ? (
              <div className="space-y-4 font-body text-base leading-relaxed text-muted-foreground">
                {bio.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </AnimateOnScroll>

          {image ? (
            <AnimateOnScroll className="order-1 min-w-0 lg:order-2">
              <div className="relative mx-auto aspect-3/4 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-lg">
                <SanityImage
                  image={image}
                  alt={image.alt ?? name ?? "Founder"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </AnimateOnScroll>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
