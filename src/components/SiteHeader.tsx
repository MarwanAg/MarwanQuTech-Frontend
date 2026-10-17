import Link from "next/link";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { paths } from "@/lib/urls";
import { LanguageSwitch } from "./LanguageSwitch";
import { NavLink } from "./NavLink";

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <header className="border-b border-line">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-ink"
      >
        {t.nav.skipToContent}
      </a>
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4">
        <Link href={paths.home(locale)} className="font-mono text-[1.05rem] font-medium tracking-tight" dir="ltr">
          Marwan<span className="text-accent">Qu</span>Tech
        </Link>
        <nav aria-label={t.nav.home} className="flex items-center gap-1 sm:gap-2">
          <NavLink href={paths.projects(locale)}>{t.nav.projects}</NavLink>
          <NavLink href={paths.blog(locale)}>{t.nav.blog}</NavLink>
          <NavLink href={paths.contact(locale)}>{t.nav.contact}</NavLink>
          <span className="ms-2">
            <LanguageSwitch locale={locale} label={t.nav.switchLanguage} />
          </span>
        </nav>
      </div>
    </header>
  );
}
