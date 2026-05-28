import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/collection", label: t.nav.collection },
    { href: "/about", label: t.nav.about },
  ];
  return (
    <header className="hairline sticky top-0 z-40 border-b bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex items-center justify-between py-5 md:py-6">
          <Logo locale={locale} size="md" />
          <nav className="hidden items-center gap-10 font-mono text-[11px] uppercase tracking-[0.24em] md:flex">
            {nav.map((n) => (
              <Link
                className="link-underline pb-1 text-ink/85 hover:text-ink"
                href={n.href}
                key={n.href}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
        <nav className="flex items-center gap-6 pb-4 font-mono text-[10px] uppercase tracking-[0.24em] md:hidden">
          {nav.map((n) => (
            <Link
              className="text-ink/85 hover:text-ink"
              href={n.href}
              key={n.href}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
