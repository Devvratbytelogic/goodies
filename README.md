# Goodies

A simple Next.js project with Tailwind CSS.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tailwind setup

Tailwind v4 is wired through PostCSS — there is no `tailwind.config.js`.

1. `postcss.config.mjs` loads the Tailwind PostCSS plugin
2. `src/app/globals.css` imports Tailwind with `@import "tailwindcss"`
3. Utility classes are available in any file under `src/`

Edit `src/app/page.tsx` to start building.
