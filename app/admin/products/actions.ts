"use server";

import { z } from "zod";
import { createProduct } from "@/lib/db/queries";
import { productSchema } from "@/lib/schemas";
import type { BaseActionState } from "@/lib/types";

export const create = async (
  _: BaseActionState,
  formData: FormData
): Promise<BaseActionState> => {
  try {
    const validatedData = productSchema.parse({
      ...Object.fromEntries(formData),
      images: formData.getAll("images"),
    });

    await createProduct(validatedData);

    return "success";
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[create product] validation failed", error.flatten());
      return "invalid_data";
    }

    console.error("[create product] failed", error);
    return "failed";
  }
};
