import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/content-types";
import { ProjectArtwork } from "./ProjectArtwork";
import { statusLabels } from "./Elements";

export function ProjectShowcase({
  projects,
  featured = false,
}: {
  projects: Project[];
  featured?: boolean;
}) {
  return (
    <div
      className={`project-showcase-grid ${featured ? "has-featured-project" : ""}`}
    >
      {projects.map((p, index) => (
        <article
          key={p._id}
          className={`project-showcase-item ${featured && index === 0 ? "project-showcase-lead" : ""}`}
        >
          <Link
            className="project-art-link"
            href={`/work/${p.slug.current}`}
            aria-label={`View ${p.client}: ${p.title}`}
          >
            <ProjectArtwork project={p} />
          </Link>
          <div className="project-showcase-copy">
            <div className="project-kicker">
              <span>
                {p.category === "company"
                  ? "AgileMorph client work"
                  : "Prior team engagement"}
              </span>
              <span>{statusLabels[p.status]}</span>
            </div>
            <p className="project-client">{p.client}</p>
            <h3>
              <Link href={`/work/${p.slug.current}`}>{p.title}</Link>
            </h3>
            <p className="project-summary">{p.summary}</p>
            {p.results?.[0] && p.status === "delivered" && (
              <div className="project-inline-result">
                <strong>{p.results[0].value}</strong>
                <span>{p.results[0].label}</span>
              </div>
            )}
            {!!p.stack?.length && (
              <div className="project-stack">
                {p.stack.slice(0, 4).map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            )}
            <Link className="studio-text-link" href={`/work/${p.slug.current}`}>
              Read case study <ArrowUpRight size={18} aria-hidden />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="project-list">
      {projects.map((p) => (
        <article key={p._id} className="project-list-row">
          <div>
            <span className="project-list-status">
              {statusLabels[p.status]}
            </span>
            <h3>{p.title}</h3>
            <p className="project-client">{p.client}</p>
          </div>
          <div>
            <p className="project-summary">{p.summary}</p>
            <p className="project-list-attribution">{p.attribution}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ExperienceStrip({ projects }: { projects: Project[] }) {
  return (
    <div className="experience-strip">
      {projects.map((p) => (
        <Link
          href={`/work/${p.slug.current}`}
          key={p._id}
          className="experience-proof"
        >
          <span className="project-kicker">
            Prior Kaustumbh engagement · {p.client}
          </span>
          <div>
            <strong>{p.results?.[0]?.value}</strong>
            <ArrowRight size={22} aria-hidden />
          </div>
          <p>{p.results?.[0]?.label}</p>
        </Link>
      ))}
    </div>
  );
}
