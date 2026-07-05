import { updateCategory } from "@/lib/db/queries.ts";
import { WebError } from "@/lib/errors.ts";
import { categorySchema } from "@/lib/schemas.ts";
import { define } from "@/lib/utils.ts";

export const handler = define.handlers({
  async PUT(ctx) {
    const formData = await ctx.req.formData();
    const validated = await categorySchema.safeParseAsync(
      Object.fromEntries(formData),
    );

    if (validated.error) {
      return Response.json(
        { error: "Received invalid data, check form fields." },
        { status: 422 },
      );
    }

    try {
      const category = await updateCategory(ctx.params.id, validated.data);
      return Response.json(category);
    } catch (err) {
      if (err instanceof WebError) return err.toResponse();
      throw err;
    }
  },
});
