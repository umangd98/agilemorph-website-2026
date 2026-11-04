import { defineArrayMember, defineField, defineType } from "sanity";

type DiagramParent = { variant?: string } | undefined;

const isCompare = ({ parent }: { parent?: unknown }) =>
  (parent as DiagramParent)?.variant === "compare";

export const diagramStep = defineType({
  name: "diagramStep",
  title: "Diagram step",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "detail",
      title: "Detail",
      type: "string",
    }),
    defineField({
      name: "flagged",
      title: "Flag as a failure point",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "detail" },
  },
});

export const diagramColumn = defineType({
  name: "diagramColumn",
  title: "Diagram column",
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
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
});

/**
 * An in-article diagram described as data and drawn by the site, so articles
 * can carry visuals without uploading image files. The text inside is real
 * HTML: readable by search engines and screen readers.
 */
export const diagram = defineType({
  name: "diagram",
  title: "Diagram",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      initialValue: "chain",
      options: {
        list: [
          { title: "Chain: handoffs in sequence", value: "chain" },
          { title: "Ladder: stages that build on each other", value: "ladder" },
          { title: "Layers: a stack, foundation first", value: "layers" },
          { title: "Compare: two columns side by side", value: "compare" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      description: "For chain, ladder and layers. Layers are listed foundation first.",
      type: "array",
      of: [defineArrayMember({ type: "diagramStep" })],
      hidden: isCompare,
    }),
    defineField({
      name: "left",
      title: "Left column",
      type: "diagramColumn",
      hidden: (context) => !isCompare(context),
    }),
    defineField({
      name: "right",
      title: "Right column",
      type: "diagramColumn",
      hidden: (context) => !isCompare(context),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title", variant: "variant" },
    prepare({ title, variant }) {
      return {
        title: title || "Diagram",
        subtitle: variant ? `Diagram (${variant})` : "Diagram",
      };
    },
  },
});
