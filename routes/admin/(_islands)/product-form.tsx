import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import type { ProductImageWithUrl } from "@/lib/db/types.ts";
import { useFormAction } from "@/hooks/use-form-action.ts";
import { toast } from "@/lib/toast.ts";

interface PendingFile {
  file: File;
  id: string;
  previewUrl: string;
}

export interface ProductFormValues {
  category: { en: string; ka: string };
  currency: string;
  description: { en: string; ka: string };
  featured: boolean;
  id?: string;
  images: ProductImageWithUrl[];
  name: { en: string; ka: string };
  price: number;
  published: boolean;
  slug: string;
}

export interface ProductFormLabels {
  cancel: string;
  fieldCategoryEn: string;
  fieldCategoryKa: string;
  fieldCurrency: string;
  fieldDescriptionEn: string;
  fieldDescriptionKa: string;
  fieldFeatured: string;
  fieldImages: string;
  fieldNameEn: string;
  fieldNameKa: string;
  fieldPrice: string;
  fieldPublished: string;
  fieldSlug: string;
  fieldSlugHelp: string;
  removeImage: string;
  save: string;
  saveError: string;
  saving: string;
  uploadImages: string;
  uploading: string;
}

interface ProductFormProps {
  initial: ProductFormValues;
  labels: ProductFormLabels;
  mode: "create" | "edit";
  error?: unknown;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function ProductForm(
  { initial, labels, error, mode }: ProductFormProps,
) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const values = useSignal<ProductFormValues>(initial);
  const customError = useSignal<string | null>(null);
  const pendingFiles = useSignal<PendingFile[]>([]);
  const slugTouched = useSignal(mode === "edit");

  const [_, formProps, isPending] = useFormAction(
    mode === "create" ? "/api/products" : `/api/products/${initial.id}`,
    {
      submitFunc: (formData) => {
        for (const pendingFile of pendingFiles.value) {
          formData.append("images", pendingFile.file);
        }
        for (const image of values.value.images) {
          formData.append("existingImageIds", image.id);
        }
        formData.append("featured", String(values.value.featured));
        formData.append("published", String(values.value.published));
      },
      onError: (message) => {
        toast.error(labels.saveError, { description: message });
      },
    },
  );

