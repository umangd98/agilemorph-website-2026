import { defineField, defineType } from "sanity";
import { textField, strings } from "./reviewedFields";
export const diagramColumn = defineType({
  name: "diagramColumn",
  title: "Diagram column",
  type: "object",
  fields: [textField("heading", "Heading"), strings("items", "Items")],
});
const column = (name: string) =>
  defineField({
    name,
    title: name,
    type: "diagramColumn",
  });
export const diagram = defineType({
  name: "diagram",
  title: "Workflow / comparison diagram",
  type: "object",
  fields: [
    textField("title", "Title"),
    textField("caption", "Caption", "text"),
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: { list: ["chain", "ladder", "compare"] },
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          name: "diagramStep",
          fields: [
            textField("label", "Label"),
            textField("detail", "Detail", "text"),
            defineField({
              name: "flagged",
              title: "Highlight",
              type: "boolean",
            }),
          ],
        },
      ],
    }),
    column("left"),
    column("right"),
  ],
});
