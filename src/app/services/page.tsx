import Link from "next/link";
import { Shell } from "@/components/marketing/Shell";
import {
  ClosingCTA,
  PageIntro,
  Section,
  ServiceGrid,
} from "@/components/marketing/Elements";
import { getContent, getServices, primaryServices } from "@/lib/content";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
import type { ContentDocument } from "@/lib/content-types";
const fallbackMetadata = pageMetadata(
  "Software & AI Services",
  "Custom software, AI products and agents, operational automation, and data platforms for SMBs and enterprises.",
  "/services",
);
export async function generateMetadata() {
  const document = await getContent<ContentDocument>("servicesIndexPage");
  return seoToMetadata(document.seo, fallbackMetadata);
}
export default async function Services() {
  const [services, index] = await Promise.all([
    getServices(),
    getContent<
      ContentDocument & {
        hero: { eyebrow: string; heading: string; description: string };
      }
    >("servicesIndexPage"),
  ]);
  return (
    <Shell>
      <PageIntro
        eyebrow={index.hero.eyebrow}
        title={index.hero.heading}
        description={index.hero.description}
      />
      <Section title="Four ways we help you build.">
        <ServiceGrid services={primaryServices(services)} />
      </Section>
      <Section
        eyebrow="Specific needs"
        title="Explore a specialist capability."
        tinted
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services
            .filter((s) => !s.primary && s.slug.current !== "ai-audit")
            .map((s) => (
              <Link
                className="border-line bg-background rounded-xl border p-6"
                key={s._id}
                href={`/services/${s.slug.current}`}
              >
                <h3 className="font-medium">{s.title}</h3>
                <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                  {s.description}
                </p>
              </Link>
            ))}
        </div>
        <p className="text-fg-muted mt-8 text-sm">
          Need to define the work first?{" "}
          <Link className="text-signal underline" href="/services/ai-audit">
            Explore a diagnostic audit.
          </Link>
        </p>
      </Section>
      <ClosingCTA />
    </Shell>
  );
}
