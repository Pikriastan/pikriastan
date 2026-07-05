import { getAllCategories } from "@/lib/db/queries.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";
import {
  ProductForm,
  type ProductFormValues,
} from "@/routes/admin/(_islands)/product-form.tsx";

const initialValues: ProductFormValues = {
  slug: "",
  name: { en: "", ka: "" },
  description: { en: "", ka: "" },
  categoryId: "",
  price: 0,
  currency: "GEL",
  images: [],
  featured: false,
  published: true,
};

export default define.page(async ({ state, error }) => {
  const { t } = getT(state.locale);
  const categories = await getAllCategories();

  return (
    <AdminShell locale={state.locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="eyebrow mb-0">/ {t.admin.newProduct}</p>
            <a
              className="shrink-0 font-mono text-[10px] text-muted uppercase tracking-[0.28em] hover:text-ink"
              href="/admin"
            >
              {`\u2190 ${t.admin.back}`}
            </a>
          </div>
          <h1 className="font-display text-4xl lowercase leading-none tracking-tight md:text-6xl">
            {t.admin.formTitleNew}
          </h1>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <ProductForm
            categories={categories}
            initial={initialValues}
            labels={{
              fieldSlug: t.admin.fieldSlug,
              fieldSlugHelp: t.admin.fieldSlugHelp,
              fieldNameEn: t.admin.fieldNameEn,
              fieldNameKa: t.admin.fieldNameKa,
              fieldDescriptionEn: t.admin.fieldDescriptionEn,
              fieldDescriptionKa: t.admin.fieldDescriptionKa,
              fieldCategory: t.admin.fieldCategory,
              fieldCategoryEmpty: t.admin.fieldCategoryEmpty,
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
            locale={state.locale}
            error={error}
            mode="create"
          />
        </div>
      </section>
    </AdminShell>
  );
});
