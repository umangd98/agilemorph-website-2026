import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { ProcessStep } from "@/sanity/types";

type ProcessSectionProps = {
  heading?: string;
  subheading?: string;
  steps?: ProcessStep[];
};

const OFFSET_CLASSES = ["lg:mt-0", "lg:mt-20", "lg:mt-40"] as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ProcessSection({
  heading = "The Way We Work",
  subheading = "We empower businesses to thrive with innovative digital solutions.",
  steps = [],
}: ProcessSectionProps) {
  return (
    <section
      className="overflow-hidden bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="process-heading"
    >
      <Container>
        <AnimateOnScroll className="mb-20 text-center">
          <span className="mb-4 block font-body text-xs font-bold uppercase tracking-widest text-primary">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="mb-4 font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            {heading}
          </h2>
          {subheading ? (
            <p className="mx-auto max-w-xl font-body text-lg text-muted-foreground">
              {subheading}
            </p>
          ) : null}
        </AnimateOnScroll>

        {/* Connector line (desktop) */}
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div
            className="pointer-events-none absolute left-[16.7%] top-14 hidden h-px w-[66.6%] bg-linear-to-r from-primary/20 via-primary/60 to-primary/20 lg:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <AnimateOnScroll
              key={`${step.title}-${index}`}
              delay={index * 120}
              className={`relative z-10 ${OFFSET_CLASSES[index % OFFSET_CLASSES.length]}`}
            >
              {/* Step number badge */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary font-heading text-base font-extrabold text-white shadow-lg shadow-primary/30">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="group h-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                {/* Illustration area */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-linear-to-br from-primary/5 to-surface p-4">
                  {step.image ? (
                    <SanityImage
                      image={step.image}
                      alt={step.image.alt ?? step.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-contain p-6"
                    />
                  ) : (
                    /* Animated placeholder */
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <svg className="h-16 w-16 text-primary" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                        <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="font-body text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                  )}
                  {/* Subtle overlay gradient */}
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-background), transparent)",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-2 font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {step.title}
                  </h3>
                  {step.description ? (
                    <p className="mb-5 font-body text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  ) : null}

                  {step.bullets?.length ? (
                    <ul className="space-y-2.5">
                      {step.bullets.map((bullet) => {
                        const [bold, ...rest] = bullet.split(": ");
                        return (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 font-body text-sm text-muted-foreground"
                          >
                            <CheckIcon />
                            <span>
                              {rest.length > 0 ? (
                                <>
                                  <strong className="font-semibold text-foreground">
                                    {bold}:
                                  </strong>{" "}
                                  {rest.join(": ")}
                                </>
                              ) : (
                                bullet
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
