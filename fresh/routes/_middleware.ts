import { getCookies } from "@std/http";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALE_COOKIE,
  THEME_COOKIE,
} from "@/lib/constants.ts";
import { define } from "@/lib/utils.ts";

export default define.middleware(async (ctx) => {
  const cookies = getCookies(ctx.req.headers);

  ctx.state.locale = cookies[LOCALE_COOKIE] ?? DEFAULT_LOCALE;
  ctx.state.theme = cookies[THEME_COOKIE] === "dark" ? "dark" : DEFAULT_THEME;

  return await ctx.next();
});
