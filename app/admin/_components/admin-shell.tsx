import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { LogoutButton } from "./logout-button";

export function AdminShell({
  locale,
  t,
  children,
}: {
  locale: Locale;
  t: Dictionary;
  children: React.ReactNode;
}) {
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="hairline sticky top-0 z-30 border-b bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
          <Link
            className={`${displayClass} text-xl lowercase leading-none tracking-tight md:text-2xl`}
            href="/admin"
          >
            {locale === "ka" ? "ამირანას" : "amiranas"}
            <span className="ml-2 align-middle font-mono text-[10px] text-muted uppercase tracking-[0.32em]">
              {" / admin"}
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              className="hidden font-mono text-[11px] text-muted uppercase tracking-[0.22em] hover:text-ink sm:inline-flex"
              href="/"
              target="_blank"
            >
              {locale === "ka" ? "საიტი ↗" : "Site ↗"}
            </Link>
            <LogoutButton label={t.admin.logout} />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
