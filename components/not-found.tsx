import type { Locale } from "@/lib/constants.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { Footer } from "@/routes/(site)/(_components)/footer.tsx";
import { Header } from "@/routes/(site)/(_components)/header.tsx";

export function NotFound({ locale }: { locale: Locale }) {
  const { t } = getT(locale);

  return (
    <main>
      <Header locale={locale} />
      <section className="hero-glow hairline border-b">
        <div className="mx-auto flex min-h-[68vh] max-w-350 flex-col justify-center px-6 py-24 md:px-12 md:py-32">
          <p className="eyebrow dot-accent fade-up mb-8">
            {t.notFound.eyebrow}
          </p>

          <h1
            className="fade-up font-display text-[40vw] text-ink leading-[0.78] tracking-tight sm:text-[32vw] md:text-[20vw] lg:text-[16vw]"
            style={{ animationDelay: "60ms" }}
          >
            {t.notFound.code}
          </h1>

          <div
            className="fade-up mt-12 grid grid-cols-12 items-start gap-8 md:mt-16 md:gap-12"
            style={{ animationDelay: "140ms" }}
          >
            <div className="col-span-12 md:col-span-6 md:col-start-1">
              <h2 className="max-w-md font-display text-3xl lowercase leading-[0.98] tracking-tight md:text-5xl">
                {t.notFound.title}
              </h2>
              <p className="mt-6 max-w-md text-[15px] text-ink/75 leading-relaxed md:text-base">
                {t.notFound.body}
              </p>
            </div>
            <div className="col-span-12 flex flex-col gap-3 sm:flex-row md:col-span-4 md:col-start-9 md:flex-col md:items-end">
              <a className="btn btn-primary w-full sm:w-auto" href="/">
                {t.notFound.home}
              </a>
              <a className="btn btn-ghost w-full sm:w-auto" href="/collection">
                {t.notFound.collection}
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
