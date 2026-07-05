import { CATEGORIES_PAGE_SIZE } from "@/lib/constants.ts";
import { getCategoriesPage } from "@/lib/db/queries.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { AdminShell } from "@/routes/admin/(_components)/admin-shell.tsx";
import { AdminCategories } from "@/routes/admin/(_components)/categories-list.tsx";

export default define.page(async (ctx) => {
  const { state } = ctx;
  const { t } = getT(state.locale);
  const page = Math.max(
    1,
    Number(ctx.url.searchParams.get("page") ?? "1") || 1,
  );
  const { items, total } = await getCategoriesPage({
    page,
    pageSize: CATEGORIES_PAGE_SIZE,
  });
  const totalPages = Math.max(1, Math.ceil(total / CATEGORIES_PAGE_SIZE));

  const formLabels = {
    cancel: t.admin.cancel,
    createCategory: t.admin.createCategory,
    edit: t.admin.edit,
    fieldNameEn: t.admin.fieldCategoryEn,
    fieldNameKa: t.admin.fieldCategoryKa,
    formTitleCreate: t.admin.categoryFormTitleCreate,
    formTitleEdit: t.admin.categoryFormTitleEdit,
    save: t.admin.save,
    saveError: t.admin.saveError,
    saving: t.admin.saving,
  };

  return (
    <AdminShell locale={state.locale} t={t}>
      <section className="hairline border-b">
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="eyebrow mb-0">/ {t.admin.categoriesHeader}</p>
            <a
              className="shrink-0 font-mono text-[10px] text-muted uppercase tracking-[0.28em] hover:text-ink"
              href="/admin"
            >
              {`\u2190 ${t.admin.back}`}
            </a>
          </div>
          <h1 className="font-display text-4xl lowercase leading-none tracking-tight md:text-6xl">
            {t.admin.categoriesTitle}
          </h1>
          <p className="mt-3 text-muted text-sm">
            {t.admin.categoriesSubtitle}
          </p>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-14">
          <AdminCategories
            categories={items}
            formLabels={formLabels}
            locale={state.locale}
            page={page}
            t={t.admin}
            total={total}
            totalPages={totalPages}
          />
        </div>
      </section>
    </AdminShell>
  );
});
