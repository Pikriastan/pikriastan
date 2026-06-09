import { define } from "@/lib/utils.ts";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";
import { getT } from "@/lib/i18n/locales.ts";
import { getProductById } from "@/lib/db/queries.ts";
import { HttpError } from "fresh/runtime";

export default define.page(async ({ params, state }) => {
  const { t } = getT(state.locale);
  const product = await getProductById(params.id);

  if (!product) {
    throw new HttpError(404, "Product not found");
  }

  return (
    <AdminShell locale={state.locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <p className="eyebrow mb-3">/ {t.admin.edit}</p>
          <h1 className="font-display text-4xl lowercase leading-none tracking-tight md:text-6xl">
            {t.admin.formTitleEdit}
          </h1>
          <p className="mt-3 font-mono text-[11px] text-muted uppercase tracking-[0.22em]">
            / {product.slug}
          </p>
        </div>
      </section>
    </AdminShell>
  );
});
