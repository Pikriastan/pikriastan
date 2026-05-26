import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function ProductNotFound() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  return (
    <section className="hairline border-b">
      <div className="mx-auto max-w-3xl px-6 py-32 text-center md:px-12">
        <p className="eyebrow mb-6">404</p>
        <h1
          className={`${displayClass} text-5xl lowercase leading-[0.95] tracking-tight md:text-7xl`}
        >
          {t.product.notFound}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">
          {t.product.notFoundBody}
        </p>
        <Link className="btn btn-primary mt-10 inline-flex" href="/collection">
          {t.product.back}
        </Link>
      </div>
    </section>
  );
}
