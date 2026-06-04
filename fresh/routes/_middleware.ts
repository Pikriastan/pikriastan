import { getCookies } from "@std/http";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";

export default define.middleware(async (ctx) => {
  const cookies = getCookies(ctx.req.headers);

  ctx.state.locale = cookies[LOCALE_COOKIE] ?? DEFAULT_LOCALE;

  return await ctx.next();
});
