"use server";

import { z } from "zod";
import type { BaseActionState } from "@/lib/types";

const newProductSchema = z.object({
  nameEn: z.string(),
  nameKa: z.string(),
  categoryEn: z.string(),
  categoryKa: z.string(),
  slug: z.string().regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/),
  price: z.coerce.number(),
  currency: z.string(),
  descriptionEn: z.string(),
  descriptionKa: z.string(),
  images: z.array(z.file()),
});

export const createProduct = async (
  _: BaseActionState,
  formData: FormData
): Promise<BaseActionState> => {
  try {
    const validatedData = newProductSchema.parse({
      ...Object.fromEntries(formData),
      images: formData.getAll("images"),
    });

    console.log(validatedData);

    return "success";
  } catch (error) {
    if (error instanceof z.ZodError) {
      return "invalid_data";
    }

    return "failed";
  }
};
