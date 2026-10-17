import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

/**
 * Every page lives under /ar or /en. A path without a locale is redirected:
 * to the language remembered from the visitor's last switch, else to their browser
 * language, else Arabic.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url);
}

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get("locale")?.value;
  if (saved && isLocale(saved)) return saved;

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const arIndex = accept.indexOf("ar");
  const enIndex = accept.indexOf("en");
  if (enIndex !== -1 && (arIndex === -1 || enIndex < arIndex)) return "en";

  return defaultLocale;
}

export const config = {
  // Skip Next internals, the revalidation route, and any file with an extension (sitemap.xml, robots.txt, icons).
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};
