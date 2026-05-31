"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/theme-icons";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  function toggle() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <button
      aria-label="change-theme"
      className="relative grid h-7 w-7 place-items-center text-ink/85 transition-colors hover:text-ink"
      onClick={toggle}
      type="button"
    >
      <SunIcon className="absolute scale-100 transition-transform dark:scale-0" />
      <MoonIcon className="absolute scale-0 transition-transform dark:scale-100" />
    </button>
  );
}
