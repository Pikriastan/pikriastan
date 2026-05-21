import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function ProductNotFound() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-3xl px-5 md:px-10 py-32 text-center">
        <p className="eyebrow mb-6 justify-center">404</p>
        <h1
          className={`${displayClass} uppercase leading-[0.95] tracking-tight text-5xl md:text-7xl`}
        >
          {t.product.notFound}
        </h1>
        <p className="mt-6 text-muted max-w-md mx-auto">{t.product.notFoundBody}</p>
        <Link href="/collection" className="btn-primary mt-10 inline-flex">
          {t.product.back}
        </Link>
      </div>
    </section>
  );
}
