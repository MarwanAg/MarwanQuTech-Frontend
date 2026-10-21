"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { otherLocale, type Locale } from "@/lib/i18n";

/**
 * Swaps the locale segment and keeps the rest of the path. Detail pages handle a slug from the
 * other language by redirecting to the right one, so this works on every page.
 */
export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const rest = pathname.replace(/^\/(ar|en)(?=\/|$)/, "");

  return (
    <Link
      href={`/${target}${rest}`}
      hrefLang={target}
      lang={target}
      onClick={() => {
        document.cookie = `locale=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="rounded-full border border-line px-3.5 py-1 text-sm text-slate transition-colors hover:border-accent hover:text-accent"
    >
      {label}
    </Link>
  );
}
