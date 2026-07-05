import { CATEGORIES_PAGE_SIZE } from "@/lib/constants.ts";
import { createCategory, getCategoriesPage } from "@/lib/db/queries.ts";
import { WebError } from "@/lib/errors.ts";
import { categorySchema } from "@/lib/schemas.ts";
import { define } from "@/lib/utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const url = new URL(ctx.req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1);
    const pageSize = Math.min(
      50,
      Math.max(
        1,
        Number(
          url.searchParams.get("pageSize") ?? String(CATEGORIES_PAGE_SIZE),
        ) || CATEGORIES_PAGE_SIZE,
      ),
    );

    const { items, total } = await getCategoriesPage({ page, pageSize });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return Response.json({
      items,
      page,
      pageSize,
      total,
      totalPages,
    });
  },
  async POST(ctx) {
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
      const category = await createCategory(validated.data);
      return Response.json(category, { status: 201 });
    } catch (err) {
      if (err instanceof WebError) return err.toResponse();
      throw err;
    }
  },
});
