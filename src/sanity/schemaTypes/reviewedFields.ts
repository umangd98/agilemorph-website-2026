import { defineField } from "sanity";
export const versionField = defineField({
  name: "contentVersion",
  title: "Content version",
  type: "number",
  initialValue: 2,
  readOnly: true,
  validation: (r) => r.required().min(2),
});
export const textField = (name: string, title: string, type = "string") =>
  defineField({ name, title, type });
export const strings = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [{ type: "string" }] });
export const projectReferences = (
  name = "featuredProjects",
  title = "Related projects",
) =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
  });
export const simpleSteps = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      {
        type: "object",
        fields: [
          textField("title", "Title"),
          textField("description", "Description", "text"),
        ],
      },
    ],
  });
export const engagementField = defineField({
  name: "engagements",
  title: "Shared engagement options",
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        textField("title", "Title"),
        textField("label", "Price / scope label"),
        textField("description", "Description", "text"),
        strings("deliverables", "Deliverables"),
      ],
    },
  ],
});
