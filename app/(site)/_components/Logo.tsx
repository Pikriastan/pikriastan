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
      ? "text-3xl md:text-4xl"
      : size === "sm"
        ? "text-base md:text-lg"
        : "text-xl md:text-2xl";
  const small =
    size === "lg" ? "text-[10px]" : size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <Link
      href={href}
      className="group inline-flex flex-col leading-none tracking-tight text-ink"
    >
      <span
        className={`${big} ${locale === "ka" ? "font-display-ka" : "font-display"} uppercase`}
      >
        {locale === "ka" ? "ამირანას" : "Amiranas"}
      </span>
      <span
        className={`${small} font-mono uppercase tracking-[0.3em] text-muted mt-1`}
      >
        {locale === "ka" ? "გამოფენა \u00b7 სტუდია" : "Gamofena \u00b7 Studio"}
      </span>
    </Link>
  );
}
