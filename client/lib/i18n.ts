import "server-only";
import type { Locale } from "./locales";
import { locales } from "./locales";

const dictionaries = {
  uz: () => import("../messages/uz.json").then((m) => m.default),
  ru: () => import("../messages/ru.json").then((m) => m.default),
  en: () => import("../messages/en.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<typeof dictionaries.uz>>;

export const hasLocale = (locale: string): locale is Locale =>
  (locales as readonly string[]).includes(locale);

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
