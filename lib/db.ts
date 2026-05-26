import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { maybeSeed } from "./seed";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "app.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_ka TEXT NOT NULL,
      description_en TEXT NOT NULL DEFAULT '',
      description_ka TEXT NOT NULL DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'GEL',
      category_en TEXT NOT NULL DEFAULT '',
      category_ka TEXT NOT NULL DEFAULT '',
      images_json TEXT NOT NULL DEFAULT '[]',
      featured INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_products_published ON products(published);
    CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
  `);

  _db = db;

  try {
    maybeSeed(db);
  } catch (err) {
    console.error("Seed failed:", err);
  }

  return db;
}

export interface ProductRow {
  id: string;
  slug: string;
  name_en: string;
  name_ka: string;
  description_en: string;
  description_ka: string;
  price: number;
  currency: string;
  category_en: string;
  category_ka: string;
  images_json: string;
  featured: number;
  published: number;
  created_at: number;
  updated_at: number;
}

export interface Product {
  id: string;
  slug: string;
  name: { en: string; ka: string };
  description: { en: string; ka: string };
  category: { en: string; ka: string };
  price: number;
  currency: string;
  images: string[];
  featured: boolean;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export function rowToProduct(row: ProductRow): Product {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(row.images_json);
    if (Array.isArray(parsed))
      images = parsed.filter((s) => typeof s === "string");
  } catch {
    images = [];
  }
  return {
    id: row.id,
    slug: row.slug,
    name: { en: row.name_en, ka: row.name_ka },
    description: { en: row.description_en, ka: row.description_ka },
    category: { en: row.category_en, ka: row.category_ka },
    price: row.price,
    currency: row.currency,
    images,
    featured: !!row.featured,
    published: !!row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ListProductsOptions {
  featuredOnly?: boolean;
  publishedOnly?: boolean;
  limit?: number;
}

export function listProducts(options: ListProductsOptions = {}): Product[] {
  const db = getDb();
  const where: string[] = [];
  const params: Record<string, unknown> = {};
  if (options.featuredOnly) where.push("featured = 1");
  if (options.publishedOnly) where.push("published = 1");
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const limitSql = options.limit ? `LIMIT ${Math.floor(options.limit)}` : "";
  const rows = db
    .prepare(
      `SELECT * FROM products ${whereSql} ORDER BY created_at DESC ${limitSql}`,
    )
    .all(params) as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProductBySlug(slug: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : null;
}

export function getProductById(id: string): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : null;
}

export interface ProductInput {
  slug: string;
  name: { en: string; ka: string };
  description: { en: string; ka: string };
  category: { en: string; ka: string };
  price: number;
  currency: string;
  images: string[];
  featured: boolean;
  published: boolean;
}

function genId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function createProduct(input: ProductInput): Product {
  const db = getDb();
  const id = genId();
  const now = Date.now();
  db.prepare(
    `INSERT INTO products
      (id, slug, name_en, name_ka, description_en, description_ka,
       price, currency, category_en, category_ka, images_json,
       featured, published, created_at, updated_at)
     VALUES
      (@id, @slug, @name_en, @name_ka, @description_en, @description_ka,
       @price, @currency, @category_en, @category_ka, @images_json,
       @featured, @published, @created_at, @updated_at)`,
  ).run({
    id,
    slug: input.slug,
    name_en: input.name.en,
    name_ka: input.name.ka,
    description_en: input.description.en,
    description_ka: input.description.ka,
    price: input.price,
    currency: input.currency,
    category_en: input.category.en,
    category_ka: input.category.ka,
    images_json: JSON.stringify(input.images),
    featured: input.featured ? 1 : 0,
    published: input.published ? 1 : 0,
    created_at: now,
    updated_at: now,
  });
  return getProductById(id) as Product;
}

export function updateProduct(id: string, input: ProductInput): Product | null {
  const db = getDb();
  const now = Date.now();
  const res = db
    .prepare(
      `UPDATE products SET
        slug = @slug,
        name_en = @name_en,
        name_ka = @name_ka,
        description_en = @description_en,
        description_ka = @description_ka,
        price = @price,
        currency = @currency,
        category_en = @category_en,
        category_ka = @category_ka,
        images_json = @images_json,
        featured = @featured,
        published = @published,
        updated_at = @updated_at
       WHERE id = @id`,
    )
    .run({
      id,
      slug: input.slug,
      name_en: input.name.en,
      name_ka: input.name.ka,
      description_en: input.description.en,
      description_ka: input.description.ka,
      price: input.price,
      currency: input.currency,
      category_en: input.category.en,
      category_ka: input.category.ka,
      images_json: JSON.stringify(input.images),
      featured: input.featured ? 1 : 0,
      published: input.published ? 1 : 0,
      updated_at: now,
    });
  if (res.changes === 0) return null;
  return getProductById(id);
}

export function deleteProduct(id: string): boolean {
  const db = getDb();
  const res = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return res.changes > 0;
}

export function slugIsAvailable(slug: string, exceptId?: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT id FROM products WHERE slug = ?").get(slug) as
    | { id: string }
    | undefined;
  if (!row) return true;
  return !!exceptId && row.id === exceptId;
}
