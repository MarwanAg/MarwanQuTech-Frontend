import type { MetadataRoute } from "next";
import { api, safely } from "@/lib/api";
import { paths, siteUrl } from "@/lib/urls";

/** /sitemap.xml — static pages plus every published project/article in both languages with hreflang. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const data = await safely(api.sitemap(), null);

  // Every language version is its own <url>, each listing both alternates (Google's hreflang rule).
  const staticPages: MetadataRoute.Sitemap = (["home", "projects", "blog", "about", "contact"] as const).flatMap((page) => {
    const languages = { ar: `${base}${paths[page]("ar")}`, en: `${base}${paths[page]("en")}` };
    return [languages.ar, languages.en].map((url) => ({
      url,
      changeFrequency: page === "contact" || page === "about" ? ("yearly" as const) : ("weekly" as const),
      priority: page === "home" ? 1 : 0.7,
      alternates: { languages },
    }));
  });

  const content: MetadataRoute.Sitemap = (data?.entries ?? []).flatMap((entry) => {
    const build = entry.type === "Project" ? paths.project : paths.article;
    const ar = `${base}${build("ar", entry.slugAr)}`;
    const en = entry.slugEn ? `${base}${build("en", entry.slugEn)}` : null;
    const languages = { ar, ...(en ? { en } : {}) };

    return [ar, ...(en ? [en] : [])].map((url) => ({
      url,
      lastModified: entry.lastModified,
      changeFrequency: "monthly" as const,
      priority: entry.type === "Project" ? 0.8 : 0.6,
      alternates: { languages },
    }));
  });

  return [...staticPages, ...content];
}
