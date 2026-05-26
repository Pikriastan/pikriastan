import { setLocaleAction } from "@/app/(site)/actions";
import type { Locale } from "@/lib/i18n/locales";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <form
      action={setLocaleAction}
      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em]"
    >
      <button
        aria-pressed={locale === "en"}
        className={`transition-colors ${
          locale === "en" ? "text-ink" : "text-muted hover:text-ink"
        }`}
        name="locale"
        type="submit"
        value="en"
      >
        EN
      </button>
      <span aria-hidden className="text-muted-soft">
        /
      </span>
      <button
        aria-pressed={locale === "ka"}
        className={`transition-colors ${
          locale === "ka" ? "text-ink" : "text-muted hover:text-ink"
        }`}
        name="locale"
        type="submit"
        value="ka"
      >
        KA
      </button>
    </form>
  );
}
