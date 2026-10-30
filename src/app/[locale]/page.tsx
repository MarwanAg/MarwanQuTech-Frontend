import Link from "next/link";
import { toJsonLd } from "@/lib/jsonLd";
import { ArticleRow } from "@/components/ArticleRow";
import { ProblemList } from "@/components/business/ProblemList";
import { ServiceGroupList } from "@/components/business/ServiceGroupList";
import { buttonPrimary, buttonSecondary, CtaBand, SectionHeading } from "@/components/SectionHeading";
import { business } from "@/content/business";
import { ProjectTile } from "@/components/ProjectTile";
import { Queue, type QueueItem } from "@/components/Queue";
import { api, emptyPage, safely, type ArticleCard, type ProjectCard } from "@/lib/api";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/i18n";
import { paths, siteUrl } from "@/lib/urls";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const offer = business[locale];

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
        <div data-hero>
          <p className="text-slate">
            <span className="font-medium text-ink">{t.home.greeting}</span>
            <span aria-hidden className="mx-2.5 inline-block size-1 rounded-full bg-accent align-middle" />
            {t.home.role}
          </p>
          <h1 className="mt-5 text-[2.15rem] leading-[1.4] sm:text-[2.7rem] lg:text-[3.15rem]">{t.home.headline}</h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-[1.9] text-slate">{t.home.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={paths.contactWith(locale, { service: "Consulting" })} className={buttonPrimary}>
              {t.home.ctaConsult}
            </Link>
            <Link href={paths.solutions(locale)} className={buttonSecondary}>
              {t.home.ctaSolutions}
            </Link>
          </div>
        </div>

        <Queue items={buildQueue(latestProjects?.items ?? [], articles.items)} locale={locale} t={t} />
      </section>

      <section aria-labelledby="problems" className="py-16">
        <SectionHeading id="problems" title={t.home.problemsTitle} intro={t.home.problemsIntro} />
        <div className="mt-10">
          <ProblemList problems={offer.problems} locale={locale} action={t.home.problemAction} />
        </div>
      </section>

      <section aria-labelledby="services" className="py-16">
        <SectionHeading
          id="services"
          title={t.home.servicesTitle}
          intro={t.home.servicesIntro}
          action={{ href: paths.solutions(locale), label: t.home.allSolutions }}
        />
        <div className="mt-12">
          <ServiceGroupList groups={offer.groups} />
        </div>
      </section>

      <section aria-labelledby="process" className="py-16">
        <SectionHeading id="process" title={t.home.processTitle} intro={t.home.processIntro} />
        <ol data-stagger className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
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

      {projects.items.length > 0 && (
        <section aria-labelledby="featured" className="py-16">
          <SectionHeading
            id="featured"
            title={t.home.featuredTitle}
            action={{ href: paths.projects(locale), label: t.home.allProjects }}
          />
          <div data-stagger className="mt-10 grid gap-10 sm:grid-cols-2">
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
          <div data-stagger className="mt-6 divide-y divide-line border-y border-line">
            {articles.items.map((article) => (
              <ArticleRow key={article.id} article={article} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}

      <CtaBand
        id="cta"
        title={t.home.ctaBandTitle}
        body={t.home.ctaBandBody}
        action={{ href: paths.contact(locale), label: t.home.ctaBandAction }}
      />
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />;
}
