import type { Metadata } from "next";
import Link from "next/link";
import { ArticleRow } from "@/components/ArticleRow";
import { PageIntro } from "@/components/PageIntro";
import { Pagination } from "@/components/Pagination";
import { api, emptyPage, safely, type ArticleCard } from "@/lib/api";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { pageNumber, resolveLocale } from "@/lib/page";
import { paths } from "@/lib/urls";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.blog.title,
    description: t.blog.intro,
    alternates: { canonical: paths.blog(locale), languages: { ar: paths.blog("ar"), en: paths.blog("en") } },
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale, t } = await resolveLocale(params);
  const query = await searchParams;
  const page = pageNumber(query.page);
  const search = (Array.isArray(query.q) ? query.q[0] : query.q)?.trim().slice(0, 100) || undefined;

  const result =
    (await safely(api.articles(locale, { page, pageSize: 10, search }), null)) ?? emptyPage<ArticleCard>();

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `${paths.blog(locale)}${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageIntro title={t.blog.title} intro={t.blog.intro} />

      <form role="search" action={paths.blog(locale)} className="flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">
          {t.blog.searchLabel}
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={search}
          placeholder={t.blog.searchPlaceholder}
          maxLength={100}
          className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-2 placeholder:text-slate/70 focus:border-accent focus:outline-none"
        />
        <button type="submit" className="rounded-md border border-line px-4 py-2 font-medium hover:border-accent hover:text-accent">
          {t.blog.searchAction}
        </button>
      </form>

      {search && (
        <p className="mt-6 text-slate">
          {t.blog.resultsFor} “{search}” —{" "}
          <Link href={paths.blog(locale)} className="text-accent hover:underline">
            {t.blog.clearSearch}
          </Link>
        </p>
      )}

      {result.items.length === 0 ? (
        <p className="mt-10 text-slate">{search ? t.blog.noResults : t.blog.empty}</p>
      ) : (
        <div className="mt-6 divide-y divide-line">
          {result.items.map((article) => (
            <ArticleRow key={article.id} article={article} locale={locale} t={t} />
          ))}
        </div>
      )}

      <Pagination page={result.page} totalPages={result.totalPages} href={pageHref} t={t} />
    </>
  );
}
