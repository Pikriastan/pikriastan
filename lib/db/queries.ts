import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config";
import { WebError } from "../errors";
import { type Product, product } from "./schema";

export const db = drizzle(config.DATABASE_URL);

export async function getProducts(): Promise<Product[]> {
  try {
    return await db.select().from(product);
  } catch {
    throw new WebError("bad_request:database", "Failed to get products");
  }
}
