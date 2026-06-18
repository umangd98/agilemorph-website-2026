import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  CapabilitiesSection,
  ServiceCtaSection,
  ServiceHeroSection,
  ServiceWhyUsSection,
  TechnologiesSection,
} from "@/components/sections";
import {
  getAiAutomationSubService,
  getAiAutomationSubServiceSlugs,
} from "@/data/ai-automation-services";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { allServiceSlugsQuery, servicePageQuery } from "@/sanity/queries";
import type { ServicePage, ServiceSlug } from "@/sanity/types";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const [slugs, subSlugs] = await Promise.all([
    sanityFetch<ServiceSlug[]>({
      query: allServiceSlugsQuery,
      tags: ["servicePage"],
    }),
    Promise.resolve(getAiAutomationSubServiceSlugs()),
  ]);

  const slugSet = new Set([
    ...(slugs ?? []).map(({ slug }) => slug),
    ...subSlugs,
  ]);

  return [...slugSet].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const subService = getAiAutomationSubService(slug);

  if (subService) {
    return seoToMetadata(subService.seo, {
      title: subService.title,
      description: subService.description,
    });
  }

  const servicePage = await sanityFetch<ServicePage | null>({
    query: servicePageQuery,
    params: { slug },
    tags: ["servicePage", `servicePage:${slug}`],
  });

  return seoToMetadata(servicePage?.seo, {
    title: servicePage?.title ?? "Service",
    description: servicePage?.description,
  });
}

export default async function ServicePageRoute({ params }: ServicePageProps) {
  const { slug } = await params;
  const subService = getAiAutomationSubService(slug);

  if (subService) {
    return (
      <>
        <SiteNavbar />
        <main className="flex-1">
          <ServiceHeroSection
            slug={slug}
            title={subService.title}
            tagline={subService.tagline}
            description={subService.description}
            heroCta={subService.heroCta}
          />
          <CapabilitiesSection
            heading={subService.capabilitiesHeading}
            capabilities={subService.capabilities}
          />
          <ServiceWhyUsSection
            heading={subService.whyUsHeading}
            items={subService.whyUs}
          />
          <ServiceCtaSection
            heading={subService.cta.heading}
            description={subService.cta.description}
            button={subService.cta.button}
          />
        </main>
        <SiteFooter />
      </>
    );
  }

  const servicePage = await sanityFetch<ServicePage | null>({
    query: servicePageQuery,
    params: { slug },
    tags: ["servicePage", `servicePage:${slug}`],
  });

  if (!servicePage) {
    notFound();
  }

  return (
    <>
      <SiteNavbar />
      <main className="flex-1">
        <ServiceHeroSection
          slug={slug}
          title={servicePage.title}
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
