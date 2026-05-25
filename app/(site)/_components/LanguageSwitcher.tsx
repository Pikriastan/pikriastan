import { setLocaleAction } from "@/app/(site)/actions";
import type { Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
	return (
		<form
			action={setLocaleAction}
			className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em]"
		>
			<button
				type="submit"
				name="locale"
				value="en"
				className={`transition-colors ${
					locale === "en" ? "text-ink" : "text-muted hover:text-ink"
				}`}
				aria-pressed={locale === "en"}
			>
				EN
			</button>
			<span className="text-muted-soft" aria-hidden>
				/
			</span>
			<button
				type="submit"
				name="locale"
				value="ka"
				className={`transition-colors ${
					locale === "ka" ? "text-ink" : "text-muted hover:text-ink"
				}`}
				aria-pressed={locale === "ka"}
			>
				KA
			</button>
		</form>
	);
}
