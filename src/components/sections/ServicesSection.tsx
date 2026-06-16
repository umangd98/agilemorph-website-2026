import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { ServiceCard } from "@/sanity/types";

type ServicesSectionProps = {
  eyebrow?: string;
  heading?: string;
  cards?: ServiceCard[];
};

function ServiceCardItem({
  service,
  index,
}: {
  service: ServiceCard;
  index: number;
}) {
  return (
    <AnimateOnScroll delay={index * 80} className="h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-foreground/5">
        <div className="absolute left-0 top-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />

        {service.icon ? (
          <div className="relative mb-10 h-12 w-12 transition-all duration-500 group-hover:scale-110">
            <SanityImage
              image={service.icon}
              alt={service.icon.alt ?? service.title}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
          </div>
        ) : null}

        <h3 className="mb-5 font-heading text-xl font-bold text-foreground">
          {service.title}
        </h3>
        <p className="mb-auto font-body text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <Link
          href={service.href}
          className="mt-8 inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-primary transition-all hover:gap-3"
        >
          View Service Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </AnimateOnScroll>
  );
}

export function ServicesSection({
  eyebrow = "Our Expertise",
  heading = "Discover Our Services",
  cards = [],
}: ServicesSectionProps) {
  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="services-heading"
    >
      <Container>
        <AnimateOnScroll>
          <div className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              {eyebrow ? (
                <span className="mb-4 block font-body text-xs font-bold uppercase tracking-widest text-primary">
                  {eyebrow}
                </span>
              ) : null}
              <h2
                id="services-heading"
                className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
              >
                {heading}
              </h2>
            </div>
            <Link
              href="/services/ai-automation"
              className="group inline-flex items-center gap-2 border-b border-primary pb-1 font-body text-xs font-bold uppercase tracking-widest text-primary transition-all hover:gap-3"
            >
              View All Services
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((service, index) => (
            <ServiceCardItem key={`${service.title}-${index}`} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
