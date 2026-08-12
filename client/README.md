# saflogistics.uz

Single-page landing site for **SAF EXPRESS LOGISTICS MChJ** — express road freight (truck only) on one corridor, China → Uzbekistan, out of two own warehouses: **Guangzhou and Yiwu, China → Tashkent, Uzbekistan**.

Built with Next.js 16 (App Router, Turbopack build / webpack dev), React 19, Tailwind CSS 4 and framer-motion. Three locales: `uz` (default), `ru`, `en`.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000 → redirects to /uz
npm run build   # production build + type check
npm run lint
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/[locale]/page.tsx` | The landing page — composes every section in order |
| `app/[locale]/layout.tsx` | Locale layout, metadata, theme + quote-modal providers |
| `app/api/lead/route.ts` | Lead endpoint used by all three forms |
| `components/sections/` | Page sections |
| `components/ui/` | Shared primitives (`Container`, `SectionHeading`, `Reveal`, `Button`, `Icon`, …) |
| `lib/site.ts` | **Single source of truth**: route, tariffs, legal and contact details |
| `messages/{uz,ru,en}.json` | All copy. `uz.json` defines the `Dictionary` type — keys must match across all three |
| `proxy.ts` | Next 16 proxy (formerly middleware): prefixes locale-less paths with `/uz` |
| `docs/` | Client-supplied brief and media (git-ignored) |

## Positioning rules

The site is deliberately narrow. Two rules come straight from the client brief and must survive every future edit:

1. **Road freight only.** Air and sea delivery must never appear as a company service anywhere on the site — copy, SEO keywords or JSON-LD.
2. **One corridor only.** China → Uzbekistan. No country lists, no "15+ partner countries".

## Editing tariffs

Transit times live in `lib/site.ts` (`tariffs`) and nowhere else — the tariff cards, comparison table, route section and profit calculator all derive from them. Tariff **names and descriptions** live in `messages/*.json` under `services.{express,standard,econom}`.

Current windows: Express 8–12, Standard 14–18, Econom 20–30 days.
