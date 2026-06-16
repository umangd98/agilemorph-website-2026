import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { CompanyValue } from "@/sanity/types";

type ValuesSectionProps = {
  heading?: string;
  values?: CompanyValue[];
};

function ValueIcon({ value }: { value: CompanyValue }) {
  if (!value.icon?.asset?._ref && !value.icon?.asset?._id && !value.icon?.asset?.url) {
    return null;
  }

  return (
    <div
      className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10"
      aria-hidden="true"
    >
      <SanityImage
        image={value.icon}
        alt={value.icon.alt ?? value.title}
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
    </div>
  );
}

export function ValuesSection({
  heading = "Our Values",
  values = [],
}: ValuesSectionProps) {
  if (!values.length) return null;

  return (
    <section
      className="bg-background py-section max-sm:py-section-sm"
      aria-labelledby="values-heading"
    >
      <Container>
        <AnimateOnScroll className="mb-12 text-center">
          <h2
            id="values-heading"
            className="font-heading text-4xl font-extrabold text-foreground"
          >
            {heading}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <AnimateOnScroll key={`${value.title}-${index}`} delay={index * 80}>
              <article className="h-full rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <ValueIcon value={value} />
                <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
