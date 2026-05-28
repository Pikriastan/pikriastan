import { z } from "zod";

export const productSchema = z.object({
  nameEn: z.string().min(1).max(200),
  nameKa: z.string().min(1).max(200),
  descriptionEn: z.string().max(4000).default(""),
  descriptionKa: z.string().max(4000).default(""),
  categoryEn: z.string().max(120).default(""),
  categoryKa: z.string().max(120).default(""),
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/),
  price: z.coerce.number().min(0),
  currency: z.string().min(1).max(8).default("GEL"),
  images: z.array(z.file()).max(20).default([]),
  featured: z.stringbool().default(false),
  published: z.stringbool().default(true),
});

export type ProductData = z.infer<typeof productSchema>;
