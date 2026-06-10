import type { Locale } from "@/lib/constants.ts";
import { type Dictionary, getDictionary } from "./dictionaries.ts";

export function getT(locale: Locale): { t: Dictionary } {
  return { t: getDictionary(locale) };
}
