import { computed, useSignal } from "@preact/signals";
import type { Locale } from "@/lib/constants.ts";
import type { Category } from "@/lib/db/schema.ts";
import type { ProductWithImages } from "@/lib/db/types.ts";
import { pickLocalized } from "@/lib/utils.ts";
import { ProductCard } from "@/routes/(site)/(_components)/product-card.tsx";

export type CollectionSort =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc";

export interface CollectionGridLabels {
  countManyTemplate: string;
  countOne: string;
  empty: string;
  filterAll: string;
  noResults: string;
  searchPlaceholder: string;
  sortLabel: string;
  sortNewest: string;
  sortOldest: string;
  sortPriceHigh: string;
  sortPriceLow: string;
}

interface CollectionGridProps {
  categories: Category[];
  labels: CollectionGridLabels;
  locale: Locale;
  products: ProductWithImages[];
}

function getCategoryLabel(
  product: ProductWithImages,
  categories: Category[],
  locale: Locale,
): string {
  if (!product.categoryId) {
    return "";
  }

  const category = categories.find((item) => item.id === product.categoryId);
  if (!category) {
    return "";
  }

  return pickLocalized(
    { en: category.nameEn, ka: category.nameKa },
    locale,
  );
}

function matchesSearch(
  product: ProductWithImages,
  query: string,
  locale: Locale,
  categories: Category[],
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const name = pickLocalized(
    { en: product.nameEn, ka: product.nameKa },
    locale,
  ).toLowerCase();
  const description = pickLocalized(
    { en: product.descriptionEn, ka: product.descriptionKa },
    locale,
  ).toLowerCase();
  const category = getCategoryLabel(product, categories, locale).toLowerCase();

  return (
    name.includes(needle) ||
    description.includes(needle) ||
    category.includes(needle) ||
    product.nameEn.toLowerCase().includes(needle) ||
    product.nameKa.toLowerCase().includes(needle)
  );
}

function getTime(value: Date | string): number {
  return value instanceof Date
    ? value.getTime()
    : new Date(value).getTime();
}

function matchesCategory(
  product: ProductWithImages,
  selectedCategoryId: string | null,
): boolean {
  if (!selectedCategoryId) {
    return true;
  }

  return product.categoryId === selectedCategoryId;
}

function sortProducts(
  items: ProductWithImages[],
  sort: CollectionSort,
): ProductWithImages[] {
  const next = [...items];

  switch (sort) {
    case "oldest":
      return next.sort(
        (a, b) => getTime(a.createdAt) - getTime(b.createdAt),
      );
    case "price-asc":
      return next.sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
    case "price-desc":
      return next.sort((a, b) => b.price - a.price || a.id.localeCompare(b.id));
    default:
      return next.sort(
        (a, b) => getTime(b.createdAt) - getTime(a.createdAt),
      );
  }
}

function formatCount(count: number, labels: CollectionGridLabels): string {
  if (count === 1) {
    return labels.countOne;
  }
  return labels.countManyTemplate.replace("{n}", String(count));
}

export function CollectionGrid({
  categories,
  labels,
  locale,
  products,
}: CollectionGridProps) {
  const search = useSignal("");
  const categoryId = useSignal<string | null>(null);
  const sort = useSignal<CollectionSort>("newest");

  const filtered = computed(() => {
    const items = products.filter(
      (product) =>
        matchesSearch(product, search.value, locale, categories) &&
        matchesCategory(product, categoryId.value),
    );
    return sortProducts(items, sort.value);
  });

  const countLabel = computed(() =>
    formatCount(filtered.value.length, labels),
  );

  if (products.length === 0) {
    return (
      <div className="hairline grid place-items-center border border-dashed py-28 text-center">
        <p className="max-w-md font-mono text-muted text-xs uppercase tracking-[0.24em]">
          {labels.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-14">
      <div className="hairline border-b pb-8 md:pb-10">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 lg:col-span-8">
            <label className="field">
              <span>{labels.searchPlaceholder}</span>
              <input
                onInput={(e) => (search.value = e.currentTarget.value)}
                placeholder={labels.searchPlaceholder}
                type="search"
                value={search.value}
              />
            </label>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <label className="field">
              <span>{labels.sortLabel}</span>
              <select
                onChange={(e) =>
                  (sort.value = e.currentTarget.value as CollectionSort)
                }
                value={sort.value}
              >
                <option value="newest">{labels.sortNewest}</option>
                <option value="oldest">{labels.sortOldest}</option>
                <option value="price-asc">{labels.sortPriceLow}</option>
                <option value="price-desc">{labels.sortPriceHigh}</option>
              </select>
            </label>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              className={`hairline border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                categoryId.value === null
                  ? "border-ink bg-ink text-paper"
                  : "text-muted hover:border-ink hover:text-ink"
              }`}
              onClick={() => (categoryId.value = null)}
              type="button"
            >
              {labels.filterAll}
            </button>
            {categories.map((category) => {
              const active = categoryId.value === category.id;
              return (
                <button
                  className={`hairline border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "text-muted hover:border-ink hover:text-ink"
                  }`}
                  key={category.id}
                  onClick={() => (categoryId.value = category.id)}
                  type="button"
                >
                  {pickLocalized(
                    { en: category.nameEn, ka: category.nameKa },
                    locale,
                  )}
                </button>
              );
            })}
          </div>
        )}

        <p className="eyebrow mt-6">{countLabel.value}</p>
      </div>

      {filtered.value.length === 0 ? (
        <div className="hairline grid place-items-center border border-dashed py-28 text-center">
          <p className="max-w-md font-mono text-muted text-xs uppercase tracking-[0.24em]">
            {labels.noResults}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-24 lg:grid-cols-3">
          {filtered.value.map((product, index) => (
            <ProductCard
              index={index}
              key={product.id}
              locale={locale}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
