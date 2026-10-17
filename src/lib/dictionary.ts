import ar from "@/messages/ar";
import en from "@/messages/en";
import type { Locale } from "./i18n";

export type { Dictionary } from "@/messages/ar";

const dictionaries = { ar, en };

export const getDictionary = (locale: Locale) => dictionaries[locale];
