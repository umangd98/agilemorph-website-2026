import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  ServiceCtaSection,
  ServiceHeroSection,
  ServiceWhyUsSection,
  TechnologiesSection,
} from "@/components/sections";
import { AiAutomationCapabilitiesGrid } from "@/components/sections/AiAutomationCapabilitiesGrid";
import {
  getServiceLabel,
  PRIMARY_SERVICE_CAPABILITIES,
  PRIMARY_SERVICE_SLUG,
} from "@/lib/services";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { servicePageQuery } from "@/sanity/queries";
import type { ServicePage } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const servicePage = await sanityFetch<ServicePage | null>({
    query: servicePageQuery,
    params: { slug: PRIMARY_SERVICE_SLUG },
    tags: ["servicePage", `servicePage:${PRIMARY_SERVICE_SLUG}`],
  });

  return seoToMetadata(servicePage?.seo, {
    title: getServiceLabel(PRIMARY_SERVICE_SLUG, servicePage?.title ?? "AI Automation"),
    description: servicePage?.description,
  });
}

export default async function ServicesPageRoute() {
  const servicePage = await sanityFetch<ServicePage | null>({
    query: servicePageQuery,
    params: { slug: PRIMARY_SERVICE_SLUG },
    tags: ["servicePage", `servicePage:${PRIMARY_SERVICE_SLUG}`],
  });

  if (!servicePage) {
    return (
      <>
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="font-body text-muted-foreground">
            Services page content is not available yet. Add it in Sanity Studio.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const pageTitle = getServiceLabel(PRIMARY_SERVICE_SLUG, servicePage.title);

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <ServiceHeroSection
          slug={PRIMARY_SERVICE_SLUG}
          title={pageTitle}
          tagline={servicePage.tagline}
          description={servicePage.description}
          heroImage={servicePage.heroImage}
          heroCta={servicePage.heroCta}
          useEcosystemVisual
        />
        <AiAutomationCapabilitiesGrid
          heading={servicePage.capabilitiesHeading ?? "Core Capabilities"}
          capabilities={PRIMARY_SERVICE_CAPABILITIES}
        />
        <ServiceWhyUsSection
          heading={servicePage.whyUsHeading}
          items={servicePage.whyUs}
        />
        <TechnologiesSection
          heading={servicePage.technologiesHeading}
          technologies={servicePage.technologies}
        />
        <ServiceCtaSection
          heading={servicePage.cta?.heading}
          description={servicePage.cta?.description}
          button={servicePage.cta?.button}
        />
      </main>
      <SiteFooter />
    </>
  );
}
