import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { MorphMark, ProjectArtwork } from "./ProjectArtwork";
import { SanityImage, hasImageAsset } from "@/components/SanityImage";
import type { FaqItem } from "@/sanity/types";
import type {
  Engagement,
  Feedback,
  Leader,
  Project,
  Service,
} from "@/lib/content-types";

export const actionClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
export function Action({
  children,
  href = "/contact#book",
  secondary = false,
}: {
  children: ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <Link
      className={
        secondary
          ? `${actionClass} border-line !text-fg hover:!bg-bg-elevated border !bg-transparent`
          : actionClass
      }
      href={href}
    >
      {children}
      <ArrowRight size={16} aria-hidden />
    </Link>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="studio-eyebrow">{children}</p>;
}
export function Section({
  eyebrow,
  title,
  intro,
  children,
  tinted = false,
  id,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  tinted?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`studio-section scroll-mt-24 ${tinted ? "bg-bg-elevated" : ""}`}
    >
      <Container>
        <div className="studio-section-header">
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2>{title}</h2>
          </div>
          {intro && <p>{intro}</p>}
        </div>
        {children}
      </Container>
    </section>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="studio-page-intro">
      <MorphMark className="intro-mark" />
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p className="intro-description">{description}</p>
        {children}
      </Container>
    </section>
  );
}
export const statusLabels: Record<Project["status"], string> = {
  delivered: "Delivered",
  "in-progress": "In progress",
  scoped: "Specification / design",
  active: "Active partnership",
};
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-line flex h-full flex-col border-b pb-7">
      {project.detailed && (
        <div className="mb-6 overflow-hidden rounded-md">
          <ProjectArtwork project={project} />
        </div>
      )}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-wider uppercase">
        <span className="text-signal">
          {project.category === "company"
            ? "AgileMorph engagement"
            : "Prior team engagement"}
        </span>
        <span className="border-line text-fg-muted rounded-full border px-2.5 py-1">
          {statusLabels[project.status]}
        </span>
      </div>
      <p className="text-fg-muted mb-2 text-sm">{project.client}</p>
      <h3 className="text-xl leading-snug font-medium">{project.title}</h3>
      <p className="text-fg-muted mt-4 flex-1 text-sm leading-relaxed">
        {project.summary}
      </p>
      {project.results?.[0] && project.status === "delivered" && (
        <div className="border-line mt-6 border-t pt-4">
          <span className="text-signal text-3xl font-medium">
            {project.results[0].value}
          </span>
          <p className="text-fg-muted mt-1 text-xs leading-relaxed">
            {project.results[0].label}
          </p>
        </div>
      )}
      {project.detailed ? (
        <Link
          className="text-signal mt-7 inline-flex items-center gap-2 text-sm font-medium"
          href={`/work/${project.slug.current}`}
        >
          Read case study <ArrowUpRight size={16} aria-hidden />
        </Link>
      ) : (
        <p className="border-line text-fg-muted mt-6 border-t pt-4 text-xs leading-relaxed">
          {project.attribution}
        </p>
      )}
    </article>
  );
}
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard project={p} key={p._id} />
      ))}
    </div>
  );
}
export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="studio-services">
      {services.map((service, i) => (
        <Link
          href={`/services/${service.slug.current}`}
          key={service._id}
          className="studio-service-row"
        >
          <span className="studio-service-number">0{i + 1}</span>
          <div className="studio-service-content">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
          <ArrowUpRight size={25} aria-hidden />
        </Link>
      ))}
    </div>
  );
}
export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          className="text-fg-muted flex items-start gap-3 text-sm leading-relaxed"
          key={item}
        >
          <Check size={16} className="text-signal mt-1 shrink-0" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}
export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-line border-line max-w-4xl divide-y border-y">
      {items.map((item) => (
        <details className="group py-5" key={item.question}>
          <summary className="marker:text-signal cursor-pointer pr-3 text-base font-medium">
            {item.question}
          </summary>
          <p className="text-fg-muted mt-4 max-w-3xl text-sm leading-relaxed">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
export function EngagementGrid({ items }: { items: Engagement[] }) {
  return (
    <div className="engagement-comparison">
      {items.map((item) => (
        <article key={item.title} className="engagement-row">
          <div>
            <h3>{item.title}</h3>
            <p className="engagement-row-label">{item.label}</p>
          </div>
          <div>
            <p className="engagement-row-description">{item.description}</p>
            <ul>
              {item.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
export function FeedbackGrid({ items }: { items: Feedback[] }) {
  return (
    <div className="studio-feedback">
      {items.map((t) => (
        <figure key={t.name} className="studio-quote">
          <p className="studio-quote-type">
            {t.relationship === "client"
              ? "Client feedback"
              : "Professional recommendation"}
          </p>
          <span className="studio-quote-mark" aria-hidden>
            “
          </span>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <span className="studio-quote-avatar" aria-hidden>
              {t.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <p className="studio-quote-name">{t.name}</p>
              <p className="studio-quote-company">{t.company}</p>
            </div>
          </figcaption>
          {t.sourceUrl && (
            <a
              className="studio-text-link"
              href={t.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              View source <ArrowUpRight size={16} aria-hidden />
            </a>
          )}
        </figure>
      ))}
    </div>
  );
}
export function TeamGrid({ members }: { members: Leader[] }) {
  return (
    <div className={`studio-team ${members.length > 2 ? "has-three" : ""}`}>
      {members.map((m) => (
        <article key={m.name} className="studio-person">
          {(m.portrait || hasImageAsset(m.image)) && (
            <div className="studio-portrait">
              {m.portrait ? (
                <Image
                  src={m.portrait}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 25vw"
                  className="object-contain object-bottom"
                />
              ) : (
                <SanityImage
                  image={m.image!}
                  alt={m.name}
                  fill
                  sizes="(max-width: 640px) 90vw, 30vw"
                  className="object-contain object-bottom"
                />
              )}
            </div>
          )}
          <div>
            <p className="studio-person-role">{m.role}</p>
            <h3>{m.name}</h3>
            <p className="studio-person-bio">{m.bio}</p>
            {m.focus && <p className="studio-person-focus">{m.focus}</p>}
            <div className="studio-person-links">
              {m.profileUrl && (
                <a href={m.profileUrl}>Professional profile ↗</a>
              )}
              {m.projectSlugs?.length ? (
                <Link href={`/work/${m.projectSlugs[0]}`}>Related work ↗</Link>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export function ClosingCTA() {
  return (
    <section className="studio-closing">
      <MorphMark className="closing-mark" />
      <Container>
        <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-end">
          <div>
            <Eyebrow>From your next challenge</Eyebrow>
            <h2>To something that works.</h2>
            <p>
              Bring the problem, the current tools, and the outcome you need. A
              free 15-minute call helps us establish fit and a useful next step.
            </p>
          </div>
          <Action>Discuss your project</Action>
        </div>
      </Container>
    </section>
  );
}
export function WorkflowDiagram({ steps }: { steps: string[] }) {
  return (
    <figure className="workflow-strip">
      <figcaption>
        Workflow illustration · based on the documented system
      </figcaption>
      <ol>
        {steps.map((step, i) => (
          <li key={step}>
            <span>0{i + 1} →</span>
            {step}
          </li>
        ))}
      </ol>
    </figure>
  );
}
export function DeliveryTimeline({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <div className="delivery-timeline">
      {steps.map((step, i) => (
        <article key={step.title} className="delivery-step">
          <span className="delivery-step-number">0{i + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>
      ))}
    </div>
  );
}
