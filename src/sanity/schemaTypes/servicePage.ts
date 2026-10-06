import { defineField, defineType } from "sanity";
import {
  versionField,
  textField,
  strings,
  projectReferences,
} from "./reviewedFields";
export const servicePage = defineType({
  name: "servicePage",
  title: "Service page",
  type: "document",
  fields: [
    versionField,
    textField("title", "Title"),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    textField("headlineText", "Headline"),
    textField("description", "Audience and problem", "text"),
    defineField({ name: "primary", title: "Primary service", type: "boolean" }),
    textField("parentService", "Parent service slug"),
    strings("deliverables", "Potential deliverables"),
    strings("safeguards", "Operational safeguards"),
    projectReferences(),
    defineField({
      name: "faq",
      title: "FAQs",
      type: "array",
      of: [{ type: "faqItem" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
