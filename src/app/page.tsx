import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { IntegrationsMarquee } from "@/components/IntegrationsMarquee";
import { Navbar } from "@/components/Navbar";
import {
  FeaturedLogosSection,
  HeroSection,
  PartnersSection,
  ProcessSection,
  ServicesSection,
  StatsSection,
  TestimonialsSection,
  WhyUsSection,
} from "@/components/sections";
import { seoToMetadata } from "@/lib/seo";
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
  const homepage = await sanityFetch<Homepage | null>({
    query: homepageQuery,
    tags: ["homepage"],
  });

  if (!homepage) {
    return (
      <>
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="font-body text-muted-foreground">
            Homepage content is not available yet. Add it in Sanity Studio.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <HeroSection hero={homepage.hero} />
        <ProcessSection
          heading={homepage.process?.heading}
          subheading={homepage.process?.subheading}
          steps={homepage.process?.steps}
        />
        <ServicesSection
          eyebrow={homepage.services?.eyebrow}
          heading={homepage.services?.heading}
          cards={homepage.services?.cards}
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
        <IntegrationsMarquee
          heading={homepage.integrations?.heading}
          items={homepage.integrations?.items}
        />
        <PartnersSection
          heading={homepage.partners?.heading}
          items={homepage.partners?.items}
        />
        <FeaturedLogosSection
          heading={homepage.featuredLogos?.heading}
          logos={homepage.featuredLogos?.logos}
        />
        <TestimonialsSection
          eyebrow={homepage.testimonials?.eyebrow}
          heading={homepage.testimonials?.heading}
          items={homepage.testimonials?.items}
        />
      </main>

      <Footer />
    </>
  );
}
