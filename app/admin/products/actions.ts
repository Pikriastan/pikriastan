"use server";

import { type BaseActionState, runAction } from "@/lib/action";
import { createProduct, deleteProduct } from "@/lib/db/queries";
import { productSchema } from "@/lib/schemas";

export const createProductAction = async (
  _: BaseActionState,
  formData: FormData
) =>
  await runAction(
    async () => {
      const validatedData = productSchema.parse({
        ...Object.fromEntries(formData),
        images: formData.getAll("images"),
      });

      await createProduct(validatedData);

      return {
        status: "success",
        message: "Product was created",
      };
    },
    {
      zodError: "Received invalid data, check form fields.",
      failedError: "Failed to create a product",
    }
  );

export const deleteProductAction = async (
  _: BaseActionState,
  formData: FormData
) =>
  await runAction(
    async () => {
      const id = formData.get("id");
      if (typeof id !== "string" || id.length === 0) {
        throw new Error("Missing product id");
      }

      await deleteProduct(id);

      return {
        status: "success",
        message: "Product was deleted",
      };
    },
    {
      zodError: "Received invalid data, check form fields.",
      failedError: "Failed to delete a product",
    }
  );
