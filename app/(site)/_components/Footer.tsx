import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-12 gap-10 md:gap-12">
          <div className="col-span-12 md:col-span-5">
            <div
              className={`${displayClass} leading-none tracking-tight text-3xl md:text-4xl lowercase`}
            >
              {locale === "ka" ? "ამირანას გამოფენა" : "amiranas gamofena"}
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/75">
              {t.brand.tagline}
            </p>
          </div>
          <div className="col-span-6 md:col-span-3 flex flex-col gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em]">
            <span className="text-muted">
              {locale === "ka" ? "ნავიგაცია" : "Index"}
            </span>
            <Link href="/" className="link-underline pb-0.5 self-start">
              {t.nav.home}
            </Link>
            <Link
              href="/collection"
              className="link-underline pb-0.5 self-start"
            >
              {t.nav.collection}
            </Link>
            <Link href="/about" className="link-underline pb-0.5 self-start">
              {t.nav.about}
            </Link>
          </div>
          <div className="col-span-6 md:col-span-4 flex flex-col gap-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {t.footer.languageLabel}
            </span>
            <LanguageSwitcher locale={locale} />
            <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {t.footer.madeIn}
            </span>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t hairline pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          <span>{`\u00a9 ${year} Amiranas Gamofena. ${t.footer.rights}`}</span>
          <span>{`v01 \u2014 ${year}`}</span>
        </div>
      </div>
    </footer>
  );
}
