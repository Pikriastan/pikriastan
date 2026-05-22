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
      <header className="border-b hairline bg-paper/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 flex items-center justify-between py-5 md:py-6">
          <Link
            href="/admin"
            className={`${displayClass} lowercase text-xl md:text-2xl tracking-tight leading-none`}
          >
            {locale === "ka" ? "ამირანას" : "amiranas"}
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted align-middle">
              {" / admin"}
            </span>
          </Link>
          <div className="flex items-center gap-6">
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
