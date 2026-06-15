import { Lightbulb, Handshake, UserCheck } from "lucide-react";

import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Logo } from "@/components/Logo";
import type { valueProps } from "@/data/homepage";

type ValuePropsSectionProps = {
  data: typeof valueProps;
};

const iconMap = {
  lightbulb: Lightbulb,
  handshake: Handshake,
  "user-check": UserCheck,
};

export function ValuePropsSection({ data }: ValuePropsSectionProps) {
  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="value-props-heading"
    >
      <Container>
        <SectionHeader
          id="value-props-heading"
          heading="Why AgileMorph is Your Ideal Partner?"
          headingClassName="text-3xl sm:text-4xl"
          className="mb-14"
        />

        {/* 3 icon columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-12">
          {data.map((prop) => {
            const Icon = iconMap[prop.icon as keyof typeof iconMap] ?? Lightbulb;
            return (
              <div key={prop.title} className="flex flex-col items-center gap-3 text-center">
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <Icon size={32} className="text-foreground/80" strokeWidth={1.5} />
                  {/* Small green dot accent */}
                  <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {prop.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground max-w-xs">
                  {prop.body}
                </p>
                {/* Curved arrow decoration */}
                <svg
                  className="mt-2 h-8 w-8 text-muted-foreground/40"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 12 C4 12, 8 18, 14 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M12 12 l2 2 l-2 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            );
          })}
        </div>

        {/* Central logo box */}
        <div className="flex justify-center">
          <div className="rounded-2xl border border-border bg-surface-elevated px-10 py-6 shadow-sm">
            <Logo />
          </div>
        </div>
      </Container>
    </section>
  );
}
