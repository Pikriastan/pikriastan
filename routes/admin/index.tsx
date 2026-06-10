import { getCookies } from "@std/http";
import { deleteSession, deleteSessionCookie } from "@/lib/auth.ts";
import { SESSION_COOKIE } from "@/lib/constants.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";
import { getProducts } from "@/lib/db/queries.ts";
import { AdminProducts } from "@/routes/admin/(_components)/products-list.tsx";

export default define.page(async function AdminPage({ state }) {
  const { t } = getT(state.locale);
  const products = await getProducts();

  return (
    <AdminShell locale={state.locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-6 py-14 md:px-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">
                {`/ ${state.locale === "ka" ? "მართვა" : "Admin"}`}
              </p>
              <h1 className="font-display text-5xl lowercase leading-none tracking-tight md:text-7xl">
                {t.admin.dashboardTitle}
              </h1>
              <p className="mt-3 text-muted text-sm">
                {t.admin.dashboardSubtitle}
              </p>
            </div>
            <a className="btn btn-primary" href="/admin/products/new">
              + {t.admin.newProduct}
            </a>
          </div>
        </div>
      </section>

      <AdminProducts locale={state.locale} t={t.admin} data={products} />
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
