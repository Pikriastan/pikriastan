import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EXTENSION_RE } from "./constants";
import { type ErrorCode, WebError } from "./errors";
import type { Locale } from "./i18n/locales";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new WebError(code as ErrorCode, cause);
  }

  return response.json();
};

const SYMBOLS: Record<string, string> = {
  GEL: "\u20BE",
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
};

export function formatPrice(
  amount: number,
  currency: string,
  locale: Locale
): string {
  const sym = SYMBOLS[currency.toUpperCase()] ?? currency.toUpperCase();
  const fmt = new Intl.NumberFormat(locale === "ka" ? "ka-GE" : "en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (currency.toUpperCase() === "USD") {
    return `${sym}${fmt.format(amount)}`;
  }
  return `${fmt.format(amount)} ${sym}`;
}

export function pickLocalized<T extends { en: string; ka: string }>(
  field: T,
  locale: Locale
): string {
  return field[locale] || field.en || field.ka;
}

export function pickExtension(filename: string, contentType: string): string {
  const fromName = filename.split(".").pop();
  if (fromName && EXTENSION_RE.test(fromName)) {
    return fromName.toLowerCase();
  }
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[contentType.toLowerCase()] ?? "bin";
}
