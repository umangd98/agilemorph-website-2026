import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  CapabilitiesSection,
  ServiceCtaSection,
  ServiceHeroSection,
  ServiceWhyUsSection,
  TechnologiesSection,
} from "@/components/sections";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { allServiceSlugsQuery, servicePageQuery } from "@/sanity/queries";
import type { ServicePage, ServiceSlug } from "@/sanity/types";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<ServiceSlug[]>({
    query: allServiceSlugsQuery,
    tags: ["servicePage"],
  });

  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
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
      <Navbar />
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
      <Footer />
    </>
  );
}
