import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const TESTIMONIALS = [
  {
    id: "t1",
    quote:
      "Umang has consistently demonstrated leadership qualities and a great positive attitude in working with others in team settings. I'm very happy to recommend Umang for any leadership roles.",
    name: "David Zaretsky",
    company: "Snips Media",
    initials: "DZ",
  },
  {
    id: "t2",
    quote:
      "It was a pleasure working alongside AgileMorph. Our collaboration resulted in an in-house software solution that had a profound impact on our operational efficiency at Dhaninfo.",
    name: "Sarvesh Agrawal",
    company: "Dhaninfo",
    initials: "SA",
  },
  {
    id: "t3",
    quote:
      "AgileMorph Solutions' work made the client's permit application process smoother and hassle-free, resulting in time savings and error reduction. The team delivered on schedule.",
    name: "Christopher Calkins",
    company: "Digisist LLC",
    initials: "CC",
  },
] as const;

function QuoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="absolute right-5 top-5 h-16 w-16 text-primary/10"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

export function TestimonialsSection() {
  return (
    <section
      className="bg-background py-section max-sm:py-section-sm"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <AnimateOnScroll className="mb-20">
          <span className="mb-4 block font-body text-xs font-bold uppercase tracking-widest text-primary">
            Client Feedback
          </span>
          <h2
            id="testimonials-heading"
            className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
          >
            Success Stories of Our Clients
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <AnimateOnScroll key={t.id} delay={i * 120}>
              <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                <QuoteIcon />

                <blockquote className="relative z-10 mb-8 font-body text-sm leading-relaxed text-muted-foreground italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-heading text-sm font-bold text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold text-foreground">
                      {t.name}
                    </p>
                    <p className="font-body text-xs font-bold uppercase tracking-widest text-primary">
                      {t.company}
                    </p>
                  </div>
                </div>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </Container>
    </section>
  );
}
