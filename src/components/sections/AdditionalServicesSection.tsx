import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import type { additionalServices } from "@/data/homepage";

type AdditionalServicesSectionProps = {
  data: typeof additionalServices;
};

export function AdditionalServicesSection({
  data,
}: AdditionalServicesSectionProps) {
  return (
    <section
      className="bg-surface pb-section max-sm:pb-section-sm"
      aria-labelledby="additional-services-heading"
    >
      <Container>
        <p
          className="mb-6 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          id="additional-services-heading"
        >
          Additional Services
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group flex flex-col gap-3 rounded-2xl bg-mint p-6 transition-colors hover:bg-mint-dark"
            >
              <h3 className="font-heading text-lg font-bold text-foreground">
                {service.title}
              </h3>
              <p className="font-body text-sm leading-relaxed text-foreground/70">
                {service.description}
              </p>
              <div className="mt-auto flex items-center gap-1 font-body text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                Explore <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
