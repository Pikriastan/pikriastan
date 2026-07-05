import type { Category, Product, ProductImage } from "./schema.ts";

export type ProductImageWithUrl = ProductImage & { url: string };
export type ProductWithImages = Product & {
  category: Category | null;
  images: ProductImageWithUrl[];
};
