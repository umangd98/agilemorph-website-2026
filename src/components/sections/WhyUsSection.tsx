import { Lightbulb, ShieldCheck, Award } from "lucide-react";
import type { ComponentType } from "react";

import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

type IconComponent = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

type Pillar = {
  Icon: IconComponent;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    Icon: Lightbulb,
    title: "Innovation",
    body: "Pioneering solutions that push boundaries through deep-tech integration and creative problem-solving.",
  },
  {
    Icon: ShieldCheck,
    title: "Professionalism",
    body: "Delivering quality with integrity and an unwavering commitment to excellence at every step.",
  },
  {
    Icon: Award,
    title: "Expertise",
    body: "Leveraging deep knowledge to create tailored solutions for modern enterprises.",
  },
];

export function WhyUsSection() {
  return (
    <section
      className="overflow-hidden bg-background py-section max-sm:py-section-sm"
      aria-labelledby="why-us-heading"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* Left: pillars */}
          <AnimateOnScroll>
            <h2
              id="why-us-heading"
              className="mb-12 font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
            >
              Why AgileMorph is Your Ideal Partner?
            </h2>

            <div className="space-y-10">
              {PILLARS.map(({ Icon, title, body }) => (
                <div key={title} className="group flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="mb-2 font-heading text-xl font-bold text-foreground">
                      {title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Right: spinning decorative rings + logo */}
          <AnimateOnScroll delay={200} className="flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer slow-spinning ring */}
              <div
                className="absolute rounded-full border border-primary/10"
                style={{
                  inset: "-60px",
                  animation: "spin 20s linear infinite",
                }}
                aria-hidden="true"
              />
              {/* Inner reverse-spinning ring */}
              <div
                className="absolute rounded-full border border-border"
                style={{
                  inset: "-30px",
                  animation: "spin 30s linear infinite reverse",
                }}
                aria-hidden="true"
              />

              {/* Logo card */}
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
