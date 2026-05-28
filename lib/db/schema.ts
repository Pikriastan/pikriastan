import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { primaryKeyId } from "./utils";

export const product = pgTable("products", {
  id: primaryKeyId(),
  slug: varchar().notNull(),
  nameEn: varchar("name_en").notNull(),
  nameKa: varchar("name_ka").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionKa: text("description_ka").notNull(),
  price: integer().notNull(),
  currency: varchar().default("GEL").notNull(),
  categoryEn: varchar("category_en").notNull(),
  categoryKa: varchar("category_ka").notNull(),
  featured: boolean().notNull(),
  published: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Product = InferSelectModel<typeof product>;

export const productImage = pgTable(
  "product_images",
  {
    id: primaryKeyId(),
    productId: uuid("product_id").references(() => product.id, {
      onDelete: "cascade",
    }),
    key: varchar().notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("product_images_product_id_sort_order_idx").on(
      t.productId,
      t.sortOrder
    ),
    uniqueIndex("product_images_key_uq").on(t.key),
  ]
);

export type ProductImage = InferSelectModel<typeof productImage>;
