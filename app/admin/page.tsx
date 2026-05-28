import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { AdminProducts } from "./_components/admin-products";
import { AdminShell } from "./_components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <AdminShell locale={locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-350 px-6 py-14 md:px-12 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">{`/ ${locale === "ka" ? "მართვა" : "Admin"}`}</p>
              <h1
                className={`${displayClass} text-5xl lowercase leading-none tracking-tight md:text-7xl`}
              >
                {t.admin.dashboardTitle}
              </h1>
              <p className="mt-3 text-muted text-sm">
                {t.admin.dashboardSubtitle}
              </p>
            </div>
            <Link className="btn btn-primary" href="/admin/products/new">
              + {t.admin.newProduct}
            </Link>
          </div>
        </div>
      </section>

      <AdminProducts displayClass={displayClass} locale={locale} t={t.admin} />
    </AdminShell>
  );
}
