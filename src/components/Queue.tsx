import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import { formatDate, type Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

export type QueueItem = { kind: "project" | "article"; title: string; slug: string; publishedAt: string | null };

/**
 * The site's signature element: "Qu" stands for Queue. Recently finished work sits on a rail as a
 * job queue — the newest item carries the pulsing sand signal, and the last slot is left open for
 * the visitor's own project.
 */
export function Queue({ items, locale, t }: { items: QueueItem[]; locale: Locale; t: Dictionary }) {
  return (
    <section
      aria-labelledby="queue-title"
      className="rounded-2xl border border-line bg-surface/70 p-6 shadow-[0_30px_80px_-40px_rgba(1,7,54,0.9)] backdrop-blur-sm sm:p-7"
    >
      <header className="flex items-baseline justify-between gap-4">
        <h2 id="queue-title" className="text-lg">
          {t.home.queueTitle}
        </h2>
        <p className="text-sm text-slate">{t.home.queueCaption}</p>
      </header>

      <ol className="relative mt-6">
        {/* The rail: one continuous line behind every stop, ending at the open slot. */}
        <span aria-hidden className="absolute inset-y-3 start-[0.6875rem] w-px bg-brand" />

        {items.length === 0 && <li className="ps-10 pb-6 text-slate">{t.home.queueEmpty}</li>}

        {items.map((item, index) => (
          <li key={`${item.kind}-${item.slug}`} className="relative">
            <Link
              href={item.kind === "project" ? paths.project(locale, item.slug) : paths.article(locale, item.slug)}
              className="group grid grid-cols-[1.375rem_1fr] gap-x-4 rounded-lg py-3"
            >
              <span className="flex justify-center pt-2">
                <span
                  aria-hidden
                  className={
                    index === 0
                      ? "signal-dot relative size-3 rounded-full bg-signal"
                      : "relative size-2.5 rounded-full border-2 border-brand bg-surface"
                  }
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium transition-colors group-hover:text-accent">
                  {item.title}
                </span>
                <span className="flex gap-x-4 text-sm text-slate">
                  <span>{item.kind === "project" ? t.home.kindProject : t.home.kindArticle}</span>
                  {item.publishedAt && <span>{formatDate(item.publishedAt, locale)}</span>}
                </span>
              </span>
            </Link>
          </li>
        ))}

        <li className="relative">
          <Link
            href={paths.contact(locale)}
            className="group mt-2 grid grid-cols-[1.375rem_1fr] gap-x-4 rounded-xl border border-dashed border-accent/50 bg-accent/5 py-3.5 pe-4 transition-colors hover:border-accent hover:bg-accent/10"
          >
            <span className="flex justify-center pt-2">
              <span aria-hidden className="relative size-3 rounded-full border-2 border-accent bg-paper" />
            </span>
            <span>
              <span className="block">{t.home.queueNext}</span>
              <span className="text-sm font-medium text-accent">{t.home.queueNextAction}</span>
            </span>
          </Link>
        </li>
      </ol>
    </section>
  );
}
