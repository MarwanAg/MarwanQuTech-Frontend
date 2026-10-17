import "server-only";
import type { Locale } from "./i18n";

// ── Types: mirror the ASP.NET Core DTOs (camelCase JSON, enums as names) ──

export type Paged<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ProjectCard = {
  id: number;
  title: string;
  summary: string;
  slug: string;
  coverImageUrl: string | null;
  isReal: boolean;
  isFeatured: boolean;
  githubUrl: string | null;
  liveUrl: string | null;
  publishedAt: string | null;
};

export type ProjectDetails = Omit<ProjectCard, "isFeatured"> & {
  description: string;
  alternateSlug: string | null;
  updatedAt: string | null;
  images: { url: string; alt: string }[];
};

export type ArticleCard = {
  id: number;
  title: string;
  summary: string;
  slug: string;
  coverImageUrl: string | null;
  publishedAt: string | null;
  readingTimeMinutes: number;
};

export type ArticleDetails = ArticleCard & {
  content: string;
  alternateSlug: string | null;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string | null;
  viewsCount: number;
};

export type SitemapEntry = {
  type: "Project" | "Article";
  slugAr: string;
  slugEn: string | null;
  lastModified: string;
};

// ── Cache tags: must match RevalidationTags in the API ──

export const tags = {
  projects: "projects",
  project: (slug: string) => `project:${slug}`,
  articles: "articles",
  article: (slug: string) => `article:${slug}`,
  sitemap: "sitemap",
};

/** Fallback refresh if a revalidation webhook is ever missed. */
const REVALIDATE_SECONDS = 3600;

const apiBase = () =>
  (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5148").replace(/\/$/, "");

async function get<T>(path: string, cacheTags: string[]): Promise<T | null> {
  const response = await fetch(`${apiBase()}${path}`, {
    headers: { Accept: "application/json" },
    next: { tags: cacheTags, revalidate: REVALIDATE_SECONDS },
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`API ${response.status} for ${path}`);

  return (await response.json()) as T;
}

const query = (params: Record<string, string | number | boolean | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
};

// ── Endpoints ──

export const api = {
  projects: (lang: Locale, options: { page?: number; pageSize?: number; featured?: boolean } = {}) =>
    get<Paged<ProjectCard>>(`/api/projects?${query({ lang, ...options })}`, [tags.projects]),

  project: (lang: Locale, slug: string) =>
    get<ProjectDetails>(`/api/projects/${encodeURIComponent(slug)}?lang=${lang}`, [tags.projects, tags.project(slug)]),

  articles: (lang: Locale, options: { page?: number; pageSize?: number; search?: string } = {}) =>
    get<Paged<ArticleCard>>(`/api/articles?${query({ lang, ...options })}`, [tags.articles]),

  article: (lang: Locale, slug: string) =>
    get<ArticleDetails>(`/api/articles/${encodeURIComponent(slug)}?lang=${lang}`, [tags.articles, tags.article(slug)]),

  sitemap: () => get<{ entries: SitemapEntry[] }>("/api/sitemap", [tags.sitemap]),
};

/**
 * For pages that should still render when the API is briefly down (home, lists):
 * logs the error and returns the fallback instead of failing the whole page.
 */
export async function safely<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("[api]", error);
    return fallback;
  }
}

export const emptyPage = <T,>(): Paged<T> => ({
  items: [],
  page: 1,
  pageSize: 0,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
});
