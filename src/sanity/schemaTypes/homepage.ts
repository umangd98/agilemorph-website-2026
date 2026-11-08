import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({
          name: "badge",
          title: "Badge",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "text",
          rows: 3,
          description: "Main heading lines. Use a new line for each line break.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "headingAccent",
          title: "Heading Accent",
          type: "string",
          description: "Optional final line rendered with the accent gradient.",
        }),
        defineField({
          name: "tagline",
          title: "Tagline",
          type: "array",
          of: [
            {
              type: "block",
              styles: [{ title: "Normal", value: "normal" }],
              lists: [],
              marks: {
                decorators: [],
                annotations: [
                  {
                    name: "link",
                    type: "object",
                    title: "Link",
                    fields: [
                      defineField({
                        name: "href",
                        title: "URL",
                        type: "url",
                        validation: (rule) =>
                          rule.uri({
                            allowRelative: true,
                            scheme: ["http", "https", "mailto", "tel"],
                          }),
                      }),
                    ],
                  },
                ],
              },
            },
          ],
        }),
        defineField({
          name: "ctaPrimary",
          title: "Primary CTA",
          type: "ctaButton",
        }),
        defineField({
          name: "ctaSecondary",
          title: "Secondary CTA",
          type: "ctaButton",
        }),
        defineField({
          name: "proofPoints",
          title: "Proof strip",
          type: "array",
          of: [{ type: "string" }],
          description: "Short proof points shown under the buttons. Approved facts only.",
        }),
        defineField({
          name: "explainer",
          title: "Explainer",
          type: "text",
          rows: 3,
          description: "The one-line plain-English explanation of Forward Deployed Engineering.",
        }),
        defineField({
          name: "image",
          title: "Hero Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "partners",
      title: "Partners Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Partners",
          type: "array",
          of: [{ type: "partnerItem" }],
        }),
      ],
    }),
    defineField({ name: "problem", title: "The problem", type: "cardGridBlock" }),
    defineField({ name: "fde", title: "What FDE means", type: "comparisonBlock" }),
    defineField({ name: "phases", title: "How we work", type: "phaseBlock" }),
    defineField({ name: "caseStudies", title: "Case studies", type: "caseStudyListBlock" }),
    defineField({ name: "founders", title: "Who you'll work with", type: "foundersBlock" }),
    defineField({ name: "capabilities", title: "What we build", type: "cardGridBlock" }),
    defineField({ name: "security", title: "Security and ownership", type: "cardGridBlock" }),
    defineField({ name: "clientTypes", title: "Client types", type: "cardGridBlock" }),
    defineField({ name: "finalCta", title: "Final CTA", type: "ctaBlock" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
