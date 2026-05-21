import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Studio",
};

export default async function AboutPage() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-7xl px-5 md:px-10 pt-14 md:pt-20 pb-20 md:pb-28">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-7 fade-up">
            <p className="eyebrow mb-6">/ {locale === "ka" ? "სტუდია" : "Studio"}</p>
            <h1
              className={`${displayClass} uppercase leading-[0.9] tracking-tight text-[16vw] sm:text-[14vw] md:text-[10vw] lg:text-[9vw]`}
            >
              {t.about.title}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-5 fade-up" style={{ animationDelay: "120ms" }}>
            <p className="text-xl md:text-2xl leading-snug text-ink/90">
              {t.about.intro}
            </p>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-12 gap-8 md:gap-12">
          <div className="col-span-12 md:col-span-6 md:col-start-3 space-y-6 text-[15px] md:text-base leading-relaxed text-ink/85">
            <p>{t.about.body1}</p>
            <p>{t.about.body2}</p>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-px bg-line-strong border hairline-strong">
          {t.about.values.map((v, i) => (
            <div key={i} className="bg-paper p-8 md:p-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted mb-4">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className={`${displayClass} uppercase text-2xl md:text-3xl leading-tight`}
              >
                {v.title}
              </h3>
              <p className="mt-3 text-sm text-ink/80 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
