import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="mt-28 border-t border-line bg-deep/60">
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-[52ch]">
          <Link href={paths.home(locale)} className="font-display text-lg font-semibold" dir="ltr">
            Marwan<span className="text-accent">Qu</span>Tech
          </Link>
          <p className="mt-3 text-sm text-slate">{t.home.nameMeaning}</p>
        </div>
        <nav aria-label={t.nav.home} className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href={paths.projects(locale)} className="text-slate hover:text-ink">{t.nav.projects}</Link>
          <Link href={paths.blog(locale)} className="text-slate hover:text-ink">{t.nav.blog}</Link>
          <Link href={paths.contact(locale)} className="text-slate hover:text-ink">{t.nav.contact}</Link>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-1 px-5 py-5 text-sm text-slate sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t.home.greeting}. {t.footer.rights}
          </p>
          <p>{t.footer.location}</p>
        </div>
      </div>
    </footer>
  );
}
