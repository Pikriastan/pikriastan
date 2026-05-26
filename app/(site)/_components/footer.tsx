import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { LanguageSwitcher } from "./language-switcher";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  return (
    <footer className="hairline border-t">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 md:py-20">
        <div className="grid grid-cols-12 gap-10 md:gap-12">
          <div className="col-span-12 md:col-span-5">
            <div
              className={`${displayClass} text-3xl lowercase leading-none tracking-tight md:text-4xl`}
            >
              {locale === "ka" ? "ამირანას გამოფენა" : "amiranas gamofena"}
            </div>
            <p className="mt-5 max-w-sm text-[15px] text-ink/75 leading-relaxed">
              {t.brand.tagline}
            </p>
          </div>
          <div className="col-span-6 flex flex-col gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] md:col-span-3">
            <span className="text-muted">
              {locale === "ka" ? "ნავიგაცია" : "Index"}
            </span>
            <Link className="link-underline self-start pb-0.5" href="/">
              {t.nav.home}
            </Link>
            <Link
              className="link-underline self-start pb-0.5"
              href="/collection"
            >
              {t.nav.collection}
            </Link>
            <Link className="link-underline self-start pb-0.5" href="/about">
              {t.nav.about}
            </Link>
          </div>
          <div className="col-span-6 flex flex-col gap-4 md:col-span-4">
            <span className="font-mono text-[11px] text-muted uppercase tracking-[0.22em]">
              {t.footer.languageLabel}
            </span>
            <LanguageSwitcher locale={locale} />
            <span className="mt-3 font-mono text-[11px] text-muted uppercase tracking-[0.22em]">
              {t.footer.madeIn}
            </span>
          </div>
        </div>

        <div className="hairline mt-12 flex flex-col items-start justify-between gap-3 border-t pt-6 font-mono text-[10px] text-muted uppercase tracking-[0.22em] md:mt-16 md:flex-row md:items-center">
          <span>{`\u00a9 ${year} Amiranas Gamofena. ${t.footer.rights}`}</span>
          <span>{`v01 \u2014 ${year}`}</span>
        </div>
      </div>
    </footer>
  );
}
