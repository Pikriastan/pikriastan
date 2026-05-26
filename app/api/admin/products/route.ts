import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { createProduct, slugIsAvailable } from "@/lib/db";

const slugRegex = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const productSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(80)
    .regex(
      slugRegex,
      "Invalid slug. Use lowercase letters, numbers, and dashes."
    ),
  name: z.object({
    en: z.string().min(1).max(200),
    ka: z.string().min(1).max(200),
  }),
  description: z.object({
    en: z.string().max(4000).default(""),
    ka: z.string().max(4000).default(""),
  }),
  category: z.object({
    en: z.string().max(120).default(""),
    ka: z.string().max(120).default(""),
  }),
  price: z.number().min(0),
  currency: z.string().min(1).max(8).default("GEL"),
  images: z.array(z.string().url()).max(20).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  if (!slugIsAvailable(parsed.data.slug)) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }
  const product = createProduct(parsed.data);
  return NextResponse.json({ product });
}
