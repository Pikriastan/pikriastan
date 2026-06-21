import { getCookies } from "@std/http";
import { getUserBySessionToken } from "@/lib/auth.ts";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  isLocale,
  LOCALE_COOKIE,
  SESSION_COOKIE,
  THEME_COOKIE,
} from "@/lib/constants.ts";
import { define } from "@/lib/utils.ts";

export default define.middleware(async (ctx) => {
  const pathname = new URL(ctx.req.url).pathname;
  const cookies = getCookies(ctx.req.headers);
  const locale = cookies[LOCALE_COOKIE];

  ctx.state.locale = isLocale(locale) ? locale : DEFAULT_LOCALE;
  ctx.state.theme = cookies[THEME_COOKIE] === "dark" ? "dark" : DEFAULT_THEME;
  ctx.state.user =
    pathname === "/up"
      ? null
      : await getUserBySessionToken(cookies[SESSION_COOKIE]);

  return await ctx.next();
});
