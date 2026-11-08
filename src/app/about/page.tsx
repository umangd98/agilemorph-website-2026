import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import {
  CompanyStorySection,
  PartnersSection,
  ValuesSection,
} from "@/components/sections";
import {
  FdeExplainer,
  FdePageHero,
  FinalCtaSection,
  FoundersPairSection,
} from "@/components/sections/fde";
import { ONE_LINER } from "@/data/positioning";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { aboutPageQuery } from "@/sanity/queries";
import type { AboutPage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description: ONE_LINER,
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
        <FdePageHero
          eyebrow="About Agilemorph"
          heading={aboutPage.hero.heading}
          description={aboutPage.hero.tagline}
          ctaPrimary={aboutPage.hero.cta}
        >
          <FdeExplainer />
        </FdePageHero>
        <CompanyStorySection
          heading={aboutPage.about?.heading}
          body={aboutPage.about?.body}
          promiseHeading={aboutPage.about?.promiseHeading}
          promise={aboutPage.about?.promise}
        />
        <FoundersPairSection index="01" block={aboutPage.founders} />
        <ValuesSection heading="What makes us different" values={aboutPage.values} />
        <PartnersSection
          heading={aboutPage.partners?.heading}
          items={aboutPage.partners?.items}
        />
        <FinalCtaSection
          block={
            aboutPage.cta?.heading
              ? {
                  heading: aboutPage.cta.heading,
                  description: aboutPage.cta.description,
                  button: aboutPage.cta.button,
                  showEmail: true,
                }
              : undefined
          }
        />
      </main>
      <SiteFooter />
    </>
  );
}
