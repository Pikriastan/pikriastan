import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import {
  deleteProduct,
  getProductById,
  slugIsAvailable,
  updateProduct,
} from "@/lib/db";

const slugRegex = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

const productSchema = z.object({
  slug: z.string().min(1).max(80).regex(slugRegex),
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

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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
      { status: 400 },
    );
  }
  if (!slugIsAvailable(parsed.data.slug, id)) {
    return NextResponse.json(
      { error: "Slug already in use" },
      { status: 409 },
    );
  }
  const product = updateProduct(id, parsed.data);
  return NextResponse.json({ product });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = deleteProduct(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
