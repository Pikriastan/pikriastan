import { Head } from "fresh/runtime";
import { getAllCategories, getProducts } from "@/lib/db/queries.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { CollectionGrid } from "@/routes/(site)/(_islands)/collection-grid.tsx";

export default define.page(async ({ state }) => {
  const { t } = getT(state.locale);
  const [products, categories] = await Promise.all([
    getProducts({ publishedOnly: true }),
    getAllCategories(),
  ]);

  const countLabel =
    products.length === 1
      ? t.collection.countOne
      : t.collection.countMany(products.length);

  return (
    <>
      <Head>
        <title>Pikriastan - Collection</title>
      </Head>
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-5 pt-20 pb-24 sm:px-6 md:px-12 md:pt-28 md:pb-32">
          <div className="mb-16 md:mb-24">
            <p className="eyebrow mb-6">{countLabel}</p>
            <h1 className="font-display text-[14vw] lowercase leading-[0.92] tracking-tight sm:text-[12vw] md:text-[8.4vw]">
              {t.collection.title}
            </h1>
            <p className="mt-8 max-w-md text-[15px] text-ink/75 leading-relaxed md:text-base">
              {t.collection.subtitle}
            </p>
          </div>

          <CollectionGrid
            categories={categories}
            labels={{
              countManyTemplate: t.collection.countManyTemplate,
              countOne: t.collection.countOne,
              empty: t.collection.empty,
              filterAll: t.collection.filterAll,
              noResults: t.collection.noResults,
              searchLabel: t.collection.searchLabel,
              searchPlaceholder: t.collection.searchPlaceholder,
              sortLabel: t.collection.sortLabel,
              sortNewest: t.collection.sortNewest,
              sortOldest: t.collection.sortOldest,
              sortPriceHigh: t.collection.sortPriceHigh,
              sortPriceLow: t.collection.sortPriceLow,
            }}
            locale={state.locale}
            products={products}
          />
        </div>
      </section>
    </>
  );
});
