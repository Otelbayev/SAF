import type { Dictionary } from "./i18n";

type Leaves<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${Leaves<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type TranslationKey = Leaves<Dictionary>;

export function createTranslator(dict: Dictionary) {
  return function t(key: TranslationKey): string {
    const value = key
      .split(".")
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === "object" && part in (acc as Record<string, unknown>)
            ? (acc as Record<string, unknown>)[part]
            : undefined,
        dict,
      );
    if (typeof value === "string") return value;
    return key;
  };
}

export type Translator = ReturnType<typeof createTranslator>;

export function getList(dict: Dictionary, key: TranslationKey): string[] {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object" && part in (acc as Record<string, unknown>)
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      dict,
    );
  return Array.isArray(value) ? (value as string[]) : [];
}
