import { createDefine } from "fresh";
import type { AuthUser } from "@/lib/auth.ts";
import type { Locale, Theme } from "@/lib/constants.ts";

export interface State {
  locale: Locale;
  theme: Theme;
  user: AuthUser | null;
}

export const define = createDefine<State>();
