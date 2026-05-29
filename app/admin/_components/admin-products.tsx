"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { Skeleton } from "@/components/skeleton";
import type { ProductWithImages } from "@/lib/db/queries";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { fetcher, formatPrice, pickLocalized } from "@/lib/utils";
import { DeleteProductButton } from "./delete-product-button";

export function AdminProducts({
  displayClass,
  locale,
  t,
}: {
  displayClass: string;
  locale: Locale;
  t: Dictionary["admin"];
}) {
  const { data, isLoading, error } = useSWR<ProductWithImages[]>(
    "/api/products",
    fetcher
  );

  if (error) {
    return <div>failed to load</div>;
  }
  if (isLoading || !data) {
    return <ProductsSkeleton t={t} />;
  }

  return (
    <section>
      <div className="mx-auto max-w-350 px-6 py-12 md:px-12 md:py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
            {`${t.productsHeader} \u2014 ${data.length}`}
          </h2>
        </div>

        {data.length === 0 ? (
          <div className="hairline grid place-items-center border border-dashed py-28 text-center">
            <p className="max-w-md font-mono text-muted text-xs uppercase tracking-[0.24em]">
              {t.noProducts}
            </p>
            <Link className="btn btn-primary mt-7" href="/admin/products/new">
              + {t.newProduct}
            </Link>
          </div>
        ) : (
          <ul className="hairline border-t">
            {data.map((p) => {
              const name = pickLocalized(
                { en: p.nameEn, ka: p.nameKa },
                locale
              );
              const category = pickLocalized(
                { en: p.categoryEn, ka: p.categoryKa },
                locale
              );
              return (
                <li
                  className="hairline grid grid-cols-12 items-center gap-4 border-b py-5"
                  key={p.id}
                >
                  <div className="col-span-2 md:col-span-1">
                    <div className="relative aspect-4/5 w-full overflow-hidden bg-paper-deep">
                      {p.images[0] ? (
                        <Image
                          alt={name}
                          className="object-cover"
                          fill
                          quality={90}
                          sizes="(min-width: 768px) 120px, 96px"
                          src={p.images[0].url}
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
                      {p.published ? t.published : t.draft}
                    </span>
                    {p.featured && (
                      <span className="text-accent-strong">
                        {`\u00b7 ${t.featured}`}
                      </span>
                    )}
                  </div>
                  <div className="col-span-12 flex gap-5 md:col-span-2 md:justify-end">
                    <Link
                      className="link-static font-mono text-[11px] text-ink uppercase tracking-[0.22em] decoration-line-strong hover:text-accent-strong"
                      href={`/admin/products/${p.id}/edit`}
                    >
                      {t.edit}
                    </Link>
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
        )}
      </div>
    </section>
  );
}

const SKELETON_ROWS = 6;
const SKELETON_KEYS = Array.from(
  { length: SKELETON_ROWS },
  (_, i) => `row-${i}`
);

function ProductsSkeleton({ t }: { t: Dictionary["admin"] }) {
  return (
    <section>
      <div className="mx-auto max-w-350 px-6 py-12 md:px-12 md:py-16">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
            {`${t.productsHeader} \u2014 \u2026`}
          </h2>
        </div>

        <ul className="hairline border-t">
          {SKELETON_KEYS.map((key) => (
            <li
              className="hairline grid grid-cols-12 items-center gap-4 border-b py-5"
              key={key}
            >
              <div className="col-span-2 md:col-span-1">
                <Skeleton className="aspect-4/5 w-full" />
              </div>
              <div className="col-span-10 min-w-0 space-y-2 md:col-span-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="col-span-6 flex flex-wrap gap-2 md:col-span-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="col-span-12 flex gap-5 md:col-span-2 md:justify-end">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
