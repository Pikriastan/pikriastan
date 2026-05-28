import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  integer,
  json,
  pgTable,
  text,
  timestamp,
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
  imagesJson: json("images_json").notNull(),
  featured: varchar().notNull(),
  published: boolean().notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = InferSelectModel<typeof product>;
