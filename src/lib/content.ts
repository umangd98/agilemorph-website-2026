import "server-only";
import { cache } from "react";
import reviewed from "@/data/reviewed-content.json";
import { sanityFetch } from "@/sanity/fetch";
import { blogPostQuery } from "@/sanity/queries";
import type { BlogPost } from "@/sanity/types";
import type {
  ContentDocument,
  Project,
  ProjectRef,
  Service,
} from "./content-types";

export function usesReviewedContent() {
  const source = process.env.CONTENT_SOURCE ?? "sanity";
  if (!["sanity", "reviewed"].includes(source))
    throw new Error("CONTENT_SOURCE must be sanity or reviewed");
  return source === "reviewed";
}

// The public document projection deliberately excludes revision and system data.
const projection = `{..., "_rev": null, "_system": null}`;
export const getContent = cache(
  async <T extends ContentDocument>(id: string): Promise<T> => {
    const doc = usesReviewedContent()
      ? reviewed.find((item) => item._id === id)
      : await sanityFetch<T | null>({
          query: `*[_id == $id][0]${projection}`,
          params: { id },
          tags: [id, "reviewedContent"],
        });
    if (!doc || doc.contentVersion !== 2) {
      throw new Error(
        `Reviewed content unavailable for ${id}. Preview with CONTENT_SOURCE=reviewed or apply the reviewed-content migration before production rollout.`,
      );
    }
    return doc as unknown as T;
  },
);

async function getCollection<T extends ContentDocument>(
  type: string,
): Promise<T[]> {
  if (usesReviewedContent())
    return reviewed.filter((d) => d._type === type) as unknown as T[];
  return sanityFetch<T[]>({
    query: `*[_type == $type && contentVersion == 2] | order(_id asc) ${projection}`,
    params: { type },
    tags: [type, "reviewedContent"],
  });
}
export const getProjects = cache(() => getCollection<Project>("caseStudy"));
export const getServices = cache(() => getCollection<Service>("servicePage"));
export const getBlogPost = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const post = await sanityFetch<BlogPost | null>({
      query: blogPostQuery,
      params: { slug },
      tags: ["blogPost", `blogPost:${slug}`],
    });
    if (!post || !usesReviewedContent()) return post;
    // Preview only the reviewed corrections; article identity, assets, and metadata stay in Sanity.
    const correction = reviewed.find(
      (d) => d._type === "blogPost" && d._id === post._id,
    ) as { body?: unknown[] } | undefined;
    return correction?.body ? { ...post, body: correction.body } : post;
  },
);
export const primaryServiceOrder = [
  "software-development",
  "ai-agents",
  "ai-automation",
  "data-platforms",
];
export function primaryServices(services: Service[]) {
  return primaryServiceOrder.flatMap((slug) =>
    services.filter((s) => s.slug.current === slug),
  );
}
export function selectProjects(
  projects: Project[],
  refs?: ProjectRef[] | null,
) {
  return (refs ?? []).flatMap((ref) =>
    projects.filter((p) => p._id === ref._ref),
  );
}
