import { type ClassValue, clsx } from "clsx";
import { createDefine } from "fresh";
import { twMerge } from "tailwind-merge";
import type { AuthUser } from "@/lib/auth.ts";
import type { Locale, Theme } from "@/lib/constants.ts";

export interface State {
  locale: Locale;
  theme: Theme;
  user: AuthUser | null;
}

export const define = createDefine<State>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
