import type { ComponentChildren } from "preact";
import { LanguageSwitcher } from "@/islands/language-switcher.tsx";
import { ThemeToggle } from "@/islands/theme-toggle.tsx";
import type { Locale } from "@/lib/constants.ts";
import type { Dictionary } from "@/lib/i18n/dictionaries.ts";
import { LogoutButton } from "@/routes/admin/(_components)/logout-button.tsx";

interface AdminShellProps {
  children: ComponentChildren;
  locale: Locale;
  t: Dictionary;
}

export function AdminShell({ t, locale, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="hairline sticky top-0 z-30 border-b bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-350 items-center justify-between gap-3 px-5 py-5 sm:px-6 md:px-12 md:py-6">
          <a
            className="min-w-0 truncate font-display text-xl lowercase leading-none tracking-tight md:text-2xl"
            href="/admin"
          >
            Pikriastan
            <span className="ml-2 align-middle font-mono text-[10px] text-muted uppercase tracking-[0.32em]">
              {" / admin"}
            </span>
          </a>
          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <a
              className="hidden font-mono text-[11px] text-muted uppercase tracking-[0.22em] hover:text-ink sm:inline-flex"
              href="/"
              rel="noopener"
              target="_blank"
            >
              {locale === "ka" ? "საიტი ↗" : "Site ↗"}
            </a>
            <ThemeToggle />
            <LanguageSwitcher locale={locale} />
            <LogoutButton label={t.admin.logout} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
