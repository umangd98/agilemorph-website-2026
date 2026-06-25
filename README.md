# AgileMorph Site

Production-ready Next.js + Sanity + Tailwind v4 website with a token-driven design system and reusable component architecture.

## Quick start

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Fill in your Sanity project ID and dataset in `.env.local`.

3. Run the dev server:

```bash
npm run dev
```

- **Website**: [http://localhost:3000](http://localhost:3000)
- **Sanity Studio**: [http://localhost:3000/studio](http://localhost:3000/studio)

## Editing theme tokens

All design tokens live in one place:

- **Colors, spacing, radii**: [`src/app/globals.css`](src/app/globals.css), edit the `@theme` block (look for `TODO` comments).
- **Fonts**: [`src/app/layout.tsx`](src/app/layout.tsx), swap the `next/font/google` imports and CSS variable names.

Every component consumes these tokens via Tailwind utilities. Do not use raw hex values or font names in components.

## Project structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── studio/           # Embedded Sanity Studio
│   ├── globals.css       # Design tokens (@theme)
│   ├── layout.tsx        # Root layout + fonts
│   └── page.tsx          # Homepage
├── components/           # Reusable UI components
└── sanity/               # Sanity client, queries, types, schemas
sanity.config.ts          # Studio configuration
```

## Sanity content

The homepage is a singleton document. Open Studio, edit **Homepage**, and publish. Content is fetched via GROQ in `src/sanity/queries.ts`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Placeholder checklist

Before going live, fill in:

- [ ] **Colors** in `src/app/globals.css`: primary, secondary, accent, background, foreground
- [ ] **Fonts** in `src/app/layout.tsx`: heading font and body font
- [ ] **Env vars** in `.env.local`: `NEXT_PUBLIC_SANITY_PROJECT_ID` (lowercase letters, numbers, dashes only), `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`
- [ ] **Images** in Sanity Studio: hero image and section images on the Homepage document
- [ ] **SEO** in Sanity Studio: meta title, description, OG image

## AI agent skill

Project conventions for Cursor agents are documented in [`.cursor/skills/agilemorph-site/SKILL.md`](.cursor/skills/agilemorph-site/SKILL.md).
