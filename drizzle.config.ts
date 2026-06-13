import { loadSync } from "@std/dotenv";
import { defineConfig } from "drizzle-kit";

loadSync({ export: true });

export default defineConfig({
  out: "./lib/db/migrations",
  schema: ["./lib/db/schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: Deno.env.get("DATABASE_DIRECT_URL") ?? Deno.env.get("DATABASE_URL") ??
      "",
  },
});
