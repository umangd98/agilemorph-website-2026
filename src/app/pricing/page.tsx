import { Shell } from "@/components/marketing/Shell";
import {
  BulletList,
  ClosingCTA,
  EngagementGrid,
  PageIntro,
  Section,
} from "@/components/marketing/Elements";
import { EfficiencyCalculator } from "@/components/sections/EfficiencyCalculator";
import { getContent } from "@/lib/content";
import type { PricingContent } from "@/lib/content-types";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
const fallbackMetadata = pageMetadata(
  "Engagements & Pricing",
  "A free introductory call followed by audits, software implementation, and ongoing technical partnerships quoted to scope.",
  "/pricing",
);
export async function generateMetadata() {
  const document = await getContent<PricingContent>("pricingPage");
  return seoToMetadata(document.seo, fallbackMetadata);
}
export default async function Pricing() {
  const pricing = await getContent<PricingContent>("pricingPage");
  return (
    <Shell>
      <PageIntro
        eyebrow="Engagements & pricing"
        title={pricing.heading}
        description={pricing.description}
      />
      <Section title="Choose the engagement around the problem.">
        <EngagementGrid items={pricing.engagements} />
      </Section>
      <Section title="What shapes the scope and cost" tinted>
        <div className="grid gap-8 md:grid-cols-2">
          <BulletList items={pricing.costDrivers} />
          <p className="text-fg-muted text-base leading-relaxed">
            {pricing.costNote}
          </p>
        </div>
      </Section>
      <Section
        eyebrow="Optional planning tool"
        title="Estimate the value of time released."
        intro="Use your own assumptions to explore a potential operational benefit. This is not a project quote or a prediction of realized savings."
      >
        <div className="max-w-3xl">
          <EfficiencyCalculator
            content={{
              heading: "A planning estimate",
              description:
                "Adjust the inputs to represent your team and your assumed automation opportunity.",
              disclaimer:
                "Illustrative annual value of time released, based on your assumptions and 52 weeks. Excludes build and operating costs, adoption, and whether freed time becomes cash savings. This is not a guaranteed result.",
              ctaLabel: "Discuss your project",
            }}
          />
        </div>
      </Section>
      <ClosingCTA />
    </Shell>
  );
}
