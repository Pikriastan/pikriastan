import { createProduct, updateProduct } from "@/lib/db/queries.ts";
import { productSchema } from "@/lib/schemas.ts";
import { define } from "@/lib/utils.ts";
import { page } from "fresh";

export async function handleProductCreateOrUpdate(
  formData: FormData,
  mode: "create" | "update",
  productId?: string,
) {
  const validatedDataResult = await productSchema.safeParseAsync({
    ...Object.fromEntries(formData),
    images: formData.getAll("images"),
    existingImageIds: formData.getAll("existingImageIds"),
  });

  if (validatedDataResult.error) {
    return page({ error: "Received invalid data, check form fields." }, {
      status: 422,
    });
  }

  if (mode === "create") {
    await createProduct(validatedDataResult.data);
  } else if (productId) {
    await updateProduct(productId, validatedDataResult.data);
  }
}

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();

    await handleProductCreateOrUpdate(formData, "create");

    return new Response("Successfully created a product");
  },
});
