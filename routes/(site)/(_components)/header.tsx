import { LanguageSwitcher } from "@/islands/language-switcher.tsx";
import { ThemeToggle } from "@/islands/theme-toggle.tsx";
import type { Locale } from "@/lib/constants.ts";
import { getT } from "@/lib/i18n/locales.ts";

export function Header({ locale }: { locale: Locale }) {
  const { t } = getT(locale);

  const nav = [
    { href: "/", label: t.nav.home },
    { href: "/collection", label: t.nav.collection },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header className="hairline sticky top-0 z-40 border-b bg-paper/95 backdrop-blur supports-backdrop-filter:bg-paper/75">
      <div className="mx-auto max-w-350 px-5 sm:px-6 md:px-12">
        <div className="flex items-center justify-between py-5 md:py-6">
          <nav className="hidden items-center gap-10 font-mono text-[11px] uppercase tracking-[0.24em] md:flex">
            {nav.map((n) => (
              <a
                className="link-underline pb-1 text-ink/85 hover:text-ink"
                href={n.href}
                key={n.href}
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <ThemeToggle />
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
        <nav className="flex items-center gap-6 pb-4 font-mono text-[10px] uppercase tracking-[0.24em] md:hidden">
          {nav.map((n) => (
            <a
              className="text-ink/85 hover:text-ink"
              href={n.href}
              key={n.href}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
