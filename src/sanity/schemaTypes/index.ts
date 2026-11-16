import { blogPost } from "./blogPost";
import { diagram, diagramColumn, diagramStep } from "./diagram";
import { seo } from "./seo";

/** Sanity holds the blog only. Marketing page copy lives in src/content. */
export const schemaTypes = [seo, diagramStep, diagramColumn, diagram, blogPost];
