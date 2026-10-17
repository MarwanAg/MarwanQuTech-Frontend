import type { Locale } from "./i18n";

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const publicApiUrl = () => (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5148").replace(/\/$/, "");

/** Uploads are stored as "/uploads/…" by the API; absolute URLs pass through unchanged. */
export function mediaUrl(path: string | null | undefined) {
  if (!path) return null;
  return /^https?:\/\//.test(path) ? path : `${publicApiUrl()}${path}`;
}

export const paths = {
  home: (l: Locale) => `/${l}`,
  projects: (l: Locale) => `/${l}/projects`,
  project: (l: Locale, slug: string) => `/${l}/projects/${encodeURIComponent(slug)}`,
  blog: (l: Locale) => `/${l}/blog`,
  article: (l: Locale, slug: string) => `/${l}/blog/${encodeURIComponent(slug)}`,
  contact: (l: Locale) => `/${l}/contact`,
};
