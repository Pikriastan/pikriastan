import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/db";
import { formatPrice, pickLocalized } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import { ProductGallery } from "../../_components/ProductGallery";

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
  if (!product?.published) notFound();

  const name = pickLocalized(product.name, locale);
  const category = pickLocalized(product.category, locale);
  const description = pickLocalized(product.description, locale);
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <article className="border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-10 md:pt-14 pb-24 md:pb-32">
        <div className="mb-10 md:mb-14">
          <Link
            href="/collection"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted hover:text-ink link-underline pb-1 inline-block"
          >
            {`\u2190 ${t.product.back}`}
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-10 md:gap-16">
          <div className="col-span-12 lg:col-span-7 fade-up">
            <ProductGallery images={product.images} alt={name} />
          </div>

          <aside
            className="col-span-12 lg:col-span-5 lg:sticky lg:top-32 lg:self-start fade-up"
            style={{ animationDelay: "100ms" }}
          >
            {category && <p className="eyebrow mb-6">{category}</p>}
            <h1
              className={`${displayClass} leading-[0.95] tracking-tight text-4xl md:text-5xl lg:text-[3.2rem] lowercase`}
            >
              {name}
            </h1>

            <div
              className={`mt-7 ${displayClass} text-2xl md:text-3xl tracking-tight`}
            >
              {formatPrice(product.price, product.currency, locale)}
            </div>

            <div className="mt-10 border-t hairline pt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted mb-3">
                {t.product.description}
              </p>
              <p className="whitespace-pre-line text-[15px] md:text-base leading-relaxed text-ink/85">
                {description || t.product.noDescription}
              </p>
            </div>

            <div className="mt-10 border-t hairline pt-7 space-y-4 font-mono text-[11px] uppercase tracking-[0.2em]">
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
              href={`mailto:studio@amiranas-gamofena.test?subject=${encodeURIComponent(
                `Inquiry: ${product.name.en} (${product.slug})`,
              )}`}
              className="btn btn-primary mt-12 w-full"
            >
              {t.product.inquire}
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}
