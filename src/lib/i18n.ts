export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const dir = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

export const otherLocale = (locale: Locale): Locale => (locale === "ar" ? "en" : "ar");

/** Formats an ISO date for the given locale (Arabic uses Latin digits for readability in tech content). */
export function formatDate(iso: string | null | undefined, locale: Locale) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO-u-nu-latn" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
