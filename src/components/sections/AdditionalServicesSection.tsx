import Link from "next/link";

import { Container } from "@/components/Container";
import { getServiceIcon } from "@/lib/services";
import type { additionalServices } from "@/data/homepage";

type AdditionalServicesSectionProps = {
  data: typeof additionalServices;
};

function slugFromHref(href: string) {
  return href.split("/").filter(Boolean).pop() ?? "";
}

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
          {data.map((service) => {
            const Icon = getServiceIcon(slugFromHref(service.href));

            return (
              <Link
                key={service.id}
                href={service.href}
                className="hover-lift group flex flex-col gap-3 rounded-2xl border border-border bg-mint p-6 transition-colors hover:border-primary/30 hover:bg-mint-dark hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary/30 group-hover:bg-primary/15">
                  <Icon size={18} aria-hidden />
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-foreground/70">
                  {service.description}
                </p>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
