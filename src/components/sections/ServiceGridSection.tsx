import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import type { services, servicesCallout } from "@/data/homepage";

type ServiceGridSectionProps = {
  servicesData: typeof services;
  callout: typeof servicesCallout;
};

export function ServiceGridSection({
  servicesData,
  callout,
}: ServiceGridSectionProps) {
  return (
    <section
      className="bg-surface pb-section max-sm:pb-section-sm"
      aria-labelledby="services-grid-heading"
    >
      <Container>
        <div className="rounded-3xl bg-mint p-4 sm:p-6">
          {/* Callout row */}
          <div className="mb-4 flex justify-end">
            <div className="rounded-2xl bg-surface-elevated/80 px-6 py-4 shadow-sm max-w-[220px]">
              <p className="font-heading text-4xl font-bold text-foreground">
                {callout.value}
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {callout.label}
              </p>
            </div>
          </div>

          {/* Service grid */}
          <div
            className="grid grid-cols-1 divide-y divide-border/30 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3"
            role="list"
            aria-labelledby="services-grid-heading"
          >
            <h2 id="services-grid-heading" className="sr-only">
              Services
            </h2>

            {servicesData.map((service, index) => (
              <div
                key={service.id}
                role="listitem"
                className={`flex flex-col gap-3 p-5 rounded-xl ${
                  service.featured ? "bg-mint-dark" : ""
                } ${
                  index % 3 !== 2
                    ? "sm:border-r-0 lg:border-r lg:border-border/30"
                    : ""
                } ${
                  index < 3 ? "lg:border-b lg:border-border/30" : ""
                }`}
              >
                <h3 className="font-heading text-base font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-foreground/70">
                  {service.description}
                </p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1 font-body text-sm font-medium text-foreground/80 hover:text-foreground transition-colors mt-auto"
                >
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
