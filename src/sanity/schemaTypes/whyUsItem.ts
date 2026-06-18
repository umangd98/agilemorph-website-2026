import { defineField, defineType } from "sanity";

const ANIMATION_TYPES = [
  { title: "Innovation", value: "innovation" },
  { title: "Professionalism", value: "professionalism" },
  { title: "Expertise", value: "expertise" },
  { title: "Partnership", value: "partnership" },
  { title: "Generic", value: "generic" },
] as const;

export const whyUsItem = defineType({
  name: "whyUsItem",
  title: "Why Us Item",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "Shown in the tab rail and detail panel.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Short tag pills shown below the description (max 3).",
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "animationType",
      title: "Animation Type",
      type: "string",
      options: { list: [...ANIMATION_TYPES], layout: "radio" },
      initialValue: "generic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "animationLabels",
      title: "Animation Labels",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Labels rendered inside the stage animation (max 3). Innovation: idea bubbles. Expertise: skill bars. Partnership: milestones.",
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {
      title: "title",
      animationType: "animationType",
      highlight: "highlights.0",
    },
    prepare({ title, animationType, highlight }) {
      const subtitle = [animationType, highlight].filter(Boolean).join(" · ");
      return { title, subtitle };
    },
  },
});
