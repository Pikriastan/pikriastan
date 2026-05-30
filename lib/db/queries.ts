import "dotenv/config";
import { and, asc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "@/lib/config";
import { WebError } from "@/lib/errors";
import { deleteImage, uploadImage } from "@/lib/r2";
import type { ProductData } from "@/lib/schemas";
import { type Product, product, productImage } from "./schema";
import type { ProductWithImages } from "./types";
import { productsWithImageUrls } from "./utils";

export const db = drizzle(config.DATABASE_URL);

export async function getProducts(): Promise<ProductWithImages[]> {
  try {
    const rows = await db
      .select()
      .from(product)
      .leftJoin(productImage, eq(productImage.productId, product.id))
      .orderBy(
        asc(product.createdAt),
        asc(productImage.sortOrder),
        asc(productImage.id)
      );

    return productsWithImageUrls(rows);
  } catch {
    throw new WebError("bad_request:database", "Failed to get products");
  }
}

export async function getProductById(
  productId: string
): Promise<ProductWithImages> {
  try {
    const result = await db
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .leftJoin(productImage, eq(productImage.productId, product.id))
      .orderBy(asc(productImage.sortOrder), asc(productImage.id));

    if (result.length === 0) {
      throw new WebError("not_found:database", "Product not found");
    }

    return productsWithImageUrls(result)[0];
  } catch {
    throw new WebError("bad_request:database", "Failed to get a product");
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

export async function updateProduct(productId: string, data: ProductData) {
  const { images, existingImageIds, ...productData } = data;

  let removedKeys: string[] = [];

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(product)
        .set({ ...productData })
        .where(eq(product.id, productId));

      const orphans = await tx
        .select({ id: productImage.id, key: productImage.key })
        .from(productImage)
        .where(
          existingImageIds.length === 0
            ? eq(productImage.productId, productId)
            : and(
                eq(productImage.productId, productId),
                notInArray(productImage.id, existingImageIds)
              )
        );

      if (orphans.length > 0) {
        await tx.delete(productImage).where(
          inArray(
            productImage.id,
            orphans.map((o) => o.id)
          )
        );
      }

      removedKeys = orphans.map((o) => o.key);

      if (existingImageIds.length > 0) {
        const cases = sql.join(
          existingImageIds.map(
            (id, i) => sql`WHEN ${productImage.id} = ${id} THEN ${i}`
          ),
          sql` `
        );
        await tx
          .update(productImage)
          .set({ sortOrder: sql`(CASE ${cases} END)::integer` })
          .where(
            and(
              eq(productImage.productId, productId),
              inArray(productImage.id, existingImageIds)
            )
          );
      }

      if (images.length > 0) {
        const uploads = await Promise.all(
          images.map((img) => uploadImage(productId, img))
        );
        await tx.insert(productImage).values(
          uploads.map((u, i) => ({
            productId,
            key: u.key,
            sortOrder: existingImageIds.length + i,
          }))
        );
      }
    });
  } catch {
    throw new WebError("bad_request:database", "Failed to update a product");
  }

  await Promise.all(removedKeys.map((key) => deleteImage(key)));
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
