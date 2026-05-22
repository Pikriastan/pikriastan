import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Studio",
};

export default async function AboutPage() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-20 md:pt-28 pb-24 md:pb-32">
        <p className="eyebrow mb-6">{`/ ${locale === "ka" ? "სტუდია" : "Studio"}`}</p>
        <h1
          className={`${displayClass} leading-[0.92] tracking-tight text-[16vw] sm:text-[14vw] md:text-[10vw] lg:text-[9vw] lowercase fade-up`}
        >
          {t.about.title}
        </h1>

        <div className="mt-16 md:mt-24 grid grid-cols-12 gap-8 md:gap-16">
          <div className="col-span-12 md:col-span-6 md:col-start-1">
            <p
              className={`${displayClass} text-2xl md:text-3xl leading-snug lowercase text-ink/90 max-w-lg`}
            >
              {t.about.intro}
            </p>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 space-y-5 text-[15px] md:text-base leading-relaxed text-ink/80">
            <p>{t.about.body1}</p>
            <p>{t.about.body2}</p>
          </div>
        </div>

        <div className="mt-24 md:mt-32 border-t hairline">
          {t.about.values.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 md:gap-12 items-baseline border-b hairline py-8 md:py-10"
            >
              <span className="col-span-2 md:col-span-1 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className={`col-span-10 md:col-span-4 ${displayClass} text-2xl md:text-3xl leading-tight lowercase tracking-tight`}
              >
                {v.title}
              </h3>
              <p className="col-span-12 md:col-span-6 md:col-start-7 text-[15px] text-ink/75 leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
