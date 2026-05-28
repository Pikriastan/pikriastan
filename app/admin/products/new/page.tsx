import { AdminShell } from "@/app/admin/_components/admin-shell";
import {
  ProductForm,
  type ProductFormValues,
} from "@/app/admin/_components/product-form";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

const empty: ProductFormValues = {
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

export default async function NewProductPage() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <AdminShell locale={locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <p className="eyebrow mb-3">/ {t.admin.newProduct}</p>
          <h1
            className={`${displayClass} text-4xl lowercase leading-none tracking-tight md:text-6xl`}
          >
            {t.admin.formTitleNew}
          </h1>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <ProductForm
            initial={empty}
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
            mode="create"
          />
        </div>
      </section>
    </AdminShell>
  );
}
