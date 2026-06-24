import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SubServicePageLayout } from "@/components/sections/sub-service/SubServicePageLayout";
import {
  CapabilitiesSection,
  ServiceCtaSection,
  ServiceHeroSection,
  ServiceWhyUsSection,
  TechnologiesSection,
} from "@/components/sections";
import { AiAutomationCapabilitiesGrid } from "@/components/sections/AiAutomationCapabilitiesGrid";
import { getAllServiceSlugs, getServicePage, getSubServiceSiblings } from "@/lib/get-service-page";
import {
  getServiceLabel,
  isExcludedServiceSlug,
  isSubServicePage,
  PRIMARY_SERVICE_SLUG,
} from "@/lib/services";
import { seoToMetadata } from "@/lib/seo";
import type { ServicePage } from "@/sanity/types";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isExcludedServiceSlug(slug)) {
    return { title: "Not Found" };
  }

  const servicePage = await getServicePage(slug);

  return seoToMetadata(servicePage?.seo, {
    title: getServiceLabel(slug, servicePage?.title ?? "Service"),
    description: servicePage?.description,
  });
}

export default async function ServicePageRoute({ params }: ServicePageProps) {
  const { slug } = await params;

  if (isExcludedServiceSlug(slug)) {
    notFound();
  }

  const servicePage = await getServicePage(slug);

  if (!servicePage) {
    notFound();
  }

  if (slug === PRIMARY_SERVICE_SLUG) {
    return renderPrimaryServicePage(servicePage);
  }

  if (isSubServicePage(servicePage)) {
    const siblings = await getSubServiceSiblings();

    return (
      <>
        <SiteNavbar />
        <main className="flex-1">
          <SubServicePageLayout page={servicePage} siblings={siblings} />
        </main>
        <SiteFooter />
      </>
    );
  }

  return renderStandardServicePage(slug, servicePage);
}

function renderPrimaryServicePage(servicePage: ServicePage) {
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
          capabilities={servicePage.capabilities ?? []}
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

function renderStandardServicePage(slug: string, servicePage: ServicePage) {
  const pageTitle = getServiceLabel(slug, servicePage.title);

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <ServiceHeroSection
          slug={slug}
          title={pageTitle}
          tagline={servicePage.tagline}
          description={servicePage.description}
          heroImage={servicePage.heroImage}
          heroCta={servicePage.heroCta}
        />
        <CapabilitiesSection
          heading={servicePage.capabilitiesHeading}
          capabilities={servicePage.capabilities}
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
