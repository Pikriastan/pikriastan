import { and, asc, eq, inArray, notInArray, sql } from "drizzle-orm";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "@/lib/config.ts";
import { isDriverError, WebError } from "@/lib/errors.ts";
import { deleteImage, uploadImage } from "@/lib/r2.ts";
import type { CategoryData, ProductData } from "@/lib/schemas.ts";
import {
  type Category,
  categories,
  type Product,
  productImages,
  products,
  relations,
} from "./schema.ts";
import type { ProductWithImages } from "./types.ts";
import { productsWithImageUrls } from "./utils.ts";

export const db = drizzle(config.DATABASE_URL, { relations });

export async function getAllCategories(): Promise<Category[]> {
  try {
    return await db.select().from(categories).orderBy(asc(categories.nameEn));
  } catch {
    throw new WebError("bad_request:database", "Failed to get categories");
  }
}

export async function getCategoriesPage({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<{ items: Category[]; total: number }> {
  try {
    const offset = (page - 1) * pageSize;
    const [items, countRow] = await Promise.all([
      db
        .select()
        .from(categories)
        .orderBy(asc(categories.nameEn))
        .limit(pageSize)
        .offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(categories),
    ]);

    return { items, total: countRow[0]?.count ?? 0 };
  } catch {
    throw new WebError("bad_request:database", "Failed to get categories");
  }
}

export async function getCategoryById(
  categoryId: string,
): Promise<Category | null> {
  try {
    const [row] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    return row ?? null;
  } catch {
    throw new WebError("bad_request:database", "Failed to get category");
  }
}

export async function createCategory(data: CategoryData): Promise<Category> {
  try {
    const [row] = await db.insert(categories).values(data).returning();
    return row;
  } catch {
    throw new WebError("bad_request:database", "Failed to create category");
  }
}

export async function updateCategory(
  categoryId: string,
  data: CategoryData,
): Promise<Category> {
  try {
    const [row] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, categoryId))
      .returning();

    if (!row) {
      throw new WebError("not_found:database", "Category not found");
    }

    return row;
  } catch (err) {
    if (err instanceof WebError) {
      throw err;
    }
    throw new WebError("bad_request:database", "Failed to update category");
  }
}

async function resolveProductCategoryId(categoryId: string): Promise<string> {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new WebError("bad_request:database", "Category not found");
  }

  return category.id;
}

async function attachCategories(
  items: ProductWithImages[],
): Promise<ProductWithImages[]> {
  const categoryIds = [
    ...new Set(
      items
        .map((product) => product.categoryId)
        .filter((id): id is string => id != null),
    ),
  ];

  if (categoryIds.length === 0) {
    return items.map((product) => ({ ...product, category: null }));
  }

  const rows = await db
    .select()
    .from(categories)
    .where(inArray(categories.id, categoryIds));
  const categoryById = new Map(rows.map((row) => [row.id, row]));

  return items.map((product) => ({
    ...product,
    category: product.categoryId
      ? categoryById.get(product.categoryId) ?? null
      : null,
  }));
}

export async function getProducts({
  featuredOnly,
  publishedOnly,
  limit,
  offset,
}: {
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  limit?: number;
  offset?: number;
} = {}): Promise<ProductWithImages[]> {
  try {
    let productsQuery = db
      .select()
      .from(products)
      .where(
        and(
          featuredOnly ? eq(products.featured, true) : undefined,
          publishedOnly ? eq(products.published, true) : undefined,
        ),
      )
      .orderBy(asc(products.createdAt))
      .$dynamic();

    if (limit !== undefined) {
      productsQuery = productsQuery.limit(limit);
    }
    if (offset !== undefined) {
      productsQuery = productsQuery.offset(offset);
    }

    const productsList = await productsQuery;

    if (productsList.length === 0) {
      return [];
    }

    const imagesList = await db
      .select()
      .from(productImages)
      .where(
        inArray(
          productImages.productId,
          productsList.map((p) => p.id),
        ),
      )
      .orderBy(asc(productImages.sortOrder), asc(productImages.id));

    const imagesByProductId = new Map<string, typeof imagesList>();
    for (const img of imagesList) {
      if (!img.productId) {
        continue;
      }
      const arr = imagesByProductId.get(img.productId) ?? [];
      arr.push(img);
      imagesByProductId.set(img.productId, arr);
    }

    interface Row {
      product_images: (typeof imagesList)[number] | null;
      products: (typeof productsList)[number];
    }
    const rows: Row[] = productsList.flatMap((p): Row[] => {
      const imgs = imagesByProductId.get(p.id) ?? [];
      if (imgs.length === 0) {
        return [{ products: p, product_images: null }];
      }
      return imgs.map((img) => ({ products: p, product_images: img }));
    });

    return await attachCategories(productsWithImageUrls(rows));
  } catch {
    throw new WebError("bad_request:database", "Failed to get products");
  }
}

