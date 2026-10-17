# MarwanQuTech — Frontend

Next.js 16 (App Router, TypeScript, Tailwind CSS 4) · Arabic (RTL, default) + English · talks to the
[MarwanQuTech-Backend](https://github.com/MarwanAg/MarwanQuTech-Backend) ASP.NET Core API.

## Run locally
```bash
npm install
cp .env.example .env.local      # then edit if needed
npm run dev                     # http://localhost:3000
```
Run the API with the **http** profile so Node can reach it without the HTTPS dev certificate:
```bash
dotnet run --project WebAPI --launch-profile http   # in the backend repo → http://localhost:5148
```
For on-demand revalidation, give the API the same secret as `REVALIDATE_SECRET`:
```bash
dotnet user-secrets set "NextJs:RevalidateSecret" "<same value as REVALIDATE_SECRET>" --project WebAPI
```
(`NextJs:BaseUrl` is already `http://localhost:3000` in the API's Development settings.)

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build (`output: "standalone"` for Docker) |
| `npm run typecheck` | TypeScript only |

## How it works
- **Routing** — every page lives under `/ar` or `/en`. `src/proxy.ts` redirects other paths using the
  visitor's last choice (cookie), then browser language, then Arabic.
- **Language switch** keeps the path; a detail page that receives the other language's slug redirects
  to the matching slug (`alternateSlug` from the API).
- **Data & caching** — server components call the API (`src/lib/api.ts`) with cache tags
  `projects`, `project:{slug}`, `articles`, `article:{slug}`, `sitemap` and a 1-hour fallback.
  The API calls `POST /api/revalidate` (header `x-revalidate-secret`) after changes, which expires those
  tags immediately. Lists and the home page render empty states if the API is down.
- **Browser → API directly** for the contact form and article view counter, so the API's per-IP rate
  limits see the visitor's real address. CORS: this site's origin must be in `WebApi:AllowedOrigins`.
- **SEO** — per-page metadata with canonical + hreflang, Open Graph, `sitemap.xml`, `robots.txt`,
  JSON-LD (`Person` on home, `BlogPosting` on articles).
- **Markdown** — `react-markdown` + GFM + highlight.js; raw HTML in content is ignored.
- **Design** — IBM Plex Sans Arabic / IBM Plex Mono (self-hosted), cool paper/ink palette with a single
  amber "signal" used only by the home-page queue. Light/dark follow the OS setting.

## Structure
```
src/
  proxy.ts                    locale redirect
  app/[locale]/               layout, home, projects, blog, contact, not-found, error
  app/api/revalidate/route.ts webhook from the API
  app/sitemap.ts, robots.ts
  components/                 Queue, ProjectTile, ArticleRow, Markdown, ContactForm, …
  lib/                        API client & types, i18n, URLs
  messages/ar.ts, en.ts       all UI text (en is type-checked against ar)
```
