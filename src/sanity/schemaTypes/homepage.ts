import { defineField, defineType } from "sanity";
import {
  versionField,
  textField,
  projectReferences,
  simpleSteps,
} from "./reviewedFields";
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    versionField,
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        textField("heading", "Heading"),
        defineField({
          name: "tagline",
          title: "Introduction",
          type: "array",
          of: [{ type: "block" }],
        }),
        textField("audience", "Audience line"),
        defineField({
          name: "ctaPrimary",
          title: "Primary action",
          type: "ctaButton",
        }),
        defineField({
          name: "ctaSecondary",
          title: "Secondary action",
          type: "ctaButton",
        }),
      ],
    }),
    projectReferences("featuredProjects", "Selected company work"),
    defineField({
      name: "technologies",
      title: "Supporting technology logos",
      type: "array",
      of: [{ type: "integrationItem" }],
      description:
        "Tools used in documented work; these are not partnership credentials.",
    }),
    defineField({
      name: "audiences",
      title: "Who we help",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            textField("title", "Buyer"),
            textField("description", "Situation", "text"),
            textField("service", "Related service slug"),
            defineField({
              name: "project",
              title: "Relevant project",
              type: "reference",
              to: [{ type: "caseStudy" }],
            }),
          ],
        },
      ],
    }),
    simpleSteps("process", "Delivery process"),
    defineField({
      name: "faq",
      title: "Frequently asked questions",
      type: "array",
      of: [{ type: "faqItem" }],
    }),
    defineField({
      name: "testimonials",
      title: "Client feedback",
      type: "object",
      fields: [
        defineField({
          name: "items",
          title: "Quotes",
          type: "array",
          of: [{ type: "testimonial" }],
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
