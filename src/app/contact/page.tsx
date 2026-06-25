import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNavbar } from "@/components/SiteNavbar";
import { NetlifyContactFormDetector } from "@/components/NetlifyContactFormDetector";
import { ContactSection } from "@/components/sections";
import { seoToMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { contactPageQuery } from "@/sanity/queries";
import type { ContactPage } from "@/sanity/types";

const fallbackMetadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with AgileMorph Solutions.",
};

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await sanityFetch<ContactPage | null>({
    query: contactPageQuery,
    tags: ["contactPage"],
  });

  return seoToMetadata(contactPage?.seo, fallbackMetadata);
}

export default async function ContactPageRoute() {
  const contactPage = await sanityFetch<ContactPage | null>({
    query: contactPageQuery,
    tags: ["contactPage"],
  });

  if (!contactPage) {
    return (
      <>
        <SiteNavbar />
        <main className="flex flex-1 items-center justify-center px-6 py-24">
          <p className="font-body text-muted-foreground">
            Contact page content is not available yet. Add it in Sanity Studio.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <NetlifyContactFormDetector />
      <SiteNavbar />
      <main className="flex-1">
        <ContactSection
          heading={contactPage.hero.heading}
          description={contactPage.hero.description}
          phone={contactPage.phone}
          email={contactPage.email}
          linkedinUrl={contactPage.linkedinUrl}
          facebookUrl={contactPage.facebookUrl}
          discoveryCall={contactPage.discoveryCall}
          faqs={contactPage.faqs}
        />
      </main>
      <SiteFooter />
    </>
  );
}
