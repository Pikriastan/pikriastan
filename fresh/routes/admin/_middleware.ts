import { define } from "@/lib/utils.ts";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/admin/logout"]);

export default define.middleware(async (ctx) => {
  if (ctx.state.user || PUBLIC_ADMIN_PATHS.has(ctx.url.pathname)) {
    return await ctx.next();
  }

  return ctx.redirect("/admin/login");
});
