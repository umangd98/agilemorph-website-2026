import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
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
  return (
    <p className="text-signal mb-4 font-mono text-xs tracking-[0.16em] uppercase">
      {children}
    </p>
  );
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
      className={`border-line scroll-mt-24 border-t py-16 sm:py-24 ${tinted ? "bg-bg-elevated" : ""}`}
    >
      <Container>
        <div className="mb-9 max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 className="text-3xl leading-tight font-medium tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {intro && (
            <p className="text-fg-muted mt-4 max-w-2xl text-base leading-relaxed">
              {intro}
            </p>
          )}
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
    <section className="pt-32 pb-16 sm:pt-40 sm:pb-20">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl text-4xl leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="text-fg-muted mt-6 max-w-2xl text-lg leading-relaxed">
          {description}
        </p>
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
    <article className="group border-line bg-background flex h-full flex-col rounded-2xl border p-6 sm:p-7">
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
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard project={p} key={p._id} />
      ))}
    </div>
  );
}
export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {services.map((s, i) => (
        <Link
          key={s._id}
          href={`/services/${s.slug.current}`}
          className="group border-line bg-background hover:border-primary rounded-2xl border p-7 transition-colors"
        >
          <div className="flex justify-between">
            <span className="text-signal font-mono text-xs">0{i + 1}</span>
            <ArrowUpRight
              size={20}
              aria-hidden
              className="text-fg-muted group-hover:text-signal"
            />
          </div>
          <h3 className="mt-7 text-2xl font-medium">{s.title}</h3>
          <p className="text-fg-muted mt-3 max-w-lg text-sm leading-relaxed">
            {s.description}
          </p>
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
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((e, i) => (
        <article
          key={e.title}
          className="border-line bg-background rounded-2xl border p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <span className="text-signal font-mono text-xs">0{i + 1}</span>
            <span className="bg-primary/10 text-signal rounded-full px-3 py-1 text-xs">
              {e.label}
            </span>
          </div>
          <h3 className="mt-6 text-2xl font-medium">{e.title}</h3>
          <p className="text-fg-muted mt-3 mb-6 text-sm leading-relaxed">
            {e.description}
          </p>
          <BulletList items={e.deliverables} />
        </article>
      ))}
    </div>
  );
}
export function FeedbackGrid({ items }: { items: Feedback[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((t) => (
        <figure
          key={t.name}
          className="border-line bg-background rounded-2xl border p-7"
        >
          <p className="text-signal mb-4 font-mono text-[10px] tracking-wider uppercase">
            {t.relationship === "client"
              ? "Client feedback"
              : "Professional recommendation"}
          </p>
          <blockquote className="text-base leading-relaxed">
            “{t.quote}”
          </blockquote>
          <figcaption className="border-line mt-6 border-t pt-4">
            <p className="font-medium">{t.name}</p>
            <p className="text-fg-muted mt-1 text-sm">{t.company}</p>
            {t.sourceUrl && (
              <a
                className="text-signal mt-3 inline-block text-sm underline"
                href={t.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                View source
              </a>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
export function TeamGrid({ members }: { members: Leader[] }) {
  return (
    <div
      className={`grid gap-6 md:grid-cols-2 ${members.length > 2 ? "lg:grid-cols-3" : ""}`}
    >
      {members.map((m) => (
        <article
          key={m.name}
          className="border-line bg-background overflow-hidden rounded-2xl border"
        >
          <div className="bg-primary/5 relative h-64">
            {m.portrait ? (
              <Image
                src={m.portrait}
                alt={m.name}
                fill
                sizes="(max-width: 768px) 90vw, 33vw"
                className="object-contain object-bottom"
              />
            ) : hasImageAsset(m.image) ? (
              <SanityImage
                image={m.image!}
                fill
                alt={m.name}
                sizes="33vw"
                className="object-contain object-bottom"
              />
            ) : null}
          </div>
          <div className="p-6">
            <p className="text-signal font-mono text-xs">{m.role}</p>
            <h3 className="mt-3 text-2xl font-medium">{m.name}</h3>
            <p className="text-fg-muted mt-4 text-sm leading-relaxed">
              {m.bio}
            </p>
            {m.focus && (
              <p className="border-line text-fg-muted mt-5 border-t pt-4 text-xs leading-relaxed">
                {m.focus}
              </p>
            )}
            {m.profileUrl && (
              <a
                className="text-signal mt-4 inline-block text-sm underline"
                href={m.profileUrl}
              >
                Professional profile
              </a>
            )}
            {m.projectSlugs?.length ? (
              <Link
                className="text-signal mt-4 block text-sm underline"
                href={`/work/${m.projectSlugs[0]}`}
              >
                Explore related work
              </Link>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
export function ClosingCTA() {
  return (
    <section className="border-line bg-primary/5 border-t py-16 sm:py-24">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <Eyebrow>Start a conversation</Eyebrow>
            <h2 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              What does your business need to build next?
            </h2>
            <p className="text-fg-muted mt-4 text-base leading-relaxed">
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
    <figure className="border-line bg-primary/5 rounded-2xl border p-5 sm:p-8">
      <figcaption className="text-fg-muted mb-6 font-mono text-[10px] tracking-wider uppercase">
        Workflow illustration · based on the documented system
      </figcaption>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li
            key={s}
            className="border-line bg-background rounded-xl border p-5"
          >
            <p className="text-signal mb-5 font-mono text-xs">
              0{i + 1} <span aria-hidden>→</span>
            </p>
            <p className="text-sm leading-relaxed font-medium">{s}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
