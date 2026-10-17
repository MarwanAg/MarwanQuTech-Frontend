import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate, type Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

export type QueueItem = { kind: "project" | "article"; title: string; slug: string; publishedAt: string | null };

/**
 * The site's signature element: "Qu" stands for Queue. Recently shipped work is shown as a job
 * queue — the newest item carries the amber signal, and the last slot is left open for the visitor.
 */
export function Queue({ items, locale, t }: { items: QueueItem[]; locale: Locale; t: Dictionary }) {
  return (
    <section aria-labelledby="queue-title" className="rounded-lg border border-line bg-surface">
      <header className="flex items-baseline justify-between gap-4 border-b border-line px-5 py-3">
        <h2 id="queue-title" className="font-mono text-sm font-medium">
          {t.home.queueTitle}
        </h2>
        <p className="text-sm text-slate">{t.home.queueCaption}</p>
      </header>

      {items.length === 0 ? (
        <p className="px-5 py-6 text-slate">{t.home.queueEmpty}</p>
      ) : (
        <ol className="divide-y divide-line">
          {items.map((item, index) => (
            <li key={`${item.kind}-${item.slug}`}>
              <Link
                href={item.kind === "project" ? paths.project(locale, item.slug) : paths.article(locale, item.slug)}
                className="group grid grid-cols-[2.25rem_1fr] gap-x-3 px-5 py-3.5 transition-colors hover:bg-paper"
              >
                <span className="flex items-center gap-1.5 font-mono text-sm text-slate" dir="ltr">
                  {index === 0 && <span aria-hidden className="signal-dot size-1.5 rounded-full bg-signal" />}
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium group-hover:text-accent">{item.title}</span>
                  <span className="flex gap-x-4 text-sm text-slate">
                    <span>{item.kind === "project" ? t.home.kindProject : t.home.kindArticle}</span>
                    {item.publishedAt && <span>{formatDate(item.publishedAt, locale)}</span>}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      <Link
        href={paths.contact(locale)}
        className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-dashed border-line px-5 py-3.5 transition-colors hover:bg-paper"
      >
        <span className="font-mono text-sm text-slate" dir="ltr">
          {String(items.length + 1).padStart(2, "0")}
        </span>
        <span>
          <span className="block text-slate">{t.home.queueNext}</span>
          <span className="text-sm font-medium text-accent">{t.home.queueNextAction}</span>
        </span>
      </Link>
    </section>
  );
}
