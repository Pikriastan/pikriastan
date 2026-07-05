import type { Locale } from "@/lib/constants.ts";
import type { Category } from "@/lib/db/schema.ts";
import type { Dictionary } from "@/lib/i18n/dictionaries.ts";
import { pickLocalized } from "@/lib/utils.ts";
import type { CategoryFormLabels } from "@/routes/admin/(_islands)/category-form-button.tsx";
import { CategoryFormButton } from "@/routes/admin/(_islands)/category-form-button.tsx";

export function AdminCategories({
  categories,
  formLabels,
  locale,
  page,
  t,
  total,
  totalPages,
}: {
  categories: Category[];
  formLabels: CategoryFormLabels;
  locale: Locale;
  page: number;
  t: Dictionary["admin"];
  total: number;
  totalPages: number;
}) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
          {`${t.categoriesHeader} \u2014 ${total}`}
        </p>
        <CategoryFormButton labels={formLabels} mode="create" />
      </div>

      {categories.length === 0 ? (
        <div className="hairline grid place-items-center border border-dashed py-16 text-center">
          <p className="font-mono text-muted text-xs uppercase tracking-[0.24em]">
            {t.categoriesEmpty}
          </p>
        </div>
      ) : (
        <ul className="hairline border-t">
          {categories.map((category) => (
            <li
              className="hairline flex flex-wrap items-center justify-between gap-4 border-b py-4"
              key={category.id}
            >
              <div className="min-w-0">
                <p className="font-display text-lg lowercase tracking-tight">
                  {pickLocalized(
                    { en: category.nameEn, ka: category.nameKa },
                    locale,
                  )}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted uppercase tracking-[0.22em]">
                  {`${category.nameEn} / ${category.nameKa}`}
                </p>
              </div>
              <CategoryFormButton
                category={category}
                labels={formLabels}
                mode="edit"
              />
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {page > 1 ? (
            <a
              className="btn btn-ghost"
              href={`/admin/categories?page=${page - 1}`}
            >
              {t.prevPage}
            </a>
          ) : (
            <span className="btn btn-ghost pointer-events-none opacity-40">
              {t.prevPage}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted uppercase tracking-[0.22em]">
            {`${t.pageLabel} ${page} / ${totalPages}`}
          </span>
          {page < totalPages ? (
            <a
              className="btn btn-ghost"
              href={`/admin/categories?page=${page + 1}`}
            >
              {t.nextPage}
            </a>
          ) : (
            <span className="btn btn-ghost pointer-events-none opacity-40">
              {t.nextPage}
            </span>
          )}
        </div>
      )}
    </>
  );
}
