import Link from "next/link";
import { ArticleRow } from "@/components/ArticleRow";
import { ProjectTile } from "@/components/ProjectTile";
import { Queue, type QueueItem } from "@/components/Queue";
import { api, emptyPage, safely, type ArticleCard, type ProjectCard } from "@/lib/api";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/i18n";
import { paths, siteUrl } from "@/lib/urls";
import { notFound } from "next/navigation";

export const revalidate = 3600;

const SERVICES = ["WebDevelopment", "ApiDevelopment", "SystemArchitecture", "ProcessAutomation", "Consulting", "Maintenance"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const [featured, latestProjects, latestArticles] = await Promise.all([
    safely(api.projects(locale, { featured: true, pageSize: 4 }), null),
    safely(api.projects(locale, { pageSize: 4 }), null),
    safely(api.articles(locale, { pageSize: 5 }), null),
  ]);

  const projectPage = (featured?.items.length ? featured : latestProjects) ?? emptyPage<ProjectCard>();
  // Two-column grid: show an even number so no tile sits alone on the last row.
  const shown = projectPage.items.length > 1 ? projectPage.items.length - (projectPage.items.length % 2) : projectPage.items.length;
  const projects = { ...projectPage, items: projectPage.items.slice(0, shown) };
  const articles = latestArticles ?? emptyPage<ArticleCard>();

  return (
    <>
      <PersonJsonLd locale={locale} name={t.home.greeting} />

      <section className="grid gap-12 py-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:py-20">
        <div>
          <p className="text-slate">{t.home.greeting}</p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.3] sm:text-[2.6rem]">{t.home.headline}</h1>
          <p className="mt-5 max-w-[60ch] text-lg text-slate">{t.home.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={paths.contact(locale)}
              className="rounded-md bg-accent px-5 py-2.5 font-medium text-accent-ink transition-opacity hover:opacity-90"
            >
              {t.home.ctaContact}
            </Link>
            <Link
              href={paths.projects(locale)}
              className="rounded-md border border-line px-5 py-2.5 font-medium transition-colors hover:border-accent hover:text-accent"
            >
              {t.home.ctaProjects}
            </Link>
          </div>
          <p className="mt-10 max-w-[52ch] text-sm text-slate">{t.home.nameMeaning}</p>
        </div>

        <Queue items={buildQueue(latestProjects?.items ?? [], articles.items)} locale={locale} t={t} />
      </section>

      <section aria-labelledby="services" className="border-t border-line py-14">
        <h2 id="services" className="text-2xl font-semibold">
          {t.home.servicesTitle}
        </h2>
        <dl className="mt-8 grid gap-x-12 gap-y-7 sm:grid-cols-2">
          {SERVICES.map((key) => (
            <div key={key}>
              <dt className="font-semibold">{t.services[key].title}</dt>
              <dd className="mt-1 text-slate">{t.services[key].body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {projects.items.length > 0 && (
        <section aria-labelledby="featured" className="border-t border-line py-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="featured" className="text-2xl font-semibold">
              {t.home.featuredTitle}
            </h2>
            <Link href={paths.projects(locale)} className="text-accent hover:underline">
              {t.home.allProjects}
            </Link>
          </div>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {projects.items.map((project) => (
              <ProjectTile key={project.id} project={project} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}

      {articles.items.length > 0 && (
        <section aria-labelledby="latest" className="border-t border-line py-14">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="latest" className="text-2xl font-semibold">
              {t.home.latestTitle}
            </h2>
            <Link href={paths.blog(locale)} className="text-accent hover:underline">
              {t.home.allArticles}
            </Link>
          </div>
          <div className="mt-2 divide-y divide-line">
            {articles.items.map((article) => (
              <ArticleRow key={article.id} article={article} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function buildQueue(projects: ProjectCard[], articles: ArticleCard[]): QueueItem[] {
  return [
    ...projects.map((p) => ({ kind: "project" as const, title: p.title, slug: p.slug, publishedAt: p.publishedAt })),
    ...articles.map((a) => ({ kind: "article" as const, title: a.title, slug: a.slug, publishedAt: a.publishedAt })),
  ]
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 5);
}

function PersonJsonLd({ locale, name }: { locale: Locale; name: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${siteUrl()}/${locale}`,
    jobTitle: locale === "ar" ? "مطوّر أنظمة ويب" : "Web systems developer",
    address: { "@type": "PostalAddress", addressLocality: "Aqaba", addressCountry: "JO" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