  function patch<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    values.value = { ...values.value, [key]: value };
  }

  function patchName(lang: "en" | "ka", value: string) {
    const next = {
      ...values.value,
      name: { ...values.value.name, [lang]: value },
    };
    if (!slugTouched.value && lang === "en" && mode === "create") {
      next.slug = slugify(value);
    }
    values.value = next;
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }
    customError.value = null;
    const next: PendingFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${
        Math.random()
          .toString(36)
          .slice(2, 8)
      }-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    pendingFiles.value = [...pendingFiles.value, ...next];
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function removePending(id: string) {
    const item = pendingFiles.value.find((p) => p.id === id);
    if (item) {
      URL.revokeObjectURL(item.previewUrl);
    }
    pendingFiles.value = pendingFiles.value.filter((p) => p.id !== id);
  }

  function removeImage(idx: number) {
    values.value = {
      ...values.value,
      images: values.value.images.filter(
        (_, i) => i !== idx,
      ) as typeof values.value.images,
    };
  }

  function moveImage(idx: number, dir: -1 | 1) {
    const next = [...values.value.images];
    const target = idx + dir;
    if (target < 0 || target >= next.length) {
      return;
    }
    [next[idx], next[target]] = [next[target], next[idx]];
    return { ...values.value, images: next as typeof values.value.images };
  }

  return (
    <form className="space-y-12" {...formProps}>
      {error && (
        <div className="border-ink border-l-2 bg-paper-deep py-2 pl-4">
          <p className="font-mono text-ink text-xs uppercase tracking-[0.18em]">
            {error}
          </p>
        </div>
      )}

      <section className="grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldNameEn}</span>
            <input
              name="nameEn"
              onChange={(e) => patchName("en", e.currentTarget.value)}
              placeholder="Long Wool Overcoat"
              required
              type="text"
              value={values.value.name.en}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldNameKa}</span>
            <input
              name="nameKa"
              onChange={(e) => patchName("ka", e.currentTarget.value)}
              placeholder="გრძელი მატყლის პალტო"
              required
              type="text"
              value={values.value.name.ka}
            />
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldSlug}</span>
            <input
              name="slug"
              onChange={(e) => {
                slugTouched.value = true;
                patch("slug", slugify(e.currentTarget.value));
              }}
              pattern="^[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$"
              placeholder="long-wool-overcoat"
              required
              type="text"
              value={values.value.slug}
            />
            <span className="text-[10px] text-muted normal-case tracking-[0.12em]">
              {labels.fieldSlugHelp}
            </span>
          </label>
        </div>

        <div className="col-span-6 md:col-span-3">
          <label className="field">
            <span>{labels.fieldPrice}</span>
            <input
              min="0"
              name="price"
              onChange={(e) => patch("price", Number(e.currentTarget.value))}
              required
              step="1"
              type="number"
              value={values.value.price}
            />
          </label>
        </div>
        <div className="col-span-6 md:col-span-3">
          <label className="field">
            <span>{labels.fieldCurrency}</span>
            <select
              name="currency"
              onChange={(e) => patch("currency", e.currentTarget.value)}
              value={values.value.currency}
            >
              <option value="GEL">GEL ₾</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
            </select>
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldCategoryEn}</span>
            <input
              name="categoryEn"
              onChange={(e) => (values.value = {
                ...values.value,
                category: {
                  ...values.value.category,
                  en: e.currentTarget.value,
                },
              })}
              placeholder="Outerwear"
              type="text"
              value={values.value.category.en}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldCategoryKa}</span>
            <input
              name="categoryKa"
              onChange={(e) => (values.value = {
                ...values.value,
                category: {
                  ...values.value.category,
                  ka: e.currentTarget.value,
                },
              })}
              placeholder="გარესაცმელი"
              type="text"
              value={values.value.category.ka}
            />
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldDescriptionEn}</span>
            <textarea
              name="descriptionEn"
              onChange={(e) => (values.value = {
                ...values.value,
                description: {
                  ...values.value.description,
                  en: e.currentTarget.value,
                },
              })}
              placeholder="Patterned and cut in Tbilisi. Heavy wool, raw selvedge edges, hand-finished buttonholes."
              rows={6}
              value={values.value.description.en}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldDescriptionKa}</span>
            <textarea
              name="descriptionKa"
              onChange={(e) => (values.value = {
                ...values.value,
                description: {
                  ...values.value.description,
                  ka: e.currentTarget.value,
                },
              })}
              placeholder="ნიმუში მოჭრილია თბილისში. მძიმე მატყლი, ნედლი კიდეები, ხელით დასრულებული ღილკილოები."
              rows={6}
              value={values.value.description.ka}
            />
          </label>
        </div>
      </section>

      <section className="hairline border-t pt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
            {`${labels.fieldImages}${
              values.value.images.length + pendingFiles.value.length > 0
                ? ` \u2014 ${
                  values.value.images.length + pendingFiles.value.length
                }`
                : ""
            }`}
          </h3>
          <label className="btn btn-ghost cursor-pointer">
            <input
              accept="image/*"
              hidden
              multiple
              onChange={(e) => handleFiles(e.currentTarget.files)}
              ref={fileRef}
              type="file"
            />
            {`+ ${labels.uploadImages}`}
          </label>
        </div>
        {values.value.images.length === 0 && pendingFiles.value.length === 0
          ? (
            <div className="hairline grid place-items-center border border-dashed py-20 text-center font-mono text-[11px] text-muted uppercase tracking-[0.24em]">
              {labels.uploadImages}
            </div>
          )
          : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {values.value.images.map((src, i) => (
                <li className="group relative" key={src.id}>
                  <div className="relative aspect-4/5 overflow-hidden bg-paper-deep">
                    <img
                      alt={`product-icon ${i + 1}`}
                      className="object-cover"
                      sizes="220px"
                      src={src.url}
                    />
                    <div className="absolute top-1.5 left-1.5 bg-paper/85 px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em]">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                    <div className="flex items-center gap-1">
                      <button
                        aria-label="Move up"
                        className="hairline-strong border px-1.5 py-0.5 text-ink disabled:opacity-30"
                        disabled={i === 0}
                        onClick={() =>
                          moveImage(i, -1)}
                        type="button"
                      >
                        ←
                      </button>
                      <button
                        aria-label="Move down"
                        className="hairline-strong border px-1.5 py-0.5 text-ink disabled:opacity-30"
                        disabled={i === values.value.images.length - 1}
                        onClick={() =>
                          moveImage(i, 1)}
                        type="button"
                      >
                        →
                      </button>
                    </div>
                    <button
                      className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                      onClick={() => removeImage(i)}
                      type="button"
                    >
                      {labels.removeImage}
                    </button>
                  </div>
                </li>
              ))}
              {pendingFiles.value.map((p) => (
                <li className="group relative" key={p.id}>
                  <div className="relative aspect-4/5 overflow-hidden bg-paper-deep">
                    <img
                      alt={p.file.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      height={500}
                      src={p.previewUrl}
                      width={400}
                    />
                    <div className="absolute top-1.5 left-1.5 bg-paper/85 px-1 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em]">
                      {"pending"}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                    <button
                      className="underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                      onClick={() =>
                        removePending(p.id)}
                      type="button"
                    >
                      {labels.removeImage}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </section>

      <section className="hairline flex flex-col gap-4 border-t pt-10 sm:flex-row sm:gap-10">
        <label className="flex max-w-sm cursor-pointer items-start gap-3">
          <input
            checked={values.value.featured}
            className="mt-1 w-auto"
            onChange={(e) => patch("featured", e.currentTarget.checked)}
            type="checkbox"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {labels.fieldFeatured}
          </span>
        </label>
        <label className="flex max-w-sm cursor-pointer items-start gap-3">
          <input
            checked={values.value.published}
            className="mt-1 w-auto"
            onChange={(e) => patch("published", e.currentTarget.checked)}
            type="checkbox"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {labels.fieldPublished}
          </span>
        </label>
      </section>

      <div className="hairline flex flex-col-reverse gap-3 border-t pt-8 sm:flex-row sm:justify-end">
        <button
          className="btn btn-ghost"
          disabled={isPending}
          onClick={() => (globalThis.location.href = "/admin")}
          type="button"
        >
          {labels.cancel}
        </button>
        <button
          className="btn btn-primary"
          disabled={isPending}
          type="submit"
        >
          {isPending ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}
