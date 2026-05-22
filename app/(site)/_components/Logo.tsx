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
  const big =
    size === "lg"
      ? "text-4xl md:text-5xl"
      : size === "sm"
        ? "text-lg md:text-xl"
        : "text-xl md:text-2xl";

  return (
    <Link
      href={href}
      className="inline-flex items-baseline gap-2 leading-none tracking-tight text-ink"
    >
      <span
        className={`${big} ${
          locale === "ka" ? "font-display-ka" : "font-display"
        } lowercase`}
      >
        {locale === "ka" ? "ამირანას" : "amiranas"}
      </span>
      <span className="hidden sm:inline font-mono uppercase tracking-[0.3em] text-muted text-[10px]">
        {locale === "ka" ? "/ გამოფენა" : "/ gamofena"}
      </span>
    </Link>
  );
}
