"use server";

import { type BaseActionState, wrapAction } from "@/lib/action";
import { createProduct, deleteProduct, updateProduct } from "@/lib/db/queries";
import { productSchema } from "@/lib/schemas";

export const createOrUpdateProductAction = async (
  _: BaseActionState,
  formData: FormData,
  mode: "create" | "edit" = "create",
  productId?: string
) =>
  await wrapAction(
    async () => {
      const validatedData = productSchema.parse({
        ...Object.fromEntries(formData),
        images: formData.getAll("images"),
        existingImageIds: formData.getAll("existingImageIds"),
      });

      if (mode === "create") {
        await createProduct(validatedData);
      } else if (mode === "edit" && productId) {
        await updateProduct(productId, validatedData);
      }

      return {
        status: "success",
        message: `Product was ${mode === "create" ? "created" : "updated"}`,
      };
    },
    {
      zodError: "Received invalid data, check form fields.",
      failedError: `Failed to ${mode === "create" ? "create" : "update"} a product`,
    }
  );

export const deleteProductAction = async (
  _: BaseActionState,
  formData: FormData
) =>
  await wrapAction(
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
