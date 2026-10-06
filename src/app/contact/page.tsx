import { Shell } from "@/components/marketing/Shell";
import { ContactSection } from "@/components/sections/ContactSection";
import { NetlifyContactFormDetector } from "@/components/NetlifyContactFormDetector";
import { getContent } from "@/lib/content";
import type { ContactContent, PricingContent } from "@/lib/content-types";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
const fallbackMetadata = pageMetadata(
  "Discuss Your Project",
  "Tell AgileMorph about your business problem, existing systems, and goals. Book a free 15-minute introductory call.",
  "/contact",
);
export async function generateMetadata() {
  const document = await getContent<ContactContent>("contactPage");
  return seoToMetadata(document.seo, fallbackMetadata);
}
export default async function Contact() {
  const [c, pricing] = await Promise.all([
    getContent<ContactContent>("contactPage"),
    getContent<PricingContent>("pricingPage"),
  ]);
  const introduction = pricing.engagements[0];
  return (
    <Shell>
      <NetlifyContactFormDetector />
      <ContactSection
        heading={c.hero.heading}
        description={c.hero.description}
        phone={c.phone}
        email={c.email}
        linkedinUrl={c.linkedinUrl}
        discoveryCall={{
          ...c.discoveryCall,
          ...(introduction
            ? {
                title: introduction.title,
                description: introduction.description,
                bullets: introduction.deliverables,
              }
            : {}),
        }}
        faqs={c.faqs}
      />
    </Shell>
  );
}
