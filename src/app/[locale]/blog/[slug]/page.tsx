import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { ViewTracker } from "@/components/ViewTracker";
import { api } from "@/lib/api";
import { formatDate, isLocale, otherLocale, type Locale } from "@/lib/i18n";
import { decodeSlug, resolveLocale } from "@/lib/page";
import { mediaUrl, paths, siteUrl } from "@/lib/urls";

export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ locale: string; slug: string }> };

async function load(locale: Locale, rawSlug: string) {
  const slug = decodeSlug(rawSlug);
  const article = await api.article(locale, slug);
  if (article) return article;

  const other = await api.article(otherLocale(locale), slug);
  if (other?.alternateSlug) redirect(paths.article(locale, other.alternateSlug));

  notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = await api.article(locale, decodeSlug(slug));
  if (!article) return {};

  const cover = mediaUrl(article.coverImageUrl);
  const ar = locale === "ar" ? article.slug : article.alternateSlug;
  const en = locale === "en" ? article.slug : article.alternateSlug;

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: paths.article(locale, article.slug),
      languages: {
        ...(ar ? { ar: paths.article("ar", ar) } : {}),
        ...(en ? { en: paths.article("en", en) } : {}),
      },
    },
    openGraph: {
      type: "article",
      title: article.seoTitle,
      description: article.seoDescription,
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt ?? undefined,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, t } = await resolveLocale(params);
  const article = await load(locale, (await params).slug);
  const cover = mediaUrl(article.coverImageUrl);
  const wasUpdated =
    article.updatedAt && article.publishedAt && article.updatedAt.slice(0, 10) > article.publishedAt.slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.seoDescription,
    inLanguage: locale,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    image: cover ?? undefined,
    author: { "@type": "Person", name: t.home.greeting, url: `${siteUrl()}/${locale}` },
    mainEntityOfPage: `${siteUrl()}${paths.article(locale, article.slug)}`,
  };

  return (
    <article className="pb-8">
      <ViewTracker articleId={article.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="max-w-[70ch] py-12 md:py-16">
        <Link href={paths.blog(locale)} className="text-sm text-slate hover:text-accent">
          {t.blog.back}
        </Link>
        <h1 className="mt-6 text-[2rem] font-semibold leading-tight sm:text-[2.5rem]">{article.title}</h1>
        {article.summary && <p className="mt-4 text-lg text-slate">{article.summary}</p>}
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate">
          <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt, locale)}</time>
          <span>{t.blog.readingTime(article.readingTimeMinutes)}</span>
          <span>{t.blog.views(article.viewsCount)}</span>
          {wasUpdated && (
            <span>
              {t.blog.updated} <time dateTime={article.updatedAt!}>{formatDate(article.updatedAt, locale)}</time>
            </span>
          )}
        </p>
      </header>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" className="mb-12 w-full max-w-[70ch] rounded-md border border-line" />
      )}

      <Markdown source={article.content} />
    </article>
  );
}
