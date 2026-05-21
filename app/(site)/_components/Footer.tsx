import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t hairline bg-paper-deep">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div
              className={`text-3xl md:text-4xl leading-none whitespace-pre-line ${
                locale === "ka" ? "font-display-ka" : "font-display"
              } uppercase`}
            >
              {locale === "ka" ? "ამირანას\nგამოფენა" : "Amiranas\nGamofena"}
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">{t.brand.tagline}</p>
          </div>
          <div className="md:col-span-3 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.22em]">
            <Link href="/" className="link-underline pb-0.5 self-start">
              {t.nav.home}
            </Link>
            <Link href="/collection" className="link-underline pb-0.5 self-start">
              {t.nav.collection}
            </Link>
            <Link href="/about" className="link-underline pb-0.5 self-start">
              {t.nav.about}
            </Link>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {t.footer.languageLabel}
            </span>
            <LanguageSwitcher locale={locale} />
            <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              {t.footer.madeIn}
            </span>
          </div>
        </div>
        <div className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t hairline pt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          <span>
            {`\u00a9 ${year} Amiranas Gamofena. ${t.footer.rights}`}
          </span>
          <span>{`v01 \u2014 ${year}`}</span>
        </div>
      </div>
    </footer>
  );
}
