import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { SanityImageAsset } from "@/sanity/types";

type FeaturedLogosSectionProps = {
  heading?: string;
  logos?: SanityImageAsset[];
};

export function FeaturedLogosSection({
  heading = "We've been featured on",
  logos = [],
}: FeaturedLogosSectionProps) {
  if (!logos.length) return null;

  return (
    <section
      className="border-y border-border bg-background py-section-sm"
      aria-labelledby="featured-logos-heading"
    >
      <Container>
        <AnimateOnScroll className="mb-10 text-center">
          <h2
            id="featured-logos-heading"
            className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-5">
          {logos.map((logo, index) => (
            <AnimateOnScroll key={logo.asset?._ref ?? index} delay={index * 40}>
              <div className="relative mx-auto h-12 w-full max-w-[140px] opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                <SanityImage
                  image={logo}
                  alt={logo.alt ?? `Partner logo ${index + 1}`}
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
