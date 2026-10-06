import type { Project } from "./content-types";
export function filterProjects(projects: Project[], capability: string) {
  return projects.filter(
    (project) => capability === "all" || project.services.includes(capability),
  );
}
export function groupProjects(projects: Project[]) {
  return {
    company: projects.filter(
      (p) => p.category === "company" && p.status === "delivered",
    ),
    previous: projects.filter(
      (p) => p.category === "previous" && p.status === "delivered",
    ),
    ongoing: projects.filter((p) => p.status !== "delivered"),
  };
}
