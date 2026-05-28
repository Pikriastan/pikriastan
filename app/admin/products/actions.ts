"use server";

import { z } from "zod";

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

export type NewProductState = "idle" | "success" | "failed" | "invalid_data";

export const createProduct = async (
  _: NewProductState,
  formData: FormData
): Promise<NewProductState> => {
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
