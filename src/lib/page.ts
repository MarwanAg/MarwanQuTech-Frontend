import { notFound } from "next/navigation";
import { getDictionary } from "./dictionary";
import { isLocale } from "./i18n";

/** Validates the [locale] segment and returns it with its dictionary. */
export async function resolveLocale(params: Promise<{ locale: string }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, t: getDictionary(locale) };
}

export function pageNumber(value: string | string[] | undefined) {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** Route params may arrive percent-encoded (Arabic slugs); decoding twice is harmless for slugs. */
export function decodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
