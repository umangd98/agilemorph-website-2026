import Link from "next/link";

import { PRIMARY_SERVICE_SLUG, serviceHref } from "@/lib/services";

type ServiceBreadcrumbProps = {
  title: string;
};

export function ServiceBreadcrumb({ title }: ServiceBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-7 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-body text-xs tracking-wide text-muted-foreground sm:mb-8"
    >
      <Link href="/services" className="transition-colors hover:text-primary">
        Services
      </Link>
      <span className="select-none text-border/80" aria-hidden>
        /
      </span>
      <Link
        href={serviceHref(PRIMARY_SERVICE_SLUG)}
        className="transition-colors hover:text-primary"
      >
        AI Automation
      </Link>
      <span className="select-none text-border/80" aria-hidden>
        /
      </span>
      <span className="font-medium text-foreground/90">{title}</span>
    </nav>
  );
}
