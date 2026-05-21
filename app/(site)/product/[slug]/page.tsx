import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { getT } from "@/lib/i18n/server";
import { formatPrice, pickLocalized } from "@/lib/format";
import { ProductGallery } from "../../_components/ProductGallery";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name.en,
    description: product.description.en?.slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, t } = await getT();
  const product = getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const name = pickLocalized(product.name, locale);
  const category = pickLocalized(product.category, locale);
  const description = pickLocalized(product.description, locale);
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <article className="border-b hairline">
      <div className="mx-auto max-w-7xl px-5 md:px-10 pt-8 md:pt-12 pb-20 md:pb-28">
        <div className="mb-8 md:mb-12">
          <Link
            href="/collection"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted hover:text-ink"
          >
            {"\u2190 "}
            {t.product.back}
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 lg:col-span-8 fade-up">
            <ProductGallery images={product.images} alt={name} />
          </div>

          <aside
            className="col-span-12 lg:col-span-4 lg:sticky lg:top-28 lg:self-start fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {category && <p className="eyebrow mb-4">{category}</p>}
            <h1
              className={`${displayClass} uppercase leading-[0.95] tracking-tight text-4xl md:text-5xl lg:text-[3.2rem]`}
            >
              {name}
            </h1>

            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-2xl md:text-3xl tracking-tight">
                {formatPrice(product.price, product.currency, locale)}
              </span>
              <span className="tag">{t.product.soldOutSoon}</span>
            </div>

            <div className="mt-10 border-t hairline pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted mb-3">
                {t.product.description}
              </p>
              <p className="whitespace-pre-line text-[15px] md:text-base leading-relaxed text-ink/85">
                {description || t.product.noDescription}
              </p>
            </div>

            <div className="mt-10 border-t hairline pt-6 space-y-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <div className="flex justify-between gap-4">
                <span className="text-muted">{t.product.category}</span>
                <span>{category || "\u2014"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">N\u00b0</span>
                <span>{product.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{t.product.price}</span>
                <span>{formatPrice(product.price, product.currency, locale)}</span>
              </div>
            </div>

            <a
              href={`mailto:studio@amiranas-gamofena.test?subject=${encodeURIComponent(
                `Inquiry: ${product.name.en} (${product.slug})`,
              )}`}
              className="btn-primary mt-10 w-full"
            >
              {t.product.inquire}
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}
