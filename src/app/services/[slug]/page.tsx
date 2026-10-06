import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/marketing/Shell";
import {
  Action,
  BulletList,
  ClosingCTA,
  DeliveryTimeline,
  EngagementGrid,
  FAQ,
  PageIntro,
  ProjectGrid,
  Section,
} from "@/components/marketing/Elements";
import {
  getContent,
  getProjects,
  getServices,
  selectProjects,
} from "@/lib/content";
import type { HomeContent, PricingContent } from "@/lib/content-types";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug.current }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const s = (await getServices()).find((s) => s.slug.current === slug);
  return seoToMetadata(
    s?.seo,
    pageMetadata(
      s?.title ?? "Service not found",
      s?.description ?? "Explore AgileMorph services.",
      `/services/${slug}`,
    ),
  );
}
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [services, projects, home, pricing] = await Promise.all([
    getServices(),
    getProjects(),
    getContent<HomeContent>("homepage"),
    getContent<PricingContent>("pricingPage"),
  ]);
  const service = services.find((s) => s.slug.current === slug);
  if (!service) notFound();
  const related = selectProjects(projects, service.featuredProjects);
  return (
    <Shell>
      <PageIntro
        eyebrow={service.title}
        title={service.headlineText}
        description={service.description}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Action>Discuss your project</Action>
          <Action href="#related-work" secondary>
            See relevant work
          </Action>
        </div>
      </PageIntro>
      <Section eyebrow="The engagement" title="What the scope can include">
        <div className="grid gap-8 md:grid-cols-2">
          <BulletList items={service.deliverables} />
          <div className="border-line bg-bg-elevated rounded-xl border p-6">
            <h3 className="text-xl font-medium">
              Built around your requirements
            </h3>
            <p className="text-fg-muted mt-3 text-sm leading-relaxed">
              We establish the users, tools, data, acceptance criteria, and
              operational constraints before agreeing the build. The proposal
              defines the deliverables, fee, and schedule.
            </p>
          </div>
        </div>
      </Section>
      <Section
        id="related-work"
        eyebrow="Relevant experience"
        title={
          slug === "ai-audit"
            ? "Examples from our engineering work."
            : "Work behind the capability."
        }
        tinted
      >
        <ProjectGrid projects={related} />
      </Section>
      {slug === "ai-audit" ? (
        <Section title="From the first conversation to a defined scope">
          <EngagementGrid items={pricing.engagements.slice(0, 2)} />
        </Section>
      ) : (
        <Section title="From discovery to handover">
          <DeliveryTimeline steps={home.process} />
        </Section>
      )}
      <Section
        eyebrow="Operational care"
        title="Designed for the system you will actually run."
        tinted
      >
        <BulletList items={service.safeguards} />
      </Section>
      <Section title="Before we get started">
        <FAQ items={service.faq} />
        <div className="mt-8 flex flex-wrap gap-4">
          {services
            .filter(
              (s) =>
                s.parentService === slug ||
                (slug === "ai-agents" &&
                  s.slug.current === "mcp-ai-infrastructure"),
            )
            .map((s) => (
              <Link
                className="border-line text-signal rounded-full border px-4 py-2 text-sm"
                href={`/services/${s.slug.current}`}
                key={s._id}
              >
                {s.title}
              </Link>
            ))}
          {service.parentService && service.parentService !== "engagement" && (
            <Link
              className="text-signal text-sm underline"
              href={`/services/${service.parentService}`}
            >
              Explore the broader service
            </Link>
          )}
        </div>
      </Section>
      <ClosingCTA />
    </Shell>
  );
}
