import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listProducts } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import { AdminShell } from "./_components/admin-shell";
import { DeleteProductButton } from "./_components/delete-product-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  const { locale, t } = await getT();
  const products = listProducts();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <AdminShell locale={locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">{`/ ${locale === "ka" ? "მართვა" : "Admin"}`}</p>
              <h1
                className={`${displayClass} text-5xl lowercase leading-none tracking-tight md:text-7xl`}
              >
                {t.admin.dashboardTitle}
              </h1>
              <p className="mt-3 text-muted text-sm">
                {t.admin.dashboardSubtitle}
              </p>
            </div>
            <Link className="btn btn-primary" href="/admin/products/new">
              + {t.admin.newProduct}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12 md:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
              {`${t.admin.productsHeader} \u2014 ${products.length}`}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="hairline grid place-items-center border border-dashed py-28 text-center">
              <p className="max-w-md font-mono text-muted text-xs uppercase tracking-[0.24em]">
                {t.admin.noProducts}
              </p>
              <Link className="btn btn-primary mt-7" href="/admin/products/new">
                + {t.admin.newProduct}
              </Link>
            </div>
          ) : (
            <ul className="hairline border-t">
              {products.map((p) => {
                const name = pickLocalized(p.name, locale);
                const category = pickLocalized(p.category, locale);
                return (
                  <li
                    className="hairline grid grid-cols-12 items-center gap-4 border-b py-5"
                    key={p.id}
                  >
                    <div className="col-span-2 md:col-span-1">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
                        {p.images[0] ? (
                          <Image
                            alt={name}
                            className="object-cover"
                            fill
                            sizes="80px"
                            src={p.images[0]}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="col-span-10 min-w-0 md:col-span-5">
                      <div
                        className={`${displayClass} truncate text-lg lowercase tracking-tight md:text-xl`}
                      >
                        {name}
                      </div>
                      <div className="mt-1 truncate font-mono text-[10px] text-muted uppercase tracking-[0.22em]">
                        {`/ ${p.slug}${category ? ` \u00b7 ${category}` : ""}`}
                      </div>
                    </div>
                    <div className="col-span-6 font-mono text-[12px] md:col-span-2">
                      {formatPrice(p.price, p.currency, locale)}
                    </div>
                    <div className="col-span-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.22em] md:col-span-2">
                      <span className={p.published ? "text-ink" : "text-muted"}>
                        {p.published ? t.admin.published : t.admin.draft}
                      </span>
                      {p.featured && (
                        <span className="text-accent-strong">
                          {`\u00b7 ${t.admin.featured}`}
                        </span>
                      )}
                    </div>
                    <div className="col-span-12 flex gap-5 md:col-span-2 md:justify-end">
                      <Link
                        className="link-static font-mono text-[11px] text-ink uppercase tracking-[0.22em] decoration-line-strong hover:text-accent-strong"
                        href={`/admin/products/${p.id}/edit`}
                      >
                        {t.admin.edit}
                      </Link>
                      <DeleteProductButton
                        confirmLabel={t.admin.confirmDelete}
                        id={p.id}
                        label={t.admin.delete}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
