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
      name: "process",
      title: "Process Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "subheading",
          title: "Subheading",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [{ type: "processStep" }],
        }),
      ],
    }),
    defineField({
      name: "services",
      title: "Services Section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "cards",
          title: "Service Cards",
          type: "array",
          of: [{ type: "serviceCard" }],
        }),
      ],
    }),
    defineField({
      name: "whyUs",
      title: "Why Us Section",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          of: [{ type: "whyUsItem" }],
        }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats Section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Statistics",
          type: "array",
          of: [{ type: "stat" }],
        }),
      ],
    }),
    defineField({
      name: "integrations",
      title: "Integrations Marquee",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Integration Tools",
          type: "array",
          of: [{ type: "integrationItem" }],
        }),
      ],
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
    defineField({
      name: "featuredLogos",
      title: "Featured Logos",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "logos",
          title: "Logos",
          type: "array",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  type: "string",
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials Section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "string",
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
        }),
        defineField({
          name: "items",
          title: "Testimonials",
          type: "array",
          of: [{ type: "testimonial" }],
        }),
      ],
    }),
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
