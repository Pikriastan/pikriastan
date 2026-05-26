import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/collection", label: t.nav.collection },
    { href: "/about", label: t.nav.about },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-paper/75 bg-paper/95 border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex items-center justify-between py-5 md:py-6">
          <Logo locale={locale} size="md" />
          <nav className="hidden md:flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.24em]">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="link-underline pb-1 text-ink/85 hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher locale={locale} />
        </div>
        <nav className="md:hidden flex items-center gap-6 pb-4 font-mono text-[10px] uppercase tracking-[0.24em]">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-ink/85 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
