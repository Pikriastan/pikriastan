import { cookies } from "next/headers";
import { type Dictionary, getDictionary } from "./dictionaries";
import {
	DEFAULT_LOCALE,
	isLocale,
	LOCALE_COOKIE,
	type Locale,
} from "./locales";

export async function getLocale(): Promise<Locale> {
	const store = await cookies();
	const v = store.get(LOCALE_COOKIE)?.value;
	return isLocale(v) ? v : DEFAULT_LOCALE;
}

export async function getT(): Promise<{ locale: Locale; t: Dictionary }> {
	const locale = await getLocale();
	return { locale, t: getDictionary(locale) };
}
