import { getCookies } from "@std/http";
import { deleteSession, deleteSessionCookie } from "@/lib/auth.ts";
import { SESSION_COOKIE } from "@/lib/constants.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";

export default define.page(function AdminPage({ state }) {
  const { t } = getT(state.locale);

  return (
    <AdminShell locale={state.locale} t={t}>
      <div>Admin Page</div>
    </AdminShell>
  );
});

export const handler = define.handlers({
  async POST(ctx) {
    const req = ctx.req;
    const form = await req.formData();
    const action = form.get("action");

    if (action === "logout") {
      const cookies = getCookies(req.headers);
      const headers = new Headers({ location: "/" });

      await deleteSession(cookies[SESSION_COOKIE]);
      deleteSessionCookie(headers);

      return ctx.redirect("/admin/login");
    }

    return ctx.next();
  },
});
