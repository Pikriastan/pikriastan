export const LOCALES = ["en", "ka"];
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export type Theme = "light" | "dark";
export const DEFAULT_THEME: Theme = "light";
export const THEME_COOKIE = "theme";
