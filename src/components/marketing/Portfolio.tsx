"use client";
import { useState } from "react";
import { filterProjects, groupProjects } from "@/lib/portfolio";
import { ProjectShowcase, ProjectList } from "./ProjectShowcase";
import type { Project } from "@/lib/content-types";
const filters = [
  ["all", "All capabilities"],
  ["software-development", "Software"],
  ["ai-agents", "AI products"],
  ["ai-automation", "Automation"],
  ["data-platforms", "Data platforms"],
] as const;
export function Portfolio({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("all");
  const visible = filterProjects(projects, filter);
  const grouped = groupProjects(visible);
  const groups = [
    {
      title: "AgileMorph client work",
      description: "Engagements delivered by the company.",
      items: grouped.company,
    },
    {
      title: "Our team’s previous client work",
      description:
        "Work from previous engagements, with the contribution and relationship stated on each project.",
      items: grouped.previous,
    },
    {
      title: "In progress, scoped & ongoing",
      description:
        "Current work, completed specifications, and partnership examples. These are not presented as delivered platform outcomes.",
      items: grouped.ongoing,
    },
  ];
  return (
    <>
      <div
        role="group"
        aria-label="Filter projects by capability"
        className="mb-12 flex flex-wrap gap-2"
      >
        {filters.map(([id, label]) => (
          <button
            aria-pressed={filter === id}
            key={id}
            onClick={() => setFilter(id)}
            className={`rounded-full border px-4 py-2.5 text-sm ${filter === id ? "border-primary bg-signal text-bg" : "border-line bg-background text-fg-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {visible.length} projects shown
      </p>
      {visible.length === 0 ? (
        <p className="border-line rounded-xl border p-8">
          No projects match this capability.{" "}
          <button
            className="text-signal underline"
            onClick={() => setFilter("all")}
          >
            View all work
          </button>
        </p>
      ) : (
        groups
          .filter((g) => g.items.length)
          .map((g) => (
            <section className="portfolio-group" key={`${filter}-${g.title}`}>
              <div className="portfolio-group-heading">
                <h2>{g.title}</h2>
                <p>{g.description}</p>
              </div>
              <ProjectShowcase projects={g.items.filter((p) => p.detailed)} />
              {!!g.items.filter((p) => !p.detailed).length && (
                <div className="portfolio-additional">
                  {g.items.some((p) => p.detailed) && (
                    <p>Additional experience</p>
                  )}
                  <ProjectList projects={g.items.filter((p) => !p.detailed)} />
                </div>
              )}
            </section>
          ))
      )}
    </>
  );
}
