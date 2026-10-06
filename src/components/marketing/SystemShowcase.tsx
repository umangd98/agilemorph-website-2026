"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "./ProjectArtwork";
import type { Project } from "@/lib/content-types";

export function SystemShowcase({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const project = projects[selected];
  if (!project) return null;
  const labels: Record<string, string> = {
    "whatsapp-inventory-intake": "Operations",
    "publisher-content-platform": "Products",
    "business-data-search": "Data",
  };
  return (
    <div className="system-showcase">
      <div className="showcase-toolbar">
        <span className="showcase-indicator" />{" "}
        <span>A look inside the work</span>
        <span className="showcase-index">
          0{selected + 1} / 0{projects.length}
        </span>
      </div>
      <div
        className="showcase-switcher"
        role="group"
        aria-label="Explore a project workflow"
      >
        {projects.map((p, i) => (
          <button
            key={p._id}
            aria-pressed={i === selected}
            aria-controls={id}
            onClick={() => setSelected(i)}
          >
            {labels[p.slug.current] ?? p.client}
          </button>
        ))}
      </div>
      <div id={id} className="showcase-panel" key={project._id}>
        <ProjectArtwork project={project} hero />
        <Link
          className="showcase-project-link"
          href={`/work/${project.slug.current}`}
        >
          <span>
            <small>Delivered by AgileMorph</small>
            <strong>{project.client}</strong>
          </span>
          <ArrowUpRight size={22} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
