import { defineField, defineType } from "sanity";
import { versionField, textField } from "./reviewedFields";
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    versionField,
    textField("heading", "Heading"),
    textField("introduction", "Introduction", "text"),
    textField("body", "How leadership works", "text"),
    textField("founderProduct", "Founder product background", "text"),
    defineField({
      name: "teamLeads",
      title: "Leadership",
      type: "object",
      fields: [
        textField("heading", "Heading"),
        defineField({
          name: "members",
          title: "Members",
          type: "array",
          of: [{ type: "teamLeadItem" }],
        }),
      ],
    }),
    defineField({
      name: "endorsements",
      title: "Professional recommendations (not client feedback)",
      type: "array",
      of: [{ type: "testimonial" }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
