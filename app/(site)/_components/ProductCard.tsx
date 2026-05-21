import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/db";
import type { Locale } from "@/lib/i18n/locales";
import { formatPrice, pickLocalized } from "@/lib/format";

export function ProductCard({
  product,
  locale,
  index,
  size = "md",
}: {
  product: Product;
  locale: Locale;
  index: number;
  size?: "sm" | "md" | "lg";
}) {
  const name = pickLocalized(product.name, locale);
  const category = pickLocalized(product.category, locale);
  const number = String(index + 1).padStart(3, "0");
  const aspect = size === "lg" ? "aspect-[3/4]" : "aspect-[4/5]";
  const cover = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card group block fade-up"
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
    >
      <div className={`relative w-full ${aspect} overflow-hidden bg-paper-deep`}>
        {cover ? (
          <Image
            src={cover}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="product-card-img object-cover"
            priority={index < 2}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            {"\u2014 no image \u2014"}
          </div>
        )}
        <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/80 bg-paper/80 backdrop-blur px-1.5 py-0.5">
          N{number}
        </div>
        {product.featured && (
          <div className="absolute top-3 right-3 size-1.5 rounded-full bg-ink" />
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`truncate text-[15px] md:text-base ${
              locale === "ka" ? "font-display-ka" : "font-display"
            } uppercase tracking-tight`}
          >
            {name}
          </h3>
          {category && (
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              {category}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right font-mono text-[12px] tracking-tight">
          {formatPrice(product.price, product.currency, locale)}
        </div>
      </div>
    </Link>
  );
}
