import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { toast } from "@/lib/toast.ts";

export interface CategoryFormLabels {
  cancel: string;
  createCategory: string;
  edit: string;
  fieldNameEn: string;
  fieldNameKa: string;
  formTitleCreate: string;
  formTitleEdit: string;
  save: string;
  saveError: string;
  saving: string;
}

interface CategoryFormButtonProps {
  category?: {
    id: string;
    nameEn: string;
    nameKa: string;
  };
  labels: CategoryFormLabels;
  mode: "create" | "edit";
}

export function CategoryFormButton({
  mode,
  category,
  labels,
}: CategoryFormButtonProps) {
  const saving = useSignal(false);
  const nameEn = useSignal(category?.nameEn ?? "");
  const nameKa = useSignal(category?.nameKa ?? "");
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    if (mode === "edit" && category) {
      nameEn.value = category.nameEn;
      nameKa.value = category.nameKa;
    } else {
      nameEn.value = "";
      nameKa.value = "";
    }
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (saving.value) {
      return;
    }

    saving.value = true;
    const body = new FormData();
    body.set("nameEn", nameEn.value);
    body.set("nameKa", nameKa.value);

    const endpoint =
      mode === "create"
        ? "/api/categories"
        : `/api/categories/${category?.id ?? ""}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const response = await fetch(endpoint, {
        method,
        body,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || `Server error: ${response.status}`);
      }

      closeDialog();
      globalThis.location.reload();
    } catch (err) {
      toast.error(labels.saveError, {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      saving.value = false;
    }
  }

  return (
    <>
      {mode === "create" ? (
        <button className="btn btn-primary" onClick={openDialog} type="button">
          {`+ ${labels.createCategory}`}
        </button>
      ) : (
        <button
          className="link-static border-0 bg-transparent p-0 font-mono text-[11px] text-ink uppercase tracking-[0.22em] decoration-line-strong hover:text-accent-strong"
          onClick={openDialog}
          type="button"
        >
          {labels.edit}
        </button>
      )}

      <dialog
        className="admin-dialog"
        onCancel={(e) => {
          e.preventDefault();
          closeDialog();
        }}
        ref={dialogRef}
      >
        <form className="admin-dialog-panel" onSubmit={handleSubmit}>
          <div className="admin-dialog-header">
            <div>
              <p className="eyebrow mb-3">
                {`/ ${mode === "create" ? labels.createCategory : labels.edit}`}
              </p>
              <h2 className="font-display text-3xl lowercase leading-none tracking-tight md:text-4xl">
                {mode === "create"
                  ? labels.formTitleCreate
                  : labels.formTitleEdit}
              </h2>
            </div>
            <button
              aria-label={labels.cancel}
              className="admin-dialog-close"
              onClick={closeDialog}
              type="button"
            >
              {"\u00d7"}
            </button>
          </div>

          <div className="admin-dialog-body space-y-8">
            <label className="field">
              <span>{labels.fieldNameEn}</span>
              <input
                name="nameEn"
                onInput={(e) => (nameEn.value = e.currentTarget.value)}
                placeholder="Outerwear"
                required
                type="text"
                value={nameEn.value}
              />
            </label>
            <label className="field">
              <span>{labels.fieldNameKa}</span>
              <input
                name="nameKa"
                onInput={(e) => (nameKa.value = e.currentTarget.value)}
                placeholder="გარესაცმელი"
                required
                type="text"
                value={nameKa.value}
              />
            </label>
          </div>

          <div className="admin-dialog-footer">
            <button
              className="btn btn-ghost"
              disabled={saving.value}
              onClick={closeDialog}
              type="button"
            >
              {labels.cancel}
            </button>
            <button
              className="btn btn-primary"
              disabled={saving.value}
              type="submit"
            >
              {saving.value ? labels.saving : labels.save}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
