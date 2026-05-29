import { getT } from "@/lib/i18n/server";

export const metadata = {
  title: "Studio",
};

export default async function AboutPage() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <section className="hairline border-b">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-24 md:px-12 md:pt-28 md:pb-32">
        <p className="eyebrow mb-6">
          {`/ ${locale === "ka" ? "სტუდია" : "Studio"}`}
        </p>
        <h1
          className={`${displayClass} fade-up text-[16vw] lowercase leading-[0.92] tracking-tight sm:text-[14vw] md:text-[10vw] lg:text-[9vw]`}
        >
          {t.about.title}
        </h1>

        <div className="mt-16 grid grid-cols-12 gap-8 md:mt-24 md:gap-16">
          <div className="col-span-12 md:col-span-6 md:col-start-1">
            <p
              className={`${displayClass} max-w-lg text-2xl text-ink/90 lowercase leading-snug md:text-3xl`}
            >
              {t.about.intro}
            </p>
          </div>
          <div className="col-span-12 space-y-5 text-[15px] text-ink/80 leading-relaxed md:col-span-5 md:col-start-8 md:text-base">
            <p>{t.about.body1}</p>
            <p>{t.about.body2}</p>
          </div>
        </div>

        <div className="hairline mt-24 border-t md:mt-32">
          {t.about.values.map((v, i) => (
            <div
              className="hairline grid grid-cols-12 items-baseline gap-4 border-b py-8 md:gap-12 md:py-10"
              key={v.title}
            >
              <span className="col-span-2 font-mono text-[11px] text-muted uppercase tracking-[0.24em] md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className={`col-span-10 md:col-span-4 ${displayClass} text-2xl lowercase leading-tight tracking-tight md:text-3xl`}
              >
                {v.title}
              </h3>
              <p className="col-span-12 text-[15px] text-ink/75 leading-relaxed md:col-span-6 md:col-start-7">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
