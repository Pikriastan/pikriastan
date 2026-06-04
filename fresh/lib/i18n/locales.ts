import { type Dictionary, getDictionary } from "./dictionaries.ts";

export const LOCALES = ["en", "ka"];
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export function getT(locale: Locale): { t: Dictionary } {
  return { t: getDictionary(locale) };
}
