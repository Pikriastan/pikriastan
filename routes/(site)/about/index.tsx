import { Head } from "fresh/runtime";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";

export default define.page(function About(ctx) {
  const { t } = getT(ctx.state.locale);

  return (
    <>
      <Head>
        <title>Pikriastan - About</title>
      </Head>
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-5 pt-20 pb-24 sm:px-6 md:px-12 md:pt-28 md:pb-32">
          <p className="eyebrow mb-6">
            {`/ ${ctx.state.locale === "ka" ? "სტუდია" : "Studio"}`}
          </p>
          <h1 className="fade-up font-display font-normal text-[16vw] lowercase leading-[0.92] tracking-tight sm:text-[14vw] md:text-[10vw] lg:text-[9vw]">
            {t.about.title}
          </h1>

          <div className="mt-16 grid grid-cols-12 gap-8 md:mt-24 md:gap-16">
            <div className="col-span-12 md:col-span-6 md:col-start-1">
              <p className="max-w-lg font-display text-2xl text-ink/90 lowercase leading-snug md:text-3xl">
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
                <h3 className="col-span-10 font-display text-2xl lowercase leading-tight tracking-tight md:col-span-4 md:text-3xl">
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
    </>
  );
});
