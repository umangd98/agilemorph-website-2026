import { PageHeroBackground } from "@/components/PageHeroBackground";
import { SubServiceFaqSection } from "@/components/sections/sub-service/SubServiceFaqSection";
import { SubServiceFeaturesSection } from "@/components/sections/sub-service/SubServiceFeaturesSection";
import { SubServiceFinalCta } from "@/components/sections/sub-service/SubServiceFinalCta";
import { SubServiceHeroSection } from "@/components/sections/sub-service/SubServiceHeroSection";
import { SubServicePricingSection } from "@/components/sections/sub-service/SubServicePricingSection";
import { SubServiceProcessSection } from "@/components/sections/sub-service/SubServiceProcessSection";
import { SubServiceStatsStrip } from "@/components/sections/sub-service/SubServiceStatsStrip";
import { SubServiceUseCasesSection } from "@/components/sections/sub-service/SubServiceUseCasesSection";
import { SubServiceWhySection } from "@/components/sections/sub-service/SubServiceWhySection";
import type { ServicePage, SubServicePageSummary } from "@/sanity/types";

type SubServicePageLayoutProps = {
  page: ServicePage;
  siblings: SubServicePageSummary[];
};

export function SubServicePageLayout({ page, siblings }: SubServicePageLayoutProps) {
  return (
    <div className="relative overflow-x-clip">
      <PageHeroBackground />
      <div className="relative z-10">
        <SubServiceHeroSection
          pageKey={page.slug}
          title={page.title}
          tagline={page.tagline}
          headline={page.headline}
          description={page.description}
          heroCta={page.heroCta}
          flow={page.flow}
        />
        <SubServiceStatsStrip stats={page.stats} />
        <SubServiceWhySection
          whyTitle={page.whyTitle}
          whyHighlight={page.whyHighlight}
          whyText={page.whyText}
          checks={page.checks}
        />
        <SubServiceFeaturesSection
          heading={page.capabilitiesHeading}
          capabilities={page.capabilities}
        />
        <SubServiceProcessSection steps={page.processSteps} />
        <SubServiceUseCasesSection useCases={page.useCases} />
        <SubServicePricingSection pricing={page.pricing} cta={page.heroCta} />
        <SubServiceFaqSection faq={page.faq} />
        <SubServiceFinalCta cta={page.cta} siblings={siblings} currentSlug={page.slug} />
      </div>
    </div>
  );
}
