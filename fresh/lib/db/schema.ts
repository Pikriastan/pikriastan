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
import { primaryKeyId } from "./utils.ts";

export const product = pgTable("products", {
  id: primaryKeyId(),
  slug: varchar().unique().notNull(),
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

export const user = pgTable("users", {
  id: primaryKeyId(),
  email: varchar().unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = InferSelectModel<typeof user>;

export const userSession = pgTable(
  "user_sessions",
  {
    id: primaryKeyId(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").unique().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("user_sessions_user_id_idx").on(t.userId),
    index("user_sessions_expires_at_idx").on(t.expiresAt),
  ]
);

export type UserSession = InferSelectModel<typeof userSession>;
