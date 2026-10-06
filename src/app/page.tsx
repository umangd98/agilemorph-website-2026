import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ArrowDownRight } from "lucide-react";
import { SystemShowcase } from "@/components/marketing/SystemShowcase";
import {
  ProjectShowcase,
  ExperienceStrip,
} from "@/components/marketing/ProjectShowcase";
import { Container } from "@/components/Container";
import { Shell } from "@/components/marketing/Shell";
import {
  Action,
  ClosingCTA,
  DeliveryTimeline,
  EngagementGrid,
  Eyebrow,
  FAQ,
  FeedbackGrid,
  Section,
  ServiceGrid,
  TeamGrid,
} from "@/components/marketing/Elements";
import { StructuredData } from "@/components/StructuredData";
import { SanityImage, hasImageAsset } from "@/components/SanityImage";
import { faqPageSchema } from "@/lib/structured-data";
import {
  getContent,
  getProjects,
  getServices,
  primaryServices,
  selectProjects,
} from "@/lib/content";
import type {
  AboutContent,
  HomeContent,
  PricingContent,
  SettingsContent,
} from "@/lib/content-types";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
const fallbackMetadata = pageMetadata(
  "Software & AI Engineering Partner",
  "Software, AI products, data platforms, and operational automation for SMBs and enterprises. Explore AgileMorph’s work and our team’s previous engagements.",
  "/",
);
export async function generateMetadata() {
  const document = await getContent<HomeContent>("homepage");
  return seoToMetadata(document.seo, fallbackMetadata);
}
export default async function HomePage() {
  const [home, about, pricing, settings, projects, services] =
    await Promise.all([
      getContent<HomeContent>("homepage"),
      getContent<AboutContent>("aboutPage"),
      getContent<PricingContent>("pricingPage"),
      getContent<SettingsContent>("siteSettings"),
      getProjects(),
      getServices(),
    ]);
  return (
    <Shell>
      <section className="studio-hero">
        <Container>
          <div className="studio-hero-grid">
            <div>
              <Eyebrow>Independent engineering. Real-world impact.</Eyebrow>
              <h1>
                {home.hero.heading.endsWith("business.") ? (
                  <>
                    {home.hero.heading.slice(0, -9)}
                    <em>business.</em>
                  </>
                ) : (
                  home.hero.heading
                )}
              </h1>
              <div className="studio-hero-intro">
                <PortableText value={home.hero.tagline ?? []} />
              </div>
              <p className="studio-hero-audience">{home.hero.audience}</p>
              <div className="studio-hero-actions">
                <Action href={home.hero.ctaPrimary?.href ?? "/contact#book"}>
                  {home.hero.ctaPrimary?.label ?? "Discuss your project"}
                </Action>
                <Action
                  href={home.hero.ctaSecondary?.href ?? "/work"}
                  secondary
                >
                  {home.hero.ctaSecondary?.label ?? "See our work"}
                </Action>
              </div>
            </div>
            <SystemShowcase
              projects={[
                "whatsapp-inventory-intake",
                "publisher-content-platform",
                "business-data-search",
              ].flatMap((slug) =>
                projects.filter((p) => p.slug.current === slug && p.detailed),
              )}
            />
          </div>
          <div className="studio-hero-foot">
            <span>
              <ArrowDownRight size={17} aria-hidden /> Explore the systems
              behind the stories
            </span>
            <span>
              Software engineering / AI products / Operational automation
            </span>
          </div>
        </Container>
      </section>
      <Section
        eyebrow="Selected work"
        title="Built for the way businesses actually work."
        intro="A selection of delivered AgileMorph engagements. Explore the problem, what we built, and the evidence behind each story."
      >
        <ProjectShowcase
          projects={selectProjects(projects, home.featuredProjects).filter(
            (p) => p.detailed,
          )}
          featured
        />
        <div className="mt-8">
          <Action href="/work" secondary>
            Explore all our work
          </Action>
        </div>
      </Section>
      <Section
        eyebrow="Who we help"
        title="Start with the problem you need to solve."
        tinted
      >
        <div className="studio-audiences">
          {home.audiences.map((a) => (
            <article key={a.title} className="audience-entry">
              <h3 className="text-xl font-medium">{a.title}</h3>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                {a.description}
              </p>
              <div className="audience-links">
                <Link href={`/services/${a.service}`}>
                  Explore the service ↗
                </Link>
                {projects.find((p) => p._id === a.project._ref)?.detailed && (
                  <Link
                    href={`/work/${projects.find((p) => p._id === a.project._ref)!.slug.current}`}
                  >
                    Relevant work ↗
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
      <Section
        eyebrow="What we build"
        title="Engineering across products, operations, and data."
      >
        <ServiceGrid services={primaryServices(services)} />
      </Section>
      <Section
        eyebrow="The people behind the work"
        title="Senior engineering. Close to your business."
        intro="Kaustumbh’s AI product experience and Umang’s enterprise delivery perspective come together in the decisions that shape your build."
        tinted
      >
        <TeamGrid
          members={about.teamLeads.members.filter((m) =>
            m.role.startsWith("Co-founder"),
          )}
        />
        <div className="mt-10">
          <p className="text-fg-muted mb-5 text-sm">
            Selected results from Kaustumbh’s previous client engagements. These
            are project-specific outcomes, not company-wide performance
            promises.
          </p>
          <ExperienceStrip
            projects={projects.filter((p) =>
              ["punchbowl-support-agent", "certifyos-document-review"].includes(
                p.slug.current,
              ),
            )}
          />
        </div>
      </Section>
      <Section
        eyebrow="How we work"
        title="Clarity before the build. Ownership after it."
      >
        <DeliveryTimeline steps={home.process} />
        {!!settings.credentials?.length && (
          <div className="border-line mt-12 flex flex-wrap items-center gap-4 border-t pt-7">
            <span className="text-fg-muted text-xs">
              Documented credentials
            </span>
            {settings.credentials.map((c) => (
              <span
                className="border-line rounded-full border px-4 py-2 text-xs"
                key={c.name}
              >
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    {c.name} · {c.label}
                  </a>
                ) : (
                  <>
                    {c.name} · {c.label}
                  </>
                )}
              </span>
            ))}
          </div>
        )}
        <p className="text-fg-muted mt-5 text-xs leading-relaxed">
          Tools used across our work: Python, React, PostgreSQL, n8n, Shopify,
          Airtable, Claude, and OpenAI. Platform choices follow the
          requirements.
        </p>
        {!!home.technologies?.length && (
          <div
            className="mt-5 flex flex-wrap gap-x-6 gap-y-4"
            aria-label="Tools used in our work"
          >
            {home.technologies.map((tool) => (
              <div
                key={tool.name}
                className="text-fg-muted flex items-center gap-2 text-xs"
              >
                {hasImageAsset(tool.logo) && (
                  <SanityImage
                    image={tool.logo!}
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                  />
                )}
                {tool.name}
              </div>
            ))}
          </div>
        )}
      </Section>
      {home.testimonials?.items?.some((t) => t.relationship === "client") && (
        <Section
          eyebrow="Client feedback"
          title="From the teams we have worked with."
          tinted
        >
          <FeedbackGrid
            items={home.testimonials.items.filter(
              (t) => t.relationship === "client",
            )}
          />
        </Section>
      )}
      <Section
        eyebrow="Engagements"
        title="A practical way to get started."
        intro="A focused project or a longer technical partnership. The scope comes first."
      >
        <EngagementGrid items={pricing.engagements} />
      </Section>
      <Section eyebrow="Before we talk" title="A few useful answers." tinted>
        <FAQ items={home.faq} />
        <StructuredData data={faqPageSchema(home.faq)!} />
      </Section>
      <ClosingCTA />
    </Shell>
  );
}
