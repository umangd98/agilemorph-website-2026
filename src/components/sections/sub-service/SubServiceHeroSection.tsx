import { Container } from "@/components/Container";
import { ServiceBreadcrumb } from "@/components/sections/sub-service/ServiceBreadcrumb";
import { SubServiceFlowVisual } from "@/components/sections/sub-service/SubServiceFlowVisual";
import { SubServiceHeroIntro } from "@/components/sections/sub-service/SubServiceHeroIntro";
import type { CtaButton, FlowStep, ServiceHeadline } from "@/sanity/types";

type SubServiceHeroSectionProps = {
  pageKey: string;
  title: string;
  tagline?: string;
  headline?: ServiceHeadline;
  description?: string;
  heroCta?: CtaButton;
  flow?: FlowStep[];
};

export function SubServiceHeroSection({
  pageKey,
  title,
  tagline,
  headline,
  description,
  heroCta,
  flow = [],
}: SubServiceHeroSectionProps) {
  return (
    <section className="pb-12 pt-6 sm:pb-16 sm:pt-8" aria-labelledby="sub-service-hero-heading">
      <Container>
        <ServiceBreadcrumb title={title} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-14">
          <SubServiceHeroIntro
            pageKey={pageKey}
            tagline={tagline}
            headline={headline}
            title={title}
            description={description}
            heroCta={heroCta}
          />

          <div className="min-w-0 lg:pl-2">
            <SubServiceFlowVisual pageKey={pageKey} flow={flow} />
          </div>
        </div>
      </Container>
    </section>
  );
}
