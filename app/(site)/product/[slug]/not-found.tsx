import Link from "next/link";
import { getT } from "@/lib/i18n/server";

export default async function ProductNotFound() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-3xl px-6 md:px-12 py-32 text-center">
        <p className="eyebrow mb-6">404</p>
        <h1
          className={`${displayClass} leading-[0.95] tracking-tight text-5xl md:text-7xl lowercase`}
        >
          {t.product.notFound}
        </h1>
        <p className="mt-6 text-muted max-w-md mx-auto">
          {t.product.notFoundBody}
        </p>
        <Link href="/collection" className="btn btn-primary mt-10 inline-flex">
          {t.product.back}
        </Link>
      </div>
    </section>
  );
}
