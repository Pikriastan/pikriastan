import Link from "next/link";
import type { Locale } from "@/lib/i18n/locales";

export function Logo({
  locale,
  size = "md",
  href = "/",
}: {
  locale: Locale;
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const sizeClass = {
    lg: "text-4xl md:text-5xl",
    md: "text-xl md:text-2xl",
    sm: "text-lg md:text-xl",
  }[size];

  return (
    <Link
      className="inline-flex items-baseline gap-2 text-ink leading-none tracking-tight"
      href={href}
    >
      <span
        className={`${sizeClass} ${
          locale === "ka" ? "font-display-ka" : "font-display"
        } lowercase`}
      >
        {locale === "ka" ? "ამირანას" : "amiranas"}
      </span>
      <span className="hidden font-mono text-[10px] text-muted uppercase tracking-[0.3em] sm:inline">
        {locale === "ka" ? "/ გამოფენა" : "/ gamofena"}
      </span>
    </Link>
  );
}
