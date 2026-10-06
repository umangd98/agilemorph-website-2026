import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/marketing/Shell";
import {
  ClosingCTA,
  Eyebrow,
  statusLabels,
  WorkflowDiagram,
} from "@/components/marketing/Elements";
import { ProjectArtwork } from "@/components/marketing/ProjectArtwork";
import { Container } from "@/components/Container";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
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
      <section className="case-hero">
        <Container>
          <Link className="case-back-link" href="/work">
            <ArrowLeft size={15} aria-hidden /> All projects
          </Link>
          <Eyebrow>
            {p.category === "company"
              ? "AgileMorph client work"
              : "Previous team engagement"}{" "}
            · {statusLabels[p.status]}
          </Eyebrow>
          <div className="case-heading">
            <h1>{p.title}</h1>
            <p className="case-heading-description">{p.summary}</p>
          </div>
          <ProjectArtwork project={p} />
          <dl className="case-meta">
            <div>
              <dt>Client / organization</dt>
              <dd>{p.client}</dd>
            </div>
            <div>
              <dt>Our relationship</dt>
              <dd>{p.attribution}</dd>
            </div>
          </dl>
        </Container>
      </section>
      <Container>
        <div className="case-layout">
          <nav className="case-index" aria-label="Case study chapters">
            <span className="studio-eyebrow">Inside the project</span>
            <a href="#challenge">01 / The challenge</a>
            <a href="#approach">02 / What was built</a>
            <a href="#outcome">03 / Evidence & outcome</a>
            <a href="#capabilities">04 / The engineering</a>
          </nav>
          <div>
            <section className="case-chapter" id="challenge">
              <Eyebrow>01 / The challenge</Eyebrow>
              <h2>What needed to change.</h2>
              <p>{p.problem}</p>
            </section>
            <section className="case-chapter" id="approach">
              <Eyebrow>02 / What was built</Eyebrow>
              <h2>
                {p.category === "company"
                  ? "From business problem to working system."
                  : "Kaustumbh’s contribution."}
              </h2>
              <p>{p.contribution}</p>
              {!!p.workflow?.length && <WorkflowDiagram steps={p.workflow} />}
              {!!p.solution?.length && (
                <div className="case-decisions">
                  {p.solution.map((decision, i) => (
                    <div className="case-decision" key={decision}>
                      <span>0{i + 1}</span>
                      <p>{decision}</p>
                    </div>
                  ))}
                </div>
              )}
              {p.visuals?.map((image, i) => (
                <SanityImage
                  key={i}
                  image={image}
                  alt={image.alt ?? `${p.title} project visual`}
                  width={1200}
                  height={750}
                  className="mt-8 h-auto w-full rounded-md"
                />
              ))}
            </section>
            <section className="case-chapter" id="outcome">
              <Eyebrow>03 / Evidence & outcome</Eyebrow>
              <h2>What the work demonstrates.</h2>
              {p.status === "delivered" && !!p.results?.length && (
                <div className="case-results">
                  {p.results.map((r) => (
                    <div key={r.label}>
                      <strong>{r.value}</strong>
                      <p>{r.label}</p>
                    </div>
                  ))}
                </div>
              )}
              <p>{p.outcome}</p>
              {p.category === "previous" && (
                <p className="case-results-note">
                  Results are reported in Kaustumbh’s account of this
                  engagement. They describe this implementation and are not a
                  forecast for another project.
                </p>
              )}
            </section>
            <section className="case-chapter" id="capabilities">
              <Eyebrow>04 / The engineering</Eyebrow>
              <h2>Tools and related capabilities.</h2>
              <div className="project-stack mb-6">
                {p.stack?.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {services
                  .filter((s) => p.services.includes(s.slug.current))
                  .map((s) => (
                    <Link
                      className="studio-text-link"
                      key={s._id}
                      href={`/services/${s.slug.current}`}
                    >
                      {s.title}
                      <ArrowUpRight size={15} aria-hidden />
                    </Link>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
      <ClosingCTA />
    </Shell>
  );
}
