import "@std/dotenv/load";
import { defineConfig } from "drizzle-kit";
import { config } from "@/lib/config.ts";

export default defineConfig({
  out: "./lib/db/migrations",
  schema: ["./lib/db/schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
