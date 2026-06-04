import { createDefine } from "fresh";
import type { Locale, Theme } from "@/lib/constants.ts";

export interface State {
  locale: Locale;
  theme: Theme;
}

export const define = createDefine<State>();
