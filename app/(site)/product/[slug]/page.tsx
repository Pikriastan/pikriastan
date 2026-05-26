import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import { ProductGallery } from "../../_components/product-gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Not found" };
  }
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
  if (!product.published) {
    notFound();
  }

  const name = pickLocalized(product.name, locale);
  const category = pickLocalized(product.category, locale);
  const description = pickLocalized(product.description, locale);
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <article className="hairline border-b">
      <div className="mx-auto max-w-[1400px] px-6 pt-10 pb-24 md:px-12 md:pt-14 md:pb-32">
        <div className="mb-10 md:mb-14">
          <Link
            className="link-underline inline-block pb-1 font-mono text-[10px] text-muted uppercase tracking-[0.28em] hover:text-ink"
            href="/collection"
          >
            {`\u2190 ${t.product.back}`}
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-10 md:gap-16">
          <div className="fade-up col-span-12 lg:col-span-7">
            <ProductGallery alt={name} images={product.images} />
          </div>

          <aside
            className="fade-up col-span-12 lg:sticky lg:top-32 lg:col-span-5 lg:self-start"
            style={{ animationDelay: "100ms" }}
          >
            {category && <p className="eyebrow mb-6">{category}</p>}
            <h1
              className={`${displayClass} text-4xl lowercase leading-[0.95] tracking-tight md:text-5xl lg:text-[3.2rem]`}
            >
              {name}
            </h1>

            <div
              className={`mt-7 ${displayClass} text-2xl tracking-tight md:text-3xl`}
            >
              {formatPrice(product.price, product.currency, locale)}
            </div>

            <div className="hairline mt-10 border-t pt-7">
              <p className="mb-3 font-mono text-[10px] text-muted uppercase tracking-[0.28em]">
                {t.product.description}
              </p>
              <p className="whitespace-pre-line text-[15px] text-ink/85 leading-relaxed md:text-base">
                {description || t.product.noDescription}
              </p>
            </div>

            <div className="hairline mt-10 space-y-4 border-t pt-7 font-mono text-[11px] uppercase tracking-[0.2em]">
              <div className="flex justify-between gap-4">
                <span className="text-muted">{t.product.category}</span>
                <span>{category || "\u2014"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{"N\u00b0"}</span>
                <span>{product.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{t.product.price}</span>
                <span>
                  {formatPrice(product.price, product.currency, locale)}
                </span>
              </div>
            </div>

            <a
              className="btn btn-primary mt-12 w-full"
              href={`mailto:studio@amiranas-gamofena.test?subject=${encodeURIComponent(
                `Inquiry: ${product.name.en} (${product.slug})`
              )}`}
            >
              {t.product.inquire}
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}
