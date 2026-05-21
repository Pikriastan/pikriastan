import { getT } from "@/lib/i18n/server";
import { listProducts } from "@/lib/db";
import { ProductCard } from "../_components/ProductCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collection",
};

export default async function CollectionPage() {
  const { locale, t } = await getT();
  const products = listProducts({ publishedOnly: true });

  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  const countLabel =
    products.length === 1 ? t.collection.countOne : t.collection.countMany(products.length);

  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-7xl px-5 md:px-10 pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-14 md:mb-20">
          <div className="col-span-12 md:col-span-8">
            <p className="eyebrow mb-4">{countLabel}</p>
            <h1
              className={`${displayClass} uppercase leading-[0.9] tracking-tight text-[14vw] sm:text-[12vw] md:text-[8vw]`}
            >
              {t.collection.title}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="text-sm md:text-base text-ink/80 max-w-sm md:ml-auto">
              {t.collection.subtitle}
            </p>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
              {t.collection.sortNewest}
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="border hairline-strong border-dashed py-24 grid place-items-center text-center">
            <p className="text-muted font-mono text-xs uppercase tracking-[0.22em] max-w-md">
              {t.collection.empty}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-20">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} locale={locale} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
