import { load } from "@std/dotenv";
import { z } from "zod";

const env = { ...await load(), ...Deno.env.toObject() };

const schema = z.object({
  DATABASE_URL: z.url(),

  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET: z.string(),
  R2_PUBLIC_BASE_URL: z.string(),
});

export const config = schema.parse(env);
