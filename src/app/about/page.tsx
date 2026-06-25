import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  AboutHeroSection,
  CompanyStorySection,
  FounderSection,
  ProcessSection,
  TeamLeadsSection,
  TestimonialsSection,
  AboutImpactSection,
  ValuesSection,
} from "@/components/sections";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { aboutPageQuery } from "@/sanity/queries";
import type { AboutPage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "About Us",
  description:
    "Empowering businesses with agile solutions, innovative technology, and a customer-first approach.",
};

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await sanityFetch<AboutPage | null>({
    query: aboutPageQuery,
    tags: ["aboutPage"],
  });

  return seoToMetadata(aboutPage?.seo, fallbackMetadata);
}

export default async function AboutPageRoute() {
  const aboutPage = await sanityFetch<AboutPage | null>({
    query: aboutPageQuery,
    tags: ["aboutPage"],
  });

  if (!aboutPage) {
    return (
      <>
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="font-body text-muted-foreground">
            About page content is not available yet. Add it in Sanity Studio.
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
        <AboutHeroSection
          heading={aboutPage.hero.heading}
          tagline={aboutPage.hero.tagline}
          cta={aboutPage.hero.cta}
        />
        <CompanyStorySection
          heading={aboutPage.about?.heading}
          body={aboutPage.about?.body}
          promiseHeading={aboutPage.about?.promiseHeading}
          promise={aboutPage.about?.promise}
          image={aboutPage.about?.image}
        />
        <ValuesSection values={aboutPage.values} />
        <ProcessSection
          heading={aboutPage.process?.heading}
          subheading={aboutPage.process?.subheading}
          steps={aboutPage.process?.steps}
        />
        <AboutImpactSection
          heading={aboutPage.cta?.heading}
          description={aboutPage.cta?.description}
          button={aboutPage.cta?.button}
          stats={aboutPage.stats}
        />
        <TeamLeadsSection
          eyebrow={aboutPage.teamLeads?.eyebrow}
          heading={aboutPage.teamLeads?.heading}
          subheading={aboutPage.teamLeads?.subheading}
          cardFooter={aboutPage.teamLeads?.cardFooter}
          members={aboutPage.teamLeads?.members}
        />
        <FounderSection
          eyebrow={aboutPage.founder?.eyebrow}
          heading={aboutPage.founder?.heading}
          name={aboutPage.founder?.name}
          role={aboutPage.founder?.role}
          bio={aboutPage.founder?.bio}
          image={aboutPage.founder?.image}
        />
        <TestimonialsSection
          heading={aboutPage.testimonials?.heading}
          items={aboutPage.testimonials?.items}
        />
      </main>
      <SiteFooter />
    </>
  );
}
