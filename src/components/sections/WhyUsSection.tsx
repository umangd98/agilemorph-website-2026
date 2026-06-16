import { Lightbulb, ShieldCheck, Award } from "lucide-react";

import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { WhyUsItem } from "@/sanity/types";

function WhyUsIcon({ index }: { index: number }) {
  const iconProps = { size: 22, strokeWidth: 2 as const };

  if (index % 3 === 1) return <ShieldCheck {...iconProps} />;
  if (index % 3 === 2) return <Award {...iconProps} />;
  return <Lightbulb {...iconProps} />;
}

type WhyUsSectionProps = {
  heading?: string;
  items?: WhyUsItem[];
};

export function WhyUsSection({
  heading = "Why AgileMorph is Your Ideal Partner?",
  items = [],
}: WhyUsSectionProps) {
  return (
    <section
      className="overflow-hidden bg-background py-section max-sm:py-section-sm"
      aria-labelledby="why-us-heading"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <AnimateOnScroll>
            <h2
              id="why-us-heading"
              className="mb-12 font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
            >
              {heading}
            </h2>

            <div className="space-y-10">
              {items.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="group flex gap-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                      {item.icon ? (
                        <SanityImage
                          image={item.icon}
                          alt={item.icon.alt ?? item.title}
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] object-contain"
                        />
                      ) : (
                        <WhyUsIcon index={index} />
                      )}
                    </div>
                    <div>
                      <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="font-body text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200} className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full border border-primary/10"
                style={{ inset: "-60px", animation: "spin 20s linear infinite" }}
                aria-hidden="true"
              />
              <div
                className="absolute rounded-full border border-border"
                style={{ inset: "-30px", animation: "spin 30s linear infinite reverse" }}
                aria-hidden="true"
              />
              <div className="group relative z-10 rounded-3xl border border-border bg-background p-10 shadow-2xl shadow-foreground/5 transition-transform duration-700 hover:scale-105">
                <Logo />
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </Container>
    </section>
  );
}
