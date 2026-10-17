import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";

export function Pagination({
  page,
  totalPages,
  href,
  t,
}: {
  page: number;
  totalPages: number;
  href: (page: number) => string;
  t: Dictionary;
}) {
  if (totalPages <= 1) return null;

  const linkClass = "rounded border border-line px-3 py-1.5 transition-colors hover:border-accent hover:text-accent";

  return (
    <nav aria-label={t.pagination.page(page, totalPages)} className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={linkClass}>
          {t.pagination.previous}
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-slate">{t.pagination.page(page, totalPages)}</span>
      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={linkClass}>
          {t.pagination.next}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
