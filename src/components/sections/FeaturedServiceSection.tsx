import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Badge } from "@/components/Badge";
import type { featuredService } from "@/data/homepage";

type FeaturedServiceSectionProps = {
  data: typeof featuredService;
  sectionEyebrow?: string;
  sectionHeading?: string;
  sectionSubheading?: string;
};

export function FeaturedServiceSection({
  data,
  sectionEyebrow,
  sectionHeading = "Discover Our Services",
  sectionSubheading = "AI automation is the engine of everything we build. Supporting services keep the rest of your operation moving in the same direction.",
}: FeaturedServiceSectionProps) {
  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="featured-service-heading"
    >
      <Container>
        <SectionHeader
          id="featured-service-heading"
          eyebrow={sectionEyebrow}
          heading={sectionHeading}
          subheading={sectionSubheading}
          headingClassName="text-3xl sm:text-4xl"
          className="mb-12"
        />

        <div className="rounded-3xl bg-mint p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            {/* Left: service description */}
            <div className="flex flex-col gap-5">
              <Badge variant="dark">{data.eyebrow}</Badge>
              <h3 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
                {data.title}
              </h3>
              <p className="font-body text-base leading-relaxed text-foreground/80 max-w-lg">
                {data.description}
              </p>
            </div>

            {/* Right: stat cards */}
            <div className="flex flex-col gap-4">
              {data.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-surface-elevated/80 p-5 shadow-sm"
                >
                  <p className="font-heading text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
