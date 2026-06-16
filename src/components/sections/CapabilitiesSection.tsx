import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { CapabilityItem } from "@/sanity/types";

type CapabilitiesSectionProps = {
  heading?: string;
  capabilities?: CapabilityItem[];
};

export function CapabilitiesSection({
  heading = "Our Capabilities",
  capabilities = [],
}: CapabilitiesSectionProps) {
  if (!capabilities.length) return null;

  return (
    <section className="bg-surface py-section max-sm:py-section-sm" aria-labelledby="capabilities-heading">
      <Container>
        <AnimateOnScroll className="mb-12">
          <h2 id="capabilities-heading" className="font-heading text-4xl font-extrabold text-foreground">
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {capabilities.map((item, index) => (
            <AnimateOnScroll key={`${item.title}-${index}`} delay={index * 60}>
              <article className="h-full rounded-2xl border border-border bg-background p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  {item.icon ? (
                    <span className="text-2xl" aria-hidden="true">
                      {item.icon}
                    </span>
                  ) : null}
                  {item.image ? (
                    <div className="relative h-10 w-10">
                      <SanityImage
                        image={item.image}
                        alt={item.image.alt ?? item.title}
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </div>
                  ) : null}
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
