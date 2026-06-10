import type { Product, ProductImage } from "./schema.ts";

export type ProductImageWithUrl = ProductImage & { url: string };
export type ProductWithImages = Product & { images: ProductImageWithUrl[] };
