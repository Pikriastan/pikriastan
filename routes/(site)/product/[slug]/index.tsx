import { HttpError } from "fresh";
import { Head } from "fresh/runtime";
import { INQUIRY_EMAIL } from "@/lib/constants.ts";
import { getProductBySlug } from "@/lib/db/queries.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define, formatPrice, pickLocalized } from "@/lib/utils.ts";
import { ProductGallery } from "@/routes/(site)/(_islands)/product-gallery.tsx";

export default define.page(async ({ params, state }) => {
  const { t } = getT(state.locale);
  const product = await getProductBySlug(params.slug);

  if (!product) {
    throw new HttpError(404);
  }

  const name = pickLocalized(
    { en: product.nameEn, ka: product.nameKa },
    state.locale,
  );
  const category = pickLocalized(
    { en: product.categoryEn, ka: product.categoryKa },
    state.locale,
  );
  const description = pickLocalized(
    { en: product.descriptionEn, ka: product.descriptionKa },
    state.locale,
  );

  return (
    <>
      <Head>
        <title>Pikriastan - {product.nameEn}</title>
      </Head>
      <article className="hairline border-b">
        <div className="mx-auto max-w-350 px-5 pt-10 pb-24 sm:px-6 md:px-12 md:pt-14 md:pb-32">
          <div className="mb-10 md:mb-14">
            <a
              className="link-underline inline-block pb-1 font-mono text-[10px] text-muted uppercase tracking-[0.28em] hover:text-ink"
              href="/collection"
            >
              {`\u2190 ${t.product.back}`}
            </a>
          </div>

          <div className="grid min-w-0 grid-cols-12 gap-y-10 md:gap-y-16 lg:gap-x-16 lg:gap-y-0">
            <div className="fade-up col-span-12 min-w-0 lg:col-span-7">
              <ProductGallery
                alt={name}
                images={product.images.map((i) => i.url)}
              />
            </div>

            <aside
              className="fade-up col-span-12 min-w-0 lg:sticky lg:top-32 lg:col-span-5 lg:self-start"
              style={{ animationDelay: "100ms" }}
            >
              {category && <p className="eyebrow mb-6">{category}</p>}
              <h1 className="font-display text-4xl lowercase leading-[0.95] tracking-tight md:text-5xl lg:text-[3.2rem]">
                {name}
              </h1>

              <div className="mt-7 font-display text-2xl tracking-tight md:text-3xl">
                {formatPrice(product.price, product.currency, state.locale)}
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
                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-muted">
                    {t.product.category}
                  </span>
                  <span className="wrap-break-word min-w-0 text-right">
                    {category || "\u2014"}
                  </span>
                </div>
                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-muted">N°</span>
                  <span className="wrap-break-word min-w-0 text-right">
                    {product.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex min-w-0 justify-between gap-4">
                  <span className="shrink-0 text-muted">{t.product.price}</span>
                  <span className="wrap-break-word min-w-0 text-right">
                    {formatPrice(product.price, product.currency, state.locale)}
                  </span>
                </div>
              </div>

              <a
                className="btn btn-primary mt-12 w-full min-w-0 max-w-full whitespace-normal text-center"
                href={`mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent(
                  `Inquiry: ${product.nameEn} (${product.slug})`,
                )}`}
              >
                {t.product.inquire}
              </a>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
});
