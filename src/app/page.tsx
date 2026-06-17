import type { Metadata } from "next";

import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import { IntegrationsMarquee } from "@/components/IntegrationsMarquee";
import {
  HeroSection,
  PartnersSection,
  ProcessSection,
  ServicesSection,
  StatsSection,
  TestimonialsSection,
  WhyUsSection,
} from "@/components/sections";
import { seoToMetadata } from "@/lib/seo";
import { getServicePages } from "@/lib/services";
import { sanityFetch } from "@/sanity/fetch";
import { homepageQuery } from "@/sanity/queries";
import type { Homepage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "AGILEMORPH | Digital Accelerators",
  description:
    "We revolutionize efficiency with AI Automation, craft impactful experiences through Web Development, and amplify influence via Digital Marketing.",
};

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await sanityFetch<Homepage | null>({
    query: homepageQuery,
    tags: ["homepage"],
  });

  return seoToMetadata(homepage?.seo, fallbackMetadata);
}

export default async function HomePage() {
  const [homepage, servicePages] = await Promise.all([
    sanityFetch<Homepage | null>({
      query: homepageQuery,
      tags: ["homepage"],
    }),
    getServicePages(),
  ]);

  if (!homepage) {
    return (
      <>
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="font-body text-muted-foreground">
            Homepage content is not available yet. Add it in Sanity Studio.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <SiteNavbar />

      <main className="flex-1">
        <HeroSection hero={homepage.hero} />
        {/* Partners strip — certified partnerships, directly under hero as social proof */}
        <PartnersSection
          heading={homepage.partners?.heading}
          items={homepage.partners?.items}
        />
        {/* Integrations marquee — scrolling tool logos, just below partners */}
        <IntegrationsMarquee
          heading={homepage.integrations?.heading}
          items={homepage.integrations?.items}
        />
        <ProcessSection
          heading={homepage.process?.heading}
          subheading={homepage.process?.subheading}
          steps={homepage.process?.steps}
        />
        <ServicesSection
          eyebrow={homepage.services?.eyebrow}
          heading={homepage.services?.heading}
          pages={servicePages}
        />
        <WhyUsSection
          heading={homepage.whyUs?.heading}
          items={homepage.whyUs?.items}
        />
        <StatsSection
          eyebrow={homepage.stats?.eyebrow}
          heading={homepage.stats?.heading}
          items={homepage.stats?.items}
        />
        <TestimonialsSection
          eyebrow={homepage.testimonials?.eyebrow}
          heading={homepage.testimonials?.heading}
          items={homepage.testimonials?.items}
        />
      </main>

      <SiteFooter />
    </>
  );
}
