import { getCookies } from "@std/http";
import { deleteSession, deleteSessionCookie } from "@/lib/auth.ts";
import { SESSION_COOKIE } from "@/lib/constants.ts";
import { define } from "@/lib/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const cookies = getCookies(ctx.req.headers);
    const headers = new Headers({ location: "/" });

    await deleteSession(cookies[SESSION_COOKIE]);
    deleteSessionCookie(headers);

    return ctx.redirect("/admin/login");
  },
});
