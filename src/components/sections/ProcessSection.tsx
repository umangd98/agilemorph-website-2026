import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const steps = [
  {
    number: "01",
    title: "Kickstart Your Journey With a Thoughtful Plan",
    body: "We start by understanding your goals and planning the steps to bring them to life.",
    bullets: [
      "Collaborative Sprint: Work closely with your team to identify project objectives and scope.",
      "Intensive Planning: Focus on detailed planning and prioritization.",
      "Successful Groundwork: Lay the foundation for a successful agile transformation.",
    ],
    imageBg: "from-primary/5 to-primary/10",
    offsetClass: "md:mt-0",
  },
  {
    number: "02",
    title: "Innovate with every step forward.",
    body: "We build and refine your solution step by step, based on your feedback.",
    bullets: [
      "Iterative Development: Central to our process for continuous improvement.",
      "Agile Principles: Embrace the agile manifesto to adapt and refine solutions.",
      "Rapid Feedback Loops: Ensure every iteration aligns with your evolving needs.",
    ],
    imageBg: "from-primary/10 to-primary/20",
    offsetClass: "md:mt-16",
  },
  {
    number: "03",
    title: "Agility at Its Best, Results Guaranteed",
    body: "We deliver results quickly and adapt to your needs as they evolve.",
    bullets: [
      "Rapid Delivery: Efficient approach for prompt results.",
      "Adaptibility: Address changes with a flexible approach.",
      "Seamless Evolution: Ensure the project evolves smoothly to meet milestones.",
    ],
    imageBg: "from-primary/20 to-primary/5",
    offsetClass: "md:mt-32",
  },
] as const;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ProcessSection() {
  return (
    <section
      className="bg-background py-section max-sm:py-section-sm"
      aria-labelledby="process-heading"
    >
      <Container>
        <AnimateOnScroll className="text-center mb-20">
          <h2
            id="process-heading"
            className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl mb-4"
          >
            The Way We Work
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            We empower businesses to thrive with innovative digital solutions.
          </p>
        </AnimateOnScroll>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div
            className="pointer-events-none absolute top-8 left-8 hidden w-[calc(100%-4rem)] h-px bg-border md:block"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <AnimateOnScroll
              key={step.number}
              delay={i * 150}
              className={`relative z-10 group ${step.offsetClass}`}
            >
              {/* Step number */}
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background font-heading text-lg font-bold text-primary shadow-xl shadow-primary/10">
                {step.number}
              </div>

              {/* Card */}
              <div className="h-full rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
                {/* Image placeholder with gradient */}
                <div
                  className={`relative mb-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${step.imageBg} border border-border/50`}
                >
                  {/* SVG illustration placeholder */}
                  <svg
                    className="h-20 w-20 text-primary/30 transition-all duration-700 group-hover:text-primary/60"
                    viewBox="0 0 80 80"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                    <rect x="25" y="25" width="30" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M30 55 L40 63 L50 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="40" cy="36" r="5" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-primary/5 to-transparent" />
                </div>

                <h3 className="mb-3 font-heading text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="mb-5 font-body text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>

                <ul className="space-y-3">
                  {step.bullets.map((bullet) => {
                    const [bold, ...rest] = bullet.split(": ");
                    return (
                      <li key={bullet} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                        <CheckIcon />
                        <span>
                          <strong className="font-semibold text-foreground">{bold}:</strong>{" "}
                          {rest.join(": ")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
