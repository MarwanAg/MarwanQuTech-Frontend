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

## Admin dashboard (`/admin`)
Arabic-only, never indexed, rendered in the browser. Sign in with the account created from
`AdminSeed:*` in the API.
- **Session** — the access token stays in memory; the API's HttpOnly `mqt_refresh` cookie restores the
  session after a reload. Requests that get an expired-token 401 refresh once and retry; if that fails
  the dashboard returns to the login page.
- **Projects** — bilingual editor side by side (Arabic / English), Markdown with live preview using the
  site's renderer, slugs generated when empty, cover image, gallery (multi-upload, alt text, reorder),
  publish / hide / feature / delete.
- **Articles** — same editor with word counts, optional SEO title/description with 70/160 counters, cover,
  publish / hide / delete, view count.
- **Messages** — inbox with unread filter, service filter and search; opening marks as read; reply by e-mail.
- **Account** — profile, password change (signs out other devices), sign out of every device.
- Errors from the API (`code`) are shown in Arabic next to the relevant field.

## Structure
```
src/
  proxy.ts                    locale redirect
  app/[locale]/               layout, home, projects, blog, contact, not-found, error
  app/admin/                  dashboard (own root layout): login + (panel)/…
  app/api/revalidate/route.ts webhook from the API
  app/sitemap.ts, robots.ts
  components/                 Queue, ProjectTile, ArticleRow, Markdown, ContactForm, …
  lib/                        API client & types, i18n, URLs
  lib/admin/                  dashboard API client (token refresh), types, Arabic error messages
  messages/ar.ts, en.ts       all UI text (en is type-checked against ar)
```
