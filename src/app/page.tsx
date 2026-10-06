import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { Container } from "@/components/Container";
import { Shell } from "@/components/marketing/Shell";
import {
  Action,
  ClosingCTA,
  EngagementGrid,
  Eyebrow,
  FAQ,
  FeedbackGrid,
  ProjectGrid,
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
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-44 sm:pb-24">
        <div
          aria-hidden
          className="from-primary/5 via-background to-background pointer-events-none absolute inset-0 -z-10 bg-linear-to-br"
        />
        <Container>
          <div className="grid items-end gap-12 lg:grid-cols-[1.5fr_0.7fr]">
            <div>
              <Eyebrow>Software · AI · Engineering</Eyebrow>
              <h1 className="max-w-4xl text-5xl leading-[1.06] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
                {home.hero.heading}
              </h1>
              <div className="text-fg-muted mt-7 max-w-2xl text-lg leading-relaxed">
                <PortableText value={home.hero.tagline ?? []} />
              </div>
              <p className="text-fg-muted mt-5 max-w-xl text-sm leading-relaxed">
                {home.hero.audience}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
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
            <div className="border-line bg-bg-elevated rounded-2xl border p-7">
              <p className="text-signal font-mono text-[10px] tracking-widest uppercase">
                From problem to production
              </p>
              {[
                "Understand the business",
                "Build the right system",
                "Make it work in practice",
              ].map((s, i) => (
                <div
                  className="border-line flex gap-4 border-b py-6 last:border-0 last:pb-0"
                  key={s}
                >
                  <span className="text-signal font-mono text-xs">
                    0{i + 1}
                  </span>
                  <p className="text-lg">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <Section
        eyebrow="Selected work"
        title="Built for the way businesses actually work."
        intro="A selection of delivered AgileMorph engagements. Explore the problem, what we built, and the evidence behind each story."
      >
        <ProjectGrid
          projects={selectProjects(projects, home.featuredProjects)}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {home.audiences.map((a) => (
            <article key={a.title}>
              <h3 className="text-xl font-medium">{a.title}</h3>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                {a.description}
              </p>
              <Link
                className="text-signal mt-5 block text-sm underline"
                href={`/services/${a.service}`}
              >
                Explore the service
              </Link>
              {projects.find((p) => p._id === a.project._ref)?.detailed && (
                <Link
                  className="text-fg-muted mt-3 block text-sm underline"
                  href={`/work/${projects.find((p) => p._id === a.project._ref)!.slug.current}`}
                >
                  See relevant work
                </Link>
              )}
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
          <ProjectGrid
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
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {home.process.map((s, i) => (
            <article key={s.title}>
              <p className="text-signal mb-5 font-mono text-xs">0{i + 1}</p>
              <h3 className="text-xl font-medium">{s.title}</h3>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                {s.description}
              </p>
            </article>
          ))}
        </div>
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
