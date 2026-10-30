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
  solutions: (l: Locale) => `/${l}/solutions`,
  projects: (l: Locale) => `/${l}/projects`,
  project: (l: Locale, slug: string) => `/${l}/projects/${encodeURIComponent(slug)}`,
  blog: (l: Locale) => `/${l}/blog`,
  article: (l: Locale, slug: string) => `/${l}/blog/${encodeURIComponent(slug)}`,
  about: (l: Locale) => `/${l}/about`,
  contact: (l: Locale) => `/${l}/contact`,
  /** Contact page with the form pre-filled: ?service=…&problem=…&offer=… */
  contactWith: (l: Locale, preset: { service?: string; problem?: string; offer?: string }) => {
    const query = new URLSearchParams(Object.entries(preset).filter((e): e is [string, string] => !!e[1])).toString();
    return `/${l}/contact${query ? `?${query}` : ""}`;
  },
};
