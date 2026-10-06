import { defineField, defineType } from "sanity";
import { versionField, textField, strings } from "./reviewedFields";
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Project / Case Study",
  type: "document",
  fields: [
    versionField,
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    textField("client", "Public client name or anonymous descriptor"),
    defineField({
      name: "category",
      title: "Relationship",
      type: "string",
      options: {
        list: [
          { title: "AgileMorph client work", value: "company" },
          { title: "Previous team engagement", value: "previous" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "status",
      title: "Delivery status",
      type: "string",
      options: {
        list: [
          { title: "Delivered", value: "delivered" },
          { title: "In progress", value: "in-progress" },
          { title: "Specification / design", value: "scoped" },
          { title: "Active partnership", value: "active" },
        ],
      },
      validation: (r) => r.required(),
    }),
    textField("attribution", "Public relationship attribution", "text"),
    textField("summary", "Summary", "text"),
    strings("services", "Related service slugs"),
    defineField({
      name: "detailed",
      title: "Publish a detailed case-study page",
      type: "boolean",
      initialValue: false,
    }),
    ...["problem", "contribution", "outcome"].map((n) =>
      textField(n, n.charAt(0).toUpperCase() + n.slice(1), "text"),
    ),
    strings("solution", "Delivered capabilities"),
    strings("workflow", "Illustrated workflow steps"),
    strings("stack", "Tools used"),
    defineField({
      name: "results",
      title: "Documented results",
      description:
        "Only measured outcomes for delivered work. Keep scope and qualifiers in the labels and outcome.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            textField("value", "Value"),
            textField("label", "Context / label"),
          ],
        },
      ],
      validation: (r) =>
        r.custom((v, context) =>
          v?.length && context.document?.status !== "delivered"
            ? "Results require delivered status"
            : true,
        ),
    }),
    defineField({
      name: "visuals",
      title: "Real project visuals",
      type: "array",
      of: [{ type: "image", fields: [textField("alt", "Description")] }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  validation: (r) =>
    r.custom((d) =>
      d?.detailed && (!d.problem || !d.contribution || !d.outcome)
        ? "Detailed pages need a problem, contribution, and outcome."
        : true,
    ),
  preview: { select: { title: "title", subtitle: "client" } },
});
