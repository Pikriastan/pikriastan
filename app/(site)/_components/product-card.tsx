import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import type { Locale } from "@/lib/i18n/locales";

export function ProductCard({
  product,
  locale,
  index,
}: {
  product: Product;
  locale: Locale;
  index: number;
}) {
  const name = pickLocalized(product.name, locale);
  const cover = product.images[0];
  const second = product.images[1];

  return (
    <Link
      className="product-card group fade-up block"
      href={`/product/${product.slug}`}
      style={{ animationDelay: `${Math.min(index * 70, 420)}ms` }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-deep">
        {cover ? (
          <>
            <Image
              alt={name}
              className="product-card-img object-cover"
              fill
              priority={index < 2}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              src={cover}
            />
            {second && (
              <Image
                alt=""
                className="second-img absolute inset-0 object-cover"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={second}
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-[10px] text-muted uppercase tracking-[0.3em]">
            {"\u2014"}
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3
          className={`min-w-0 truncate text-base md:text-[17px] ${
            locale === "ka" ? "font-display-ka" : "font-display"
          } tracking-tight`}
        >
          {name}
        </h3>
        <div className="shrink-0 font-mono text-[12px] text-ink/85 tracking-tight">
          {formatPrice(product.price, product.currency, locale)}
        </div>
      </div>
    </Link>
  );
}
