import { deleteProduct } from "@/lib/db/queries.ts";
import { define } from "@/lib/utils.ts";
import { handleProductCreateOrUpdate } from "@/routes/api/products/index.ts";

export const handler = define.handlers({
  async PUT(ctx) {
    const productId = ctx.params.id;
    const formData = await ctx.req.formData();

    await handleProductCreateOrUpdate(formData, "update", productId);

    return new Response(`Successfully updated the product: ${productId}`);
  },
  async DELETE(ctx) {
    if (!ctx.state.user) {
      return Response.json(
        { error: "Not authorized to perform this action" },
        { status: 401 },
      );
    }

    await deleteProduct(ctx.params.id);

    return new Response(null, { status: 204 });
  },
});
