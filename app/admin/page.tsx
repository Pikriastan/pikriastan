import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listProducts } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import { AdminShell } from "./_components/AdminShell";
import { DeleteProductButton } from "./_components/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
	if (!(await isAuthenticated())) {
		redirect("/admin/login");
	}
	const { locale, t } = await getT();
	const products = listProducts();
	const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

	return (
		<AdminShell locale={locale} t={t}>
			<section className="border-b hairline">
				<div className="mx-auto max-w-[1400px] px-6 md:px-12 py-14 md:py-20">
					<div className="flex items-end justify-between gap-6 flex-wrap">
						<div>
							<p className="eyebrow mb-4">{`/ ${locale === "ka" ? "მართვა" : "Admin"}`}</p>
							<h1
								className={`${displayClass} lowercase leading-none tracking-tight text-5xl md:text-7xl`}
							>
								{t.admin.dashboardTitle}
							</h1>
							<p className="mt-3 text-sm text-muted">
								{t.admin.dashboardSubtitle}
							</p>
						</div>
						<Link href="/admin/products/new" className="btn btn-primary">
							+ {t.admin.newProduct}
						</Link>
					</div>
				</div>
			</section>

			<section>
				<div className="mx-auto max-w-[1400px] px-6 md:px-12 py-12 md:py-16">
					<div className="flex items-center justify-between gap-4 mb-6">
						<h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
							{`${t.admin.productsHeader} \u2014 ${products.length}`}
						</h2>
					</div>

					{products.length === 0 ? (
						<div className="border hairline border-dashed py-28 grid place-items-center text-center">
							<p className="text-muted font-mono text-xs uppercase tracking-[0.24em] max-w-md">
								{t.admin.noProducts}
							</p>
							<Link href="/admin/products/new" className="btn btn-primary mt-7">
								+ {t.admin.newProduct}
							</Link>
						</div>
					) : (
						<ul className="border-t hairline">
							{products.map((p) => {
								const name = pickLocalized(p.name, locale);
								const category = pickLocalized(p.category, locale);
								return (
									<li
										key={p.id}
										className="grid grid-cols-12 gap-4 items-center border-b hairline py-5"
									>
										<div className="col-span-2 md:col-span-1">
											<div className="relative aspect-[4/5] w-full bg-paper-deep overflow-hidden">
												{p.images[0] ? (
													<Image
														src={p.images[0]}
														alt={name}
														fill
														sizes="80px"
														className="object-cover"
													/>
												) : null}
											</div>
										</div>
										<div className="col-span-10 md:col-span-5 min-w-0">
											<div
												className={`${displayClass} lowercase text-lg md:text-xl tracking-tight truncate`}
											>
												{name}
											</div>
											<div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted truncate">
												{`/ ${p.slug}${category ? ` \u00b7 ${category}` : ""}`}
											</div>
										</div>
										<div className="col-span-6 md:col-span-2 font-mono text-[12px]">
											{formatPrice(p.price, p.currency, locale)}
										</div>
										<div className="col-span-6 md:col-span-2 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
											<span className={p.published ? "text-ink" : "text-muted"}>
												{p.published ? t.admin.published : t.admin.draft}
											</span>
											{p.featured && (
												<span className="text-accent-strong">
													{`\u00b7 ${t.admin.featured}`}
												</span>
											)}
										</div>
										<div className="col-span-12 md:col-span-2 flex md:justify-end gap-5">
											<Link
												href={`/admin/products/${p.id}/edit`}
												className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink hover:text-accent-strong link-static decoration-line-strong"
											>
												{t.admin.edit}
											</Link>
											<DeleteProductButton
												id={p.id}
												label={t.admin.delete}
												confirmLabel={t.admin.confirmDelete}
											/>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</section>
		</AdminShell>
	);
}
