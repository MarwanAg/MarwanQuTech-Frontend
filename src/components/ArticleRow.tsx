import Link from "next/link";
import type { ArticleCard } from "@/lib/api";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate, type Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

/** Articles read as a list (title first, meta below), not as image cards. */
export function ArticleRow({ article, locale, t }: { article: ArticleCard; locale: Locale; t: Dictionary }) {
  return (
    <article className="py-6">
      <h3 className="text-xl font-semibold leading-snug">
        <Link href={paths.article(locale, article.slug)} className="hover:text-accent">
          {article.title}
        </Link>
      </h3>
      {article.summary && <p className="mt-2 max-w-[70ch] text-slate">{article.summary}</p>}
      <p className="mt-2 flex flex-wrap gap-x-5 text-sm text-slate">
        <time dateTime={article.publishedAt ?? undefined}>{formatDate(article.publishedAt, locale)}</time>
        <span>{t.blog.readingTime(article.readingTimeMinutes)}</span>
      </p>
    </article>
  );
}
