export const LOCALES = ["en", "ka"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === "string" && LOCALES.includes(value as Locale);
}

export type Theme = "light" | "dark";
export const DEFAULT_THEME: Theme = "light";
export const THEME_COOKIE = "theme";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export const EXTENSION_RE = /^[a-z0-9]{2,5}$/i;

export const MAX_BYTES = 10 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export const INQUIRY_EMAIL = "pikriastan@gmail.com";

export const CATEGORIES_PAGE_SIZE = 10;
