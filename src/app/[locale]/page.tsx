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

      <section className="grid gap-14 pt-12 pb-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] md:items-center md:pt-20 md:pb-28">
        <div>
          <p className="text-slate">
            <span className="font-medium text-ink">{t.home.greeting}</span>
            <span aria-hidden className="mx-2.5 inline-block size-1 rounded-full bg-accent align-middle" />
            {t.home.role}
          </p>
          <h1 className="mt-5 text-[2.15rem] leading-[1.4] sm:text-[2.7rem] lg:text-[3.15rem]">{t.home.headline}</h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-[1.9] text-slate">{t.home.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={paths.contact(locale)} className={buttonPrimary}>
              {t.home.ctaContact}
            </Link>
            <Link href={paths.projects(locale)} className={buttonSecondary}>
              {t.home.ctaProjects}
            </Link>
          </div>
        </div>

        <Queue items={buildQueue(latestProjects?.items ?? [], articles.items)} locale={locale} t={t} />
      </section>

      <section aria-labelledby="process" className="py-16">
        <SectionHeading id="process" title={t.home.processTitle} intro={t.home.processIntro} />
        <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
          {t.home.process.map((step, index) => (
            <li key={step.title}>
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-accent/70 font-display text-lg text-accent">
                  {index + 1}
                </span>
                {index < t.home.process.length - 1 && <span aria-hidden className="hidden h-px flex-1 bg-brand md:block" />}
              </div>
              <h3 className="mt-6 text-lg">{step.title}</h3>
              <p className="mt-2 text-slate">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="services" className="py-16">
        <SectionHeading id="services" title={t.home.servicesTitle} intro={t.home.servicesIntro} />
        <dl className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((key) => (
            <div key={key} className="border-t border-line pt-6">
              <dt className="font-display text-lg font-semibold">{t.services[key].title}</dt>
              <dd className="mt-2 text-slate">{t.services[key].body}</dd>
            </div>
          ))}
        </dl>
      </section>

      {projects.items.length > 0 && (
        <section aria-labelledby="featured" className="py-16">
          <SectionHeading
            id="featured"
            title={t.home.featuredTitle}
            action={{ href: paths.projects(locale), label: t.home.allProjects }}
          />
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {projects.items.map((project) => (
              <ProjectTile key={project.id} project={project} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}

      {articles.items.length > 0 && (
        <section aria-labelledby="latest" className="py-16">
          <SectionHeading
            id="latest"
            title={t.home.latestTitle}
            action={{ href: paths.blog(locale), label: t.home.allArticles }}
          />
          <div className="mt-6 divide-y divide-line border-y border-line">
            {articles.items.map((article) => (
              <ArticleRow key={article.id} article={article} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}

      <section
        aria-labelledby="cta"
        className="mt-10 grid gap-8 rounded-3xl border border-line bg-[linear-gradient(135deg,var(--brand),var(--paper)_62%,var(--deep))] px-7 py-12 sm:px-12 md:grid-cols-[1fr_auto] md:items-center"
      >
        <div>
          <h2 id="cta" className="max-w-[24ch] text-[1.7rem] leading-[1.45] sm:text-[2.1rem]">
            {t.home.ctaBandTitle}
          </h2>
          <p className="mt-4 max-w-[56ch] text-slate">{t.home.ctaBandBody}</p>
        </div>
        <Link href={paths.contact(locale)} className={buttonPrimary}>
          {t.home.ctaBandAction}
        </Link>
      </section>
    </>
  );
}

const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 font-medium text-accent-ink transition-colors hover:bg-ink";
const buttonSecondary =
  "inline-flex items-center justify-center rounded-full border border-ink/25 px-7 py-3 font-medium transition-colors hover:border-accent hover:text-accent";

function SectionHeading({
  id,
  title,
  intro,
  action,
}: {
  id: string;
  title: string;
  intro?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        <h2 id={id} className="text-[1.75rem] leading-snug sm:text-[2.15rem]">
          {title}
        </h2>
        {intro && <p className="mt-3 max-w-[60ch] text-slate">{intro}</p>}
      </div>
      {action && (
        <Link href={action.href} className="font-medium text-accent underline-offset-8 hover:underline">
          {action.label}
        </Link>
      )}
    </div>
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
