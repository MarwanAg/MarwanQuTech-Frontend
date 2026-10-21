"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

/** Shared body for not-found and error screens, which receive no route params. */
export function LocaleFallback({ kind, onRetry }: { kind: "notFound" | "error"; onRetry?: () => void }) {
  const first = usePathname().split("/")[1] ?? "";
  const locale = isLocale(first) ? first : defaultLocale;
  const t = getDictionary(locale);
  const copy = kind === "notFound" ? t.notFound : t.error;

  return (
    <section className="py-24">
      <h1 className="text-3xl font-semibold">{copy.title}</h1>
      <p className="mt-3 text-slate">{copy.body}</p>
      <div className="mt-8 flex gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="rounded-full bg-accent px-5 py-2 font-medium text-accent-ink transition-colors hover:bg-ink">
            {t.error.retry}
          </button>
        )}
        <Link href={paths.home(locale)} className="rounded-md border border-line px-4 py-2 font-medium hover:border-accent hover:text-accent">
          {t.notFound.home}
        </Link>
      </div>
    </section>
  );
}
