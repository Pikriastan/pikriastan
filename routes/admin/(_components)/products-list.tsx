import type { Locale } from "@/lib/constants.ts";
import { getProducts } from "@/lib/db/queries.ts";
import type { Dictionary } from "@/lib/i18n/dictionaries.ts";
import { formatPrice, pickLocalized } from "@/lib/utils.ts";
import { DeleteProductButton } from "@/routes/admin/(_islands)/delete-product-button.tsx";

export async function AdminProducts({
  locale,
  t,
}: {
  locale: Locale;
  t: Dictionary["admin"];
}) {
  const data = await getProducts();

  if (data.length === 0) {
    return <ProductsEmpty t={t} />;
  }

  return (
    <section>
      <div className="mx-auto max-w-350 px-6 py-12 md:px-12 md:py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
            {`${t.productsHeader} \u2014 ${data.length}`}
          </h2>
        </div>

        <ul className="hairline border-t">
          {data.map((p) => {
            const name = pickLocalized({ en: p.nameEn, ka: p.nameKa }, locale);
            const category = pickLocalized(
              { en: p.categoryEn, ka: p.categoryKa },
              locale,
            );
            return (
              <li
                className="hairline grid grid-cols-12 items-center gap-4 border-b py-5"
                key={p.id}
              >
                <div className="col-span-2 md:col-span-1">
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-paper-deep">
                    {p.images[0]
                      ? (
                        <img
                          alt={name}
                          className="w-24 h-24 md:w-30 md:h-30 object-cover"
                          sizes="(min-width: 768px) 120px, 96px"
                          src={p.images[0].url}
                        />
                      )
                      : null}
                  </div>
                </div>
                <div className="col-span-10 min-w-0 md:col-span-5">
                  <div className="truncate font-display text-lg lowercase tracking-tight md:text-xl">
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
                    {p.published ? t.published : t.draft}
                  </span>
                  {p.featured && (
                    <span className="text-accent-strong">
                      {`\u00b7 ${t.featured}`}
                    </span>
                  )}
                </div>
                <div className="col-span-12 flex gap-5 md:col-span-2 md:justify-end">
                  <a
                    className="link-static font-mono text-[11px] text-ink uppercase tracking-[0.22em] decoration-line-strong hover:text-accent-strong"
                    href={`/admin/products/${p.id}/edit`}
                  >
                    {t.edit}
                  </a>
                  <DeleteProductButton
                    confirmLabel={t.confirmDelete}
                    id={p.id}
                    label={t.delete}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function ProductsEmpty({ t }: { t: Dictionary["admin"] }) {
  return (
    <section>
      <div className="mx-auto max-w-350 px-6 py-12 md:px-12 md:py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
            {`${t.productsHeader} \u2014 0`}
          </h2>
        </div>

        <div className="hairline grid place-items-center border border-dashed py-28 text-center">
          <p className="max-w-md font-mono text-muted text-xs uppercase tracking-[0.24em]">
            {t.empty}
          </p>
          <a className="btn btn-primary mt-7" href="/admin/products/new">
            + {t.newProduct}
          </a>
        </div>
      </div>
    </section>
  );
}
