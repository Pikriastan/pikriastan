import { notFound } from "next/navigation";
import { AdminShell } from "@/app/admin/_components/admin-shell";
import {
  ProductForm,
  type ProductFormValues,
} from "@/app/admin/_components/product-form";
import { getProductById } from "@/lib/db/queries";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  const initial: ProductFormValues = {
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
  const formVersion = [
    product.updatedAt.toISOString(),
    product.images.map((image) => `${image.id}:${image.sortOrder}`).join("|"),
  ].join(":");

  return (
    <AdminShell locale={locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <p className="eyebrow mb-3">/ {t.admin.edit}</p>
          <h1
            className={`${displayClass} text-4xl lowercase leading-none tracking-tight md:text-6xl`}
          >
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
            initial={initial}
            key={formVersion}
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
}
