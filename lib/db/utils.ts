// deno-lint-ignore no-import-prefix no-unversioned-import
import { v7 } from "jsr:@std/uuid";
import { uuid } from "drizzle-orm/pg-core";
import type { Product, ProductImage } from "./schema.ts";
import type { ProductWithImages } from "./types.ts";

export const primaryKeyId = () =>
  uuid("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => v7.generate());

export function productsWithImageUrls(
  rows: { products: Product; product_images: ProductImage | null }[],
): ProductWithImages[] {
  const byId = new Map<string, ProductWithImages>();

  for (const row of rows) {
    const existing = byId.get(row.products.id);
    const grouped = existing ?? { ...row.products, images: [] };

    if (row.product_images) {
      grouped.images.push({
        ...row.product_images,
        url:
          `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${row.product_images.key}`,
      });
    }

    if (!existing) {
      byId.set(grouped.id, grouped);
    }
  }

  return Array.from(byId.values());
}
