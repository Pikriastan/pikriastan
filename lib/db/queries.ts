import "dotenv/config";
import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "@/lib/config";
import { WebError } from "@/lib/errors";
import { deleteImage, uploadImage } from "@/lib/r2";
import type { ProductData } from "@/lib/schemas";
import {
  type Product,
  type ProductImage,
  product,
  productImage,
} from "./schema";

export const db = drizzle(config.DATABASE_URL);

export type ProductImageWithUrl = ProductImage & { url: string };
export type ProductWithImages = Product & { images: ProductImageWithUrl[] };

export async function getProducts(): Promise<ProductWithImages[]> {
  try {
    const rows = await db
      .select()
      .from(product)
      .leftJoin(productImage, eq(productImage.productId, product.id))
      .orderBy(asc(product.createdAt), asc(productImage.sortOrder));

    const byId = new Map<string, ProductWithImages>();

    for (const row of rows) {
      const existing = byId.get(row.products.id);
      const grouped = existing ?? { ...row.products, images: [] };

      if (row.product_images) {
        grouped.images.push({
          ...row.product_images,
          url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL}/${row.product_images.key}`,
        });
      }

      if (!existing) {
        byId.set(grouped.id, grouped);
      }
    }

    return Array.from(byId.values());
  } catch {
    throw new WebError("bad_request:database", "Failed to get products");
  }
}

export async function createProduct(data: ProductData): Promise<Product> {
  const { images, ...productData } = data;

  try {
    return await db.transaction(async (tx) => {
      const [row] = await tx.insert(product).values(productData).returning();

      const uploads = await Promise.all(
        images.map((img) => uploadImage(row.id, img))
      );

      await tx.insert(productImage).values(
        uploads.map((u, i) => ({
          productId: row.id,
          key: u.key,
          sortOrder: i,
        }))
      );

      return row;
    });
  } catch (err) {
    if (err instanceof WebError) {
      throw err;
    }
    throw new WebError("bad_request:database", "Failed to create a product");
  }
}

export async function deleteProduct(productId: string) {
  try {
    const images = await db
      .select({ key: productImage.key })
      .from(productImage)
      .where(eq(productImage.productId, productId));

    const [deleted] = await db
      .delete(product)
      .where(eq(product.id, productId))
      .returning({ id: product.id });

    if (!deleted) {
      throw new WebError("not_found:database", "Product not found");
    }

    await Promise.all(images.map((img) => deleteImage(img.key)));
  } catch (err) {
    if (err instanceof WebError) {
      throw err;
    }
    throw new WebError("bad_request:database", "Failed to delete a product");
  }
}
