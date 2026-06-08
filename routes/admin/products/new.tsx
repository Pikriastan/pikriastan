import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { page } from "fresh";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";
import {
  ProductForm,
  type ProductFormValues,
} from "@/routes/admin/(_islands)/product-form.tsx";
import { productSchema } from "@/lib/schemas.ts";
import { createProduct } from "@/lib/db/queries.ts";

const initialValues: ProductFormValues = {
  slug: "",
  name: { en: "", ka: "" },
  description: { en: "", ka: "" },
  category: { en: "", ka: "" },
  price: 0,
  currency: "GEL",
  images: [],
  featured: false,
  published: true,
};

export default define.page(({ state, error }) => {
  const { t } = getT(state.locale);

  console.log(error);

  return (
    <AdminShell locale={state.locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <p className="eyebrow mb-3">/ {t.admin.newProduct}</p>
          <h1 className="font-display text-4xl lowercase leading-none tracking-tight md:text-6xl">
            {t.admin.formTitleNew}
          </h1>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <ProductForm
            initial={initialValues}
            labels={{
              fieldSlug: t.admin.fieldSlug,
              fieldSlugHelp: t.admin.fieldSlugHelp,
              fieldNameEn: t.admin.fieldNameEn,
              fieldNameKa: t.admin.fieldNameKa,
              fieldDescriptionEn: t.admin.fieldDescriptionEn,
              fieldDescriptionKa: t.admin.fieldDescriptionKa,
              fieldCategoryEn: t.admin.fieldCategoryEn,
              fieldCategoryKa: t.admin.fieldCategoryKa,
              fieldPrice: t.admin.fieldPrice,
              fieldCurrency: t.admin.fieldCurrency,
              fieldFeatured: t.admin.fieldFeatured,
              fieldPublished: t.admin.fieldPublished,
              fieldImages: t.admin.fieldImages,
              uploadImages: t.admin.uploadImages,
              uploading: t.admin.uploading,
              save: t.admin.save,
              saving: t.admin.saving,
              cancel: t.admin.cancel,
              saveError: t.admin.saveError,
              removeImage: t.admin.removeImage,
            }}
            error={error}
            mode="create"
          />
        </div>
      </section>
    </AdminShell>
  );
});

export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
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

    await createProduct(validatedDataResult.data);

    return ctx.redirect("/admin");
  },
});
