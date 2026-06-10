import { define } from "@/lib/utils.ts";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";
import { getT } from "@/lib/i18n/locales.ts";
import { getProductById } from "@/lib/db/queries.ts";
import { ProductForm, type ProductFormValues } from "@/routes/admin/(_islands)/product-form.tsx";
import { HttpError } from "fresh/runtime";

export default define.page(async ({ params, state }) => {
  const { t } = getT(state.locale);
  const product = await getProductById(params.id);

  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  const initialValues: ProductFormValues = {
    id: product.id,
    slug: product.slug,
    name: { en: product.nameEn, ka: product.nameKa },
    description: { en: product.descriptionEn, ka: product.descriptionKa },
    category: { en: product.categoryEn, ka: product.descriptionKa },
    price: product.price,
    currency: product.currency,
    images: product.images,
    featured: product.featured,
    published: product.published,
  };

  return (
    <AdminShell locale={state.locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <p className="eyebrow mb-3">/ {t.admin.edit}</p>
          <h1 className="font-display text-4xl lowercase leading-none tracking-tight md:text-6xl">
            {t.admin.formTitleEdit}
          </h1>
          <p className="mt-3 font-mono text-[11px] text-muted uppercase tracking-[0.22em]">
            / {product.slug}
          </p>
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
            mode="edit"
          />
        </div>
      </section>
    </AdminShell>
  );
});
