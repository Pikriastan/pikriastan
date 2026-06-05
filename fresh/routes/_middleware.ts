import { getCookies } from "@std/http";
import { getUserBySessionToken } from "@/lib/auth.ts";
import {
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALE_COOKIE,
  SESSION_COOKIE,
  THEME_COOKIE,
} from "@/lib/constants.ts";
import { define } from "@/lib/utils.ts";

export default define.middleware(async (ctx) => {
  const cookies = getCookies(ctx.req.headers);

  ctx.state.locale = cookies[LOCALE_COOKIE] ?? DEFAULT_LOCALE;
  ctx.state.theme = cookies[THEME_COOKIE] === "dark" ? "dark" : DEFAULT_THEME;
  ctx.state.user = await getUserBySessionToken(cookies[SESSION_COOKIE]);

  return await ctx.next();
});
