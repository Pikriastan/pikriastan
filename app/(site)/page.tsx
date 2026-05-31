import Link from "next/link";
import { getT } from "@/lib/i18n/server";
// import { ProductCard } from "./_components/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { locale, t } = await getT();

  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <>
      {/* HERO */}
      <section className="hero-glow hairline border-b">
        <div className="mx-auto max-w-350 px-6 pt-24 pb-24 md:px-12 md:pt-32 md:pb-32">
          <p className="eyebrow fade-up mb-10">{t.hero.eyebrow}</p>
          <div className="grid grid-cols-12 items-end gap-8 md:gap-12">
            <h1
              className={`col-span-12 md:col-span-10 ${displayClass} fade-up text-[14vw] text-ink lowercase leading-[0.92] tracking-tight sm:text-[12vw] md:text-[8.6vw]`}
              style={{ animationDelay: "60ms" }}
            >
              {t.hero.title}
            </h1>
          </div>
          <div
            className="fade-up mt-12 grid grid-cols-12 items-start gap-8 md:mt-16 md:gap-12"
            style={{ animationDelay: "140ms" }}
          >
            <div className="col-span-12 md:col-span-5 md:col-start-1">
              <p className="max-w-sm text-[15px] text-ink/80 leading-relaxed md:text-base">
                {t.hero.subtitle}
              </p>
            </div>
            <div className="col-span-12 flex md:col-span-3 md:col-start-10 md:justify-end">
              <Link className="btn btn-primary" href="/collection">
                {t.hero.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PIECES */}
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-6 py-20 md:px-12 md:py-28">
          <div className="mb-14 flex items-end justify-between gap-6 md:mb-20">
            <div>
              <p className="eyebrow dot-accent mb-4">
                {t.home.featuredEyebrow}
              </p>
              <h2
                className={`${displayClass} text-4xl lowercase leading-[0.95] tracking-tight md:text-6xl lg:text-7xl`}
              >
                {t.home.featuredTitle}
              </h2>
            </div>
            <Link
              className="btn-text link-underline hidden pb-1 md:inline-flex"
              href="/collection"
            >
              {t.home.viewAll}
            </Link>
          </div>

          {/*{latest.length === 0 ? (
            <div className="border hairline border-dashed py-28 grid place-items-center text-center">
              <p className="text-muted font-mono text-xs uppercase tracking-[0.24em] max-w-md">
                {t.collection.empty}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-10 md:gap-y-20">
              {latest.map((p, i) => (
                <ProductCard key={p.id} product={p} locale={locale} index={i} />
              ))}
            </div>
          )}*/}

          <div className="mt-14 md:hidden">
            <Link className="btn btn-ghost w-full" href="/collection">
              {t.home.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* STUDIO STORY */}
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-6 py-24 md:px-12 md:py-32">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-5">
              <p className="eyebrow mb-5">{t.home.storyEyebrow}</p>
              <h2
                className={`${displayClass} max-w-md text-4xl lowercase leading-[0.95] tracking-tight md:text-5xl lg:text-6xl`}
              >
                {t.home.storyTitle}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p className="max-w-md text-base text-ink/80 leading-relaxed md:text-lg">
                {t.home.storyBody}
              </p>
              <Link
                className="btn-text link-underline mt-8 inline-flex pb-1"
                href="/about"
              >
                {t.home.aboutCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-6 py-24 md:px-12 md:py-32">
          <p className="eyebrow mb-12">{t.home.manifestoTitle}</p>
          <ol className="space-y-0">
            {t.home.manifestoLines.map((line, i) => (
              <li
                className="hairline grid grid-cols-12 items-baseline gap-4 border-t py-6 md:gap-8 md:py-8"
                key={line}
              >
                <span className="col-span-2 font-mono text-[11px] text-muted uppercase tracking-[0.24em] md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`col-span-10 md:col-span-11 ${displayClass} text-2xl lowercase leading-snug tracking-tight md:text-4xl`}
                >
                  {line}
                </span>
              </li>
            ))}
            <li className="hairline border-t" />
          </ol>
        </div>
      </section>
    </>
  );
}
