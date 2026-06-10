import { type Locale, LOCALE_COOKIE } from "@/lib/constants.ts";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  async function handleLanguageChange(language: Locale) {
    if (language === locale) {
      return;
    }

    await globalThis.cookieStore.set({
      name: LOCALE_COOKIE,
      value: language,
      path: "/",
      sameSite: "lax",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });
    globalThis.location.reload();
  }

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em]">
      <button
        aria-pressed={locale === "en"}
        className={`transition-colors ${
          locale === "en" ? "text-ink" : "text-muted hover:text-ink"
        }`}
        name="locale"
        onClick={() => handleLanguageChange("en")}
        type="button"
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
        onClick={() => handleLanguageChange("ka")}
        type="button"
        value="ka"
      >
        KA
      </button>
    </div>
  );
}
