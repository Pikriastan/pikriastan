import { notFound, redirect } from "next/navigation";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import {
	ProductForm,
	type ProductFormValues,
} from "@/app/admin/_components/ProductForm";
import { isAuthenticated } from "@/lib/auth";
import { getProductById } from "@/lib/db";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	if (!(await isAuthenticated())) {
		redirect("/admin/login");
	}
	const { id } = await params;
	const product = getProductById(id);
	if (!product) notFound();

	const { locale, t } = await getT();
	const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

	const initial: ProductFormValues = {
		id: product.id,
		slug: product.slug,
		name: product.name,
		description: product.description,
		category: product.category,
		price: product.price,
		currency: product.currency,
		images: product.images,
		featured: product.featured,
		published: product.published,
	};

	return (
		<AdminShell locale={locale} t={t}>
			<section className="border-b hairline">
				<div className="mx-auto max-w-5xl px-5 md:px-10 py-10 md:py-14">
					<p className="eyebrow mb-3">/ {t.admin.edit}</p>
					<h1
						className={`${displayClass} lowercase leading-none tracking-tight text-4xl md:text-6xl`}
					>
						{t.admin.formTitleEdit}
					</h1>
					<p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
						/ {product.slug}
					</p>
				</div>
			</section>
			<section>
				<div className="mx-auto max-w-5xl px-5 md:px-10 py-10 md:py-14">
					<ProductForm
						initial={initial}
						mode="edit"
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
					/>
				</div>
			</section>
		</AdminShell>
	);
}
