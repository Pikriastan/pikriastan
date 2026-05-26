import Link from "next/link";
import { getT } from "@/lib/i18n/server";
// import { ProductCard } from "./_components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { locale, t } = await getT();

  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <>
      {/* HERO */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-350 px-6 md:px-12 pt-24 md:pt-32 pb-24 md:pb-32">
          <p className="eyebrow mb-10 fade-up">{t.hero.eyebrow}</p>
          <div className="grid grid-cols-12 gap-8 md:gap-12 items-end">
            <h1
              className={`col-span-12 md:col-span-10 ${displayClass} leading-[0.92] tracking-tight text-ink text-[14vw] sm:text-[12vw] md:text-[8.6vw] lowercase fade-up`}
              style={{ animationDelay: "60ms" }}
            >
              {t.hero.title}
            </h1>
          </div>
          <div
            className="mt-12 md:mt-16 grid grid-cols-12 gap-8 md:gap-12 items-start fade-up"
            style={{ animationDelay: "140ms" }}
          >
            <div className="col-span-12 md:col-span-5 md:col-start-1">
              <p className="text-[15px] md:text-base leading-relaxed text-ink/80 max-w-sm">
                {t.hero.subtitle}
              </p>
            </div>
            <div className="col-span-12 md:col-span-3 md:col-start-10 flex md:justify-end">
              <Link href="/collection" className="btn btn-primary">
                {t.hero.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PIECES */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-20 md:py-28">
          <div className="flex items-end justify-between gap-6 mb-14 md:mb-20">
            <div>
              <p className="eyebrow mb-4 dot-accent">
                {t.home.featuredEyebrow}
              </p>
              <h2
                className={`${displayClass} leading-[0.95] tracking-tight text-4xl md:text-6xl lg:text-7xl lowercase`}
              >
                {t.home.featuredTitle}
              </h2>
            </div>
            <Link
              href="/collection"
              className="hidden md:inline-flex btn-text link-underline pb-1"
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
            <Link href="/collection" className="btn btn-ghost w-full">
              {t.home.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* STUDIO STORY */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-24 md:py-32">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-5">
              <p className="eyebrow mb-5">{t.home.storyEyebrow}</p>
              <h2
                className={`${displayClass} leading-[0.95] tracking-tight text-4xl md:text-5xl lg:text-6xl lowercase max-w-md`}
              >
                {t.home.storyTitle}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <p className="text-base md:text-lg leading-relaxed text-ink/80 max-w-md">
                {t.home.storyBody}
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex btn-text link-underline pb-1"
              >
                {t.home.aboutCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-350 px-6 md:px-12 py-24 md:py-32">
          <p className="eyebrow mb-12">{t.home.manifestoTitle}</p>
          <ol className="space-y-0">
            {t.home.manifestoLines.map((line, i) => (
              <li
                key={line}
                className="grid grid-cols-12 gap-4 md:gap-8 items-baseline border-t hairline py-6 md:py-8"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`col-span-10 md:col-span-11 ${displayClass} text-2xl md:text-4xl leading-snug lowercase tracking-tight`}
                >
                  {line}
                </span>
              </li>
            ))}
            <li className="border-t hairline" />
          </ol>
        </div>
      </section>
    </>
  );
}
