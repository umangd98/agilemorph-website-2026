import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SanityImage } from "@/components/SanityImage";
import type { CtaButton, SanityImageAsset, Stat } from "@/sanity/types";

type AboutImpactSectionProps = {
  heading?: string;
  description?: string;
  button?: CtaButton;
  stats?: Stat[];
};

const RIGHT_PATTERN: SanityImageAsset = {
  _type: "image",
  asset: {
    _type: "reference",
    _ref: "image-945d8729811ec0dbc516d5396234a794d86076cc-369x74-png",
  },
  alt: "Decorative pattern",
};

export function AboutImpactSection({
  heading = "Transforming Ideas into Impactful Journeys",
  description,
  button,
  stats = [],
}: AboutImpactSectionProps) {
  if (!heading && !description && !stats.length) return null;

  return (
    <section className="bg-background py-section max-sm:py-section-sm" aria-labelledby="about-impact-heading">
      <Container>
        <AnimateOnScroll>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-[#0ba6a6] to-[#57cf5a] p-8 text-white shadow-xl sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-72 opacity-20 lg:block">
              <SanityImage
                image={RIGHT_PATTERN}
                alt=""
                fill
                sizes="288px"
                className="object-cover object-right"
              />
            </div>

            <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
              <div className="min-w-0">
                <h2 id="about-impact-heading" className="mb-6 font-heading text-4xl font-extrabold italic sm:text-5xl">
                  {heading}
                </h2>
                {description ? (
                  <p className="mb-8 max-w-xl font-body text-lg leading-relaxed text-white/90">{description}</p>
                ) : null}
                {button ? (
                  <Link
                    href={button.href}
                    className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3 font-body text-sm font-bold text-foreground shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    {button.label}
                    <ArrowUpRight size={16} />
                  </Link>
                ) : null}
              </div>

              <div className="min-w-0 grid grid-cols-2 gap-x-8 gap-y-10 lg:gap-y-12">
                {stats.slice(0, 4).map((item, index) => (
                  <div key={`${item.label}-${index}`} className="relative text-center">
                    <span className="block font-heading text-5xl font-extrabold">{item.value}</span>
                    <span className="mt-2 block font-body text-2xs uppercase tracking-wider text-white/85 sm:text-xs">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  );
}
