import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/marketing/Shell";
import {
  BulletList,
  ClosingCTA,
  PageIntro,
  Section,
  statusLabels,
  WorkflowDiagram,
} from "@/components/marketing/Elements";
import { SanityImage } from "@/components/SanityImage";
import { getProjects, getServices } from "@/lib/content";
import { pageMetadata, seoToMetadata } from "@/lib/seo";
type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() {
  return (await getProjects())
    .filter((p) => p.detailed)
    .map((p) => ({ slug: p.slug.current }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = (await getProjects()).find(
    (p) => p.slug.current === slug && p.detailed,
  );
  return seoToMetadata(
    p?.seo,
    pageMetadata(
      p?.title ?? "Project not found",
      p
        ? `${p.client}. ${p.summary} ${p.category === "previous" ? "Previous team engagement." : "AgileMorph engagement."}`
        : "Explore AgileMorph’s work.",
      `/work/${slug}`,
    ),
  );
}
export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const [projects, services] = await Promise.all([
    getProjects(),
    getServices(),
  ]);
  const p = projects.find((p) => p.slug.current === slug && p.detailed);
  if (!p) notFound();
  return (
    <Shell>
      <PageIntro
        eyebrow={`${p.category === "company" ? "AgileMorph client work" : "Previous team engagement"} · ${statusLabels[p.status]}`}
        title={p.title}
        description={p.summary}
      >
        <div className="border-primary mt-8 max-w-3xl border-l-2 pl-5">
          <p className="font-medium">{p.client}</p>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            {p.attribution}
          </p>
        </div>
      </PageIntro>
      <Section eyebrow="The problem" title="What needed to change">
        <p className="text-fg-muted max-w-3xl text-lg leading-relaxed">
          {p.problem}
        </p>
      </Section>
      <Section
        eyebrow="Our contribution"
        title={
          p.category === "company"
            ? "What AgileMorph delivered"
            : "Kaustumbh’s contribution"
        }
        tinted
      >
        <p className="text-fg-muted mb-8 max-w-3xl text-lg leading-relaxed">
          {p.contribution}
        </p>
        {p.solution && <BulletList items={p.solution} />}
        <div className="mt-10">
          {!!p.workflow?.length && <WorkflowDiagram steps={p.workflow} />}
        </div>
        {p.visuals?.map((image, i) => (
          <SanityImage
            key={i}
            image={image}
            alt={image.alt ?? `${p.title} project visual`}
            width={1200}
            height={750}
            className="mt-8 h-auto w-full rounded-xl"
          />
        ))}
      </Section>
      <Section eyebrow="Evidence & outcome" title="What the work demonstrates">
        {p.status === "delivered" && p.results?.length ? (
          <div className="mb-8 grid gap-5 sm:grid-cols-2">
            {p.results.map((r) => (
              <div className="border-line rounded-xl border p-7" key={r.label}>
                <p className="text-signal text-5xl font-medium">{r.value}</p>
                <p className="text-fg-muted mt-3 text-sm">{r.label}</p>
              </div>
            ))}
          </div>
        ) : null}
        <p className="text-fg-muted max-w-3xl text-base leading-relaxed">
          {p.outcome}
        </p>
        {p.category === "previous" && (
          <p className="text-fg-muted mt-4 max-w-3xl text-xs leading-relaxed">
            Results are reported in Kaustumbh’s account of this engagement. They
            describe this implementation and are not a forecast for another
            project.
          </p>
        )}
      </Section>
      <Section
        eyebrow="Delivery context"
        title="Tools and related capabilities"
        tinted
      >
        <div className="mb-7 flex flex-wrap gap-2">
          {p.stack?.map((t) => (
            <span
              className="border-line bg-background rounded-full border px-4 py-2 text-xs"
              key={t}
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {services
            .filter((s) => p.services.includes(s.slug.current))
            .map((s) => (
              <Link
                className="text-signal text-sm underline"
                href={`/services/${s.slug.current}`}
                key={s._id}
              >
                {s.title}
              </Link>
            ))}
        </div>
        <Link
          href="/work"
          className="text-fg-muted mt-8 inline-block text-sm underline"
        >
          ← All projects
        </Link>
      </Section>
      <ClosingCTA />
    </Shell>
  );
}
