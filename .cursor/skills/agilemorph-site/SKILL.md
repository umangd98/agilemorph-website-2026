---
name: agilemorph-site
description: >-
  Work in the AgileMorph Next.js + Sanity + Tailwind v4 site. Use when editing
  pages, components, theme tokens, Sanity schemas, GROQ queries, or Studio
  configuration in this repository.
---

# AgileMorph Site

## Stack

- Next.js App Router (TypeScript strict, `src/` directory)
- Tailwind CSS v4 (CSS-first tokens in `@theme`)
- Sanity CMS with embedded Studio at `/studio`
- Reusable components in `src/components/`

## Design system rules

1. **Single source of truth**: All colors, fonts, spacing, and radii live in `src/app/globals.css` inside the `@theme` block.
2. **Font loading**: Heading and body fonts are loaded in `src/app/layout.tsx` via `next/font` and exposed as CSS variables.
3. **No ad-hoc styling**: Never use raw hex colors or inline font family names in components. Use token-backed Tailwind utilities (`bg-primary`, `text-foreground`, `font-heading`, `rounded-lg`, etc.).
4. **Compose from components**: Pages must be built from `src/components/`, `Container`, `Section`, `Heading`, `Text`, `Button`, `Card`, `Navbar`, `Footer`, `SanityImage`.

## Sanity conventions

- Schemas: `src/sanity/schemaTypes/`
- GROQ queries: `src/sanity/queries.ts`
- Typed fetch: `src/sanity/fetch.ts` (`sanityFetch<T>()`)
- Types: `src/sanity/types.ts`
- Image URLs: `src/sanity/image.ts` (`urlForImage()`)
- Homepage is a singleton document with `_id: "homepage"`
- Studio config: `sanity.config.ts` at project root
- Env vars: `src/sanity/env.ts` (never hardcode secrets)

## Images

- Always render Sanity images through `SanityImage` (wraps `next/image` + image-url builder).
- `next.config.ts` allows `cdn.sanity.io` remote patterns.

## Adding a new page

1. Create schema/types/query if CMS-driven.
2. Build the page in `src/app/` using only shared components.
3. Pull content via `sanityFetch` in Server Components.
4. Use `generateMetadata` for SEO fields from Sanity.

## Commands

```bash
npm run dev      # Next.js dev server (http://localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm run format   # Prettier
```

Studio: [http://localhost:3000/studio](http://localhost:3000/studio)
