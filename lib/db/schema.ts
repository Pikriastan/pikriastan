import {
	boolean,
	json,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const product = pgTable("products", {
	id: uuid()
		.primaryKey()
		.notNull()
		.$defaultFn(() => uuidv7()),
	slug: varchar().notNull(),
	nameEn: varchar("name_en").notNull(),
	nameKa: varchar("name_ka").notNull(),
	descriptionEn: text("description_en").notNull(),
	descriptionKa: text("description_ka").notNull(),
	price: varchar().notNull(),
	currency: varchar().default("GEL"),
	categoryEn: varchar("category_en").notNull(),
	categoryKa: varchar("category_ka").notNull(),
	imagesJson: json("images_json").notNull(),
	featured: varchar().notNull(),
	published: boolean().notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
