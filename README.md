# Goodies

A simple Next.js project with Tailwind CSS and locale-based i18n.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- next-intl (locale routing)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for English. Arabic lives at `/ar`.

## i18n

Locales live in `src/i18n/routing.ts`. Messages live in `messages/{locale}.json`.

| File | Role |
| --- | --- |
| `src/i18n/routing.ts` | Supported locales and URL prefix rules |
| `src/i18n/navigation.ts` | Locale-aware `Link`, `redirect`, `useRouter`, `usePathname` |
| `src/i18n/request.ts` | Loads messages for the current locale |
| `src/proxy.ts` | Detects locale and prefixes Arabic routes |
| `src/global.ts` | Types for locale and message keys |
| `messages/en.json` | English copy |
| `messages/ar.json` | Arabic copy |

Routes sit under `src/app/[locale]/...`. English has no prefix (`/`, `/shop`); Arabic uses `/ar` and `/ar/shop`.

Use `useTranslations` in Server or Client Components, and `getTranslations` in async Server Components or `generateMetadata`. Use `Link` from `@/i18n/navigation` so the locale stays in the URL.

To add a language: add the locale in `routing.ts`, add `messages/{locale}.json`, and add the label in the `LocaleSwitcher` namespace.

## Tailwind

Tailwind v4 is wired through PostCSS — there is no `tailwind.config.js`.

1. `postcss.config.mjs` loads the Tailwind PostCSS plugin
2. `src/styles/globals.css` imports Tailwind with `@import "tailwindcss"`
