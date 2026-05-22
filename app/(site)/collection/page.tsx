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
    products.length === 1
      ? t.collection.countOne
      : t.collection.countMany(products.length);

  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="mb-16 md:mb-24">
          <p className="eyebrow mb-6">{countLabel}</p>
          <h1
            className={`${displayClass} leading-[0.92] tracking-tight text-[14vw] sm:text-[12vw] md:text-[8.4vw] lowercase`}
          >
            {t.collection.title}
          </h1>
          <p className="mt-8 max-w-md text-[15px] md:text-base text-ink/75 leading-relaxed">
            {t.collection.subtitle}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="border hairline border-dashed py-28 grid place-items-center text-center">
            <p className="text-muted font-mono text-xs uppercase tracking-[0.24em] max-w-md">
              {t.collection.empty}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-24">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} locale={locale} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
