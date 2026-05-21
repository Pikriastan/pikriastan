import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { listProducts } from "@/lib/db";
import { ProductCard } from "./_components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { locale, t } = await getT();
  const featured = listProducts({ featuredOnly: true, publishedOnly: true, limit: 6 });
  const latest =
    featured.length === 0
      ? listProducts({ publishedOnly: true, limit: 6 })
      : featured;

  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <>
      {/* HERO */}
      <section className="relative border-b hairline overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 md:px-10 pt-16 md:pt-28 pb-20 md:pb-36 grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 md:col-span-8 lg:col-span-9 fade-up">
            <p className="eyebrow mb-6">{t.hero.eyebrow}</p>
            <h1
              className={`${displayClass} uppercase leading-[0.88] tracking-tight text-ink text-[14vw] sm:text-[12vw] md:text-[9.5vw] lg:text-[8.5vw]`}
            >
              {t.hero.title}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 lg:col-span-3 fade-up" style={{ animationDelay: "120ms" }}>
            <p className="text-sm md:text-[15px] leading-relaxed text-ink/80 max-w-sm">
              {t.hero.subtitle}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row md:flex-col gap-3 items-stretch">
              <Link href="/collection" className="btn-primary">
                {t.hero.cta}
              </Link>
              <Link href="/about" className="btn-ghost">
                {t.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 pointer-events-none">
          <div className="mx-auto max-w-7xl px-5 md:px-10 pb-4 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
            <span>{locale === "ka" ? "თბილისი" : "Tbilisi"} 41°43′N</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section
        aria-hidden
        className="border-b hairline overflow-hidden bg-ink text-paper"
      >
        <div className="relative whitespace-nowrap py-4">
          <div className="marquee-track inline-flex gap-12 will-change-transform">
            {Array.from({ length: 2 }).map((_, copy) => (
              <div key={copy} className="inline-flex gap-12">
                {(locale === "ka"
                  ? [
                      "ნომრიანი სერია",
                      "თბილისი",
                      "შავი / ნახევრად შავი",
                      "სამუდამო შეკეთება",
                      "შეზღუდული",
                      "ვოლ. 01",
                    ]
                  : [
                      "Numbered runs",
                      "Tbilisi",
                      "Black / off-black",
                      "Lifetime mending",
                      "Limited",
                      "Vol. 01",
                    ]
                ).map((word, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className={`${displayClass} uppercase text-2xl md:text-3xl tracking-tight`}
                  >
                    {word}
                    <span className="ml-12 opacity-60">{"\u2022"}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PIECES */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-16 md:py-24">
          <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
            <div>
              <p className="eyebrow mb-3">{t.home.featuredEyebrow}</p>
              <h2
                className={`${displayClass} uppercase text-4xl md:text-6xl leading-none tracking-tight`}
              >
                {t.home.featuredTitle}
              </h2>
            </div>
            <Link
              href="/collection"
              className="hidden md:inline-flex link-underline pb-1 font-mono text-[11px] uppercase tracking-[0.24em]"
            >
              {t.home.viewAll}
            </Link>
          </div>

          {latest.length === 0 ? (
            <div className="border hairline-strong border-dashed py-20 grid place-items-center text-center">
              <p className="text-muted font-mono text-xs uppercase tracking-[0.22em] max-w-md">
                {t.collection.empty}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16">
              {latest.map((p, i) => (
                <ProductCard key={p.id} product={p} locale={locale} index={i} />
              ))}
            </div>
          )}

          <div className="mt-10 md:hidden">
            <Link href="/collection" className="btn-ghost w-full">
              {t.home.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* STUDIO STORY + MANIFESTO */}
      <section className="border-b hairline">
        <div className="mx-auto max-w-7xl px-5 md:px-10 py-16 md:py-28 grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-6">
            <p className="eyebrow mb-4">{t.home.storyEyebrow}</p>
            <h2
              className={`${displayClass} uppercase text-4xl md:text-6xl leading-[0.95] tracking-tight max-w-lg`}
            >
              {t.home.storyTitle}
            </h2>
            <p className="mt-8 text-base md:text-lg leading-relaxed text-ink/80 max-w-md">
              {t.home.storyBody}
            </p>
            <Link href="/about" className="mt-8 inline-flex btn-ghost">
              {t.home.aboutCta}
            </Link>
          </div>

          <div className="col-span-12 md:col-span-6 md:pl-12 md:border-l hairline">
            <p className="eyebrow mb-6">{t.home.manifestoTitle}</p>
            <ol className="space-y-5">
              {t.home.manifestoLines.map((line, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-5 border-b hairline pb-4"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted shrink-0 w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg md:text-xl leading-snug">{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