export async function getProductById(
  productId: string,
): Promise<ProductWithImages | null> {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .orderBy(asc(productImages.sortOrder), asc(productImages.id));

    if (result.length === 0) {
      return null;
    }

    const [product] = await attachCategories(productsWithImageUrls(result));
    return product ?? null;
  } catch {
    throw new WebError("bad_request:database", "Failed to get a product");
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithImages | null> {
  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .leftJoin(productImages, eq(productImages.productId, products.id))
      .orderBy(asc(productImages.sortOrder), asc(productImages.id));

    if (result.length === 0) {
      return null;
    }

    const [product] = await attachCategories(productsWithImageUrls(result));
    return product ?? null;
  } catch {
    throw new WebError("bad_request:database", "Failed to get a product");
  }
}

export async function createProduct(data: ProductData): Promise<Product> {
  const { images, categoryId, ...productData } = data;
  const resolvedCategoryId = await resolveProductCategoryId(categoryId);

  try {
    return await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(products)
        .values({ ...productData, categoryId: resolvedCategoryId })
        .returning();

      const uploads = await Promise.all(
        images.map((img) => uploadImage(row.id, img)),
      );

      if (uploads.length > 0) {
        await tx.insert(productImages).values(
          uploads.map((u, i) => ({
            productId: row.id,
            key: u.key,
            sortOrder: i,
          })),
        );
      }

      return row;
    });
  } catch (err) {
    if (err instanceof DrizzleQueryError) {
      const driverError = err.cause;
      if (isDriverError(driverError) && driverError.code === "23505") {
        throw new WebError("bad_request:database", "Slug must be unique!");
      }
    }
    if (err instanceof WebError) {
      throw err;
    }
    throw new WebError("bad_request:database", "Failed to create a product");
  }
}

export async function updateProduct(productId: string, data: ProductData) {
  const { images, existingImageIds, categoryId, ...productData } = data;
  const resolvedCategoryId = await resolveProductCategoryId(categoryId);

  let removedKeys: string[] = [];

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({ ...productData, categoryId: resolvedCategoryId })
        .where(eq(products.id, productId));

      const orphans = await tx
        .select({ id: productImages.id, key: productImages.key })
        .from(productImages)
        .where(
          existingImageIds.length === 0
            ? eq(productImages.productId, productId)
            : and(
                eq(productImages.productId, productId),
                notInArray(productImages.id, existingImageIds),
              ),
        );

      if (orphans.length > 0) {
        await tx.delete(productImages).where(
          inArray(
            productImages.id,
            orphans.map((o) => o.id),
          ),
        );
      }

      removedKeys = orphans.map((o) => o.key);

      if (existingImageIds.length > 0) {
        const cases = sql.join(
          existingImageIds.map(
            (id, i) => sql`WHEN ${productImages.id} = ${id} THEN ${i}`,
          ),
          sql` `,
        );
        await tx
          .update(productImages)
          .set({ sortOrder: sql`(CASE ${cases} END)::integer` })
          .where(
            and(
              eq(productImages.productId, productId),
              inArray(productImages.id, existingImageIds),
            ),
          );
      }

      if (images.length > 0) {
        const uploads = await Promise.all(
          images.map((img) => uploadImage(productId, img)),
        );
        await tx.insert(productImages).values(
          uploads.map((u, i) => ({
            productId,
            key: u.key,
            sortOrder: existingImageIds.length + i,
          })),
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
      .select({ key: productImages.key })
      .from(productImages)
      .where(eq(productImages.productId, productId));

    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning({ id: products.id });

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
