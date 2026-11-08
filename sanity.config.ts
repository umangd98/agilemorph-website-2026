"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";

const singletonTypes = new Set([
  "homepage",
  "aboutPage",
  "contactPage",
  "blogIndexPage",
  "siteSettings",
  "howWeWorkPage",
  "whatWeBuildPage",
  "caseStudiesIndexPage",
]);

export default defineConfig({
  name: "agilemorph-site",
  title: "Agilemorph",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage")
              .id("homepage")
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId("homepage")
                  .title("Homepage"),
              ),
            S.listItem()
              .title("About Page")
              .id("aboutPage")
              .child(
                S.document()
                  .schemaType("aboutPage")
                  .documentId("aboutPage")
                  .title("About Page"),
              ),
            S.listItem()
              .title("Contact Page")
              .id("contactPage")
              .child(
                S.document()
                  .schemaType("contactPage")
                  .documentId("contactPage")
                  .title("Contact Page"),
              ),
            S.listItem()
              .title("Blog Index Page")
              .id("blogIndexPage")
              .child(
                S.document()
                  .schemaType("blogIndexPage")
                  .documentId("blogIndexPage")
                  .title("Blog Index Page"),
              ),
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings"),
              ),
            S.listItem()
              .title("What We Build Page")
              .id("whatWeBuildPage")
              .child(
                S.document()
                  .schemaType("whatWeBuildPage")
                  .documentId("whatWeBuildPage")
                  .title("What We Build Page"),
              ),
            S.listItem()
              .title("How We Work Page")
              .id("howWeWorkPage")
              .child(
                S.document()
                  .schemaType("howWeWorkPage")
                  .documentId("howWeWorkPage")
                  .title("How We Work Page"),
              ),
            S.listItem()
              .title("Case Studies Index Page")
              .id("caseStudiesIndexPage")
              .child(
                S.document()
                  .schemaType("caseStudiesIndexPage")
                  .documentId("caseStudiesIndexPage")
                  .title("Case Studies Index Page"),
              ),
            S.divider(),
            S.documentTypeListItem("caseStudy").title("Case Studies"),
            S.documentTypeListItem("blogPost").title("Blog Posts"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
