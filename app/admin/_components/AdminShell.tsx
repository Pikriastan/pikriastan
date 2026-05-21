import Link from "next/link";
import { LogoutButton } from "./LogoutButton";
import type { Locale } from "@/lib/i18n/locales";
import type { Dictionary } from "@/lib/i18n/dictionaries";

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
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <header className="border-b hairline bg-paper/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-5 md:px-10 flex items-center justify-between py-4 md:py-5">
          <Link
            href="/admin"
            className={`${displayClass} uppercase text-xl md:text-2xl tracking-tight leading-none`}
          >
            {locale === "ka" ? "სტუდია" : "Studio"}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted align-middle">
              {" / admin"}
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="hidden sm:inline-flex font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink"
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
