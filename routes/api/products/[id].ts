import { deleteProduct } from "@/lib/db/queries.ts";
import { define } from "@/lib/utils.ts";

export const handler = define.handlers({
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
