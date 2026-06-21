import { MoonIcon, SunIcon } from "@/components/icons.tsx";
import { THEME_COOKIE, type Theme } from "@/lib/constants.ts";

export function ThemeToggle() {
  async function toggleTheme() {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const next: Theme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);

    await globalThis.cookieStore.set({
      name: THEME_COOKIE,
      value: next,
      path: "/",
      sameSite: "lax",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
    });
  }

  return (
    <button
      aria-label="change-theme"
      className="relative grid h-7 w-7 place-items-center text-ink/85 transition-colors hover:text-ink"
      onClick={toggleTheme}
      type="button"
    >
      <SunIcon className="absolute scale-0 transition-transform dark:scale-100" />
      <MoonIcon className="absolute scale-100 transition-transform dark:scale-0" />
    </button>
  );
}
