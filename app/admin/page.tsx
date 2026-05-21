import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getT } from "@/lib/i18n/server";
import { listProducts } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import { AdminShell } from "./_components/AdminShell";
import { DeleteProductButton } from "./_components/DeleteProductButton";

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
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-12 md:py-16">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow mb-3">/ {locale === "ka" ? "მართვა" : "Admin"}</p>
              <h1
                className={`${displayClass} uppercase leading-none tracking-tight text-5xl md:text-7xl`}
              >
                {t.admin.dashboardTitle}
              </h1>
              <p className="mt-3 text-sm text-muted">{t.admin.dashboardSubtitle}</p>
            </div>
            <Link href="/admin/products/new" className="btn-primary">
              + {t.admin.newProduct}
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-10 md:py-14">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              {`${t.admin.productsHeader} \u2014 ${products.length}`}
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="border hairline-strong border-dashed py-24 grid place-items-center text-center">
              <p className="text-muted font-mono text-xs uppercase tracking-[0.22em] max-w-md">
                {t.admin.noProducts}
              </p>
              <Link href="/admin/products/new" className="btn-primary mt-6">
                + {t.admin.newProduct}
              </Link>
            </div>
          ) : (
            <ul className="border-t hairline">
              {products.map((p) => {
                const name = pickLocalized(p.name, locale);
                const category = pickLocalized(p.category, locale);
                return (
                  <li
                    key={p.id}
                    className="grid grid-cols-12 gap-4 items-center border-b hairline py-4"
                  >
                    <div className="col-span-2 md:col-span-1">
                      <div className="relative aspect-[4/5] w-full bg-paper-deep overflow-hidden">
                        {p.images[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="col-span-10 md:col-span-5 min-w-0">
                      <div
                        className={`${displayClass} uppercase text-lg md:text-xl tracking-tight truncate`}
                      >
                        {name}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted truncate">
                        / {p.slug}
                        {category ? ` \u00b7 ${category}` : ""}
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-2 font-mono text-xs">
                      {formatPrice(p.price, p.currency, locale)}
                    </div>
                    <div className="col-span-6 md:col-span-2 flex flex-wrap gap-1.5">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.22em] px-1.5 py-0.5 border hairline-strong ${
                          p.published ? "text-ink" : "text-muted"
                        }`}
                      >
                        {p.published ? t.admin.published : t.admin.draft}
                      </span>
                      {p.featured && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] px-1.5 py-0.5 bg-ink text-paper">
                          {t.admin.featured}
                        </span>
                      )}
                    </div>
                    <div className="col-span-12 md:col-span-2 flex md:justify-end gap-4">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink hover:text-ink/70 underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                      >
                        {t.admin.edit}
                      </Link>
                      <DeleteProductButton
                        id={p.id}
                        label={t.admin.delete}
                        confirmLabel={t.admin.confirmDelete}
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
