import { listProducts } from "@/lib/db";
import { getT } from "@/lib/i18n/server";
import { ProductCard } from "../_components/product-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collection",
};

export default async function CollectionPage() {
  const { locale, t } = await getT();
  const products = listProducts({ publishedOnly: true });

  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  const countLabel =
    products.length === 1
      ? t.collection.countOne
      : t.collection.countMany(products.length);

  return (
    <section className="hairline border-b">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-24 md:px-12 md:pt-28 md:pb-32">
        <div className="mb-16 md:mb-24">
          <p className="eyebrow mb-6">{countLabel}</p>
          <h1
            className={`${displayClass} text-[14vw] lowercase leading-[0.92] tracking-tight sm:text-[12vw] md:text-[8.4vw]`}
          >
            {t.collection.title}
          </h1>
          <p className="mt-8 max-w-md text-[15px] text-ink/75 leading-relaxed md:text-base">
            {t.collection.subtitle}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="hairline grid place-items-center border border-dashed py-28 text-center">
            <p className="max-w-md font-mono text-muted text-xs uppercase tracking-[0.24em]">
              {t.collection.empty}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-24 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard index={i} key={p.id} locale={locale} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
