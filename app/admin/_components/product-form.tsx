"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useRef, useState } from "react";
import { useActionStatus } from "@/hooks/use-action-status";
import type { BaseActionState } from "@/lib/action";
import { createProductAction } from "../products/actions";

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
  images: string[];
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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function ProductForm({
  initial,
  labels,
  mode,
}: {
  initial: ProductFormValues;
  labels: ProductFormLabels;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial);
  const [error, setError] = useState<string | null>(null);
  const [uploading, _setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const [state, formAction, pending] = useActionState<
    BaseActionState,
    FormData
  >(createProductAction, { status: "idle" });

  useActionStatus(state, () => {
    router.push("/admin");
    router.refresh();
  });

  function patch<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function patchName(lang: "en" | "ka", value: string) {
    setValues((v) => {
      const next = { ...v, name: { ...v.name, [lang]: value } };
      if (!slugTouched && lang === "en" && mode === "create") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }
    setError(null);
    const next: PendingFile[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPendingFiles((prev) => [...prev, ...next]);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  }

  function removePending(id: string) {
    setPendingFiles((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  }

  function removeImage(idx: number) {
    setValues((v) => ({ ...v, images: v.images.filter((_, i) => i !== idx) }));
  }

  function moveImage(idx: number, dir: -1 | 1) {
    setValues((v) => {
      const next = [...v.images];
      const target = idx + dir;
      if (target < 0 || target >= next.length) {
        return v;
      }
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...v, images: next };
    });
  }

  function newOnSubmit(formData: FormData) {
    for (const pendingFile of pendingFiles) {
      formData.append("images", pendingFile.file);
    }
    formData.append("featured", String(values.featured));
    formData.append("published", String(values.published));
    formAction(formData);
  }

  // function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setError(null);
  //   startTransition(async () => {
  //     try {
  //       const payload = {
  //         slug: values.slug,
  //         name: values.name,
  //         description: values.description,
  //         category: values.category,
  //         price: Number(values.price),
  //         currency: values.currency || "GEL",
  //         images: values.images,
  //         featured: values.featured,
  //         published: values.published,
  //       };
  //       const url =
  //         mode === "create"
  //           ? "/api/admin/products"
  //           : `/api/admin/products/${initial.id}`;
  //       const method = mode === "create" ? "POST" : "PUT";
  //       const res = await fetch(url, {
  //         method,
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(payload),
  //       });
  //       if (!res.ok) {
  //         const data = (await res.json().catch(() => ({}))) as {
  //           error?: string;
  //         };
  //         throw new Error(data.error || labels.saveError);
  //       }
  //       router.push("/admin");
  //       router.refresh();
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : labels.saveError);
  //     }
  //   });
  // }

  return (
    <form action={newOnSubmit} className="space-y-12">
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
              onChange={(e) => patchName("en", e.target.value)}
              placeholder="Long Wool Overcoat"
              required
              type="text"
              value={values.name.en}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldNameKa}</span>
            <input
              name="nameKa"
              onChange={(e) => patchName("ka", e.target.value)}
              placeholder="გრძელი მატყლის პალტო"
              required
              type="text"
              value={values.name.ka}
            />
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldSlug}</span>
            <input
              name="slug"
              onChange={(e) => {
                setSlugTouched(true);
                patch("slug", slugify(e.target.value));
              }}
              pattern="^[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$"
              placeholder="long-wool-overcoat"
              required
              type="text"
              value={values.slug}
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
              onChange={(e) => patch("price", Number(e.target.value))}
              required
              step="1"
              type="number"
              value={values.price}
            />
          </label>
        </div>
        <div className="col-span-6 md:col-span-3">
          <label className="field">
            <span>{labels.fieldCurrency}</span>
            <select
              name="currency"
              onChange={(e) => patch("currency", e.target.value)}
              value={values.currency}
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
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category: { ...v.category, en: e.target.value },
                }))
              }
              placeholder="Outerwear"
              type="text"
              value={values.category.en}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldCategoryKa}</span>
            <input
              name="categoryKa"
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category: { ...v.category, ka: e.target.value },
                }))
              }
              placeholder="გარესაცმელი"
              type="text"
              value={values.category.ka}
            />
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldDescriptionEn}</span>
            <textarea
              name="descriptionEn"
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  description: { ...v.description, en: e.target.value },
                }))
              }
              placeholder="Patterned and cut in Tbilisi. Heavy wool, raw selvedge edges, hand-finished buttonholes."
              rows={6}
              value={values.description.en}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldDescriptionKa}</span>
            <textarea
              name="descriptionKa"
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  description: { ...v.description, ka: e.target.value },
                }))
              }
              placeholder="ნიმუში მოჭრილია თბილისში. მძიმე მატყლი, ნედლი კიდეები, ხელით დასრულებული ღილკილოები."
              rows={6}
              value={values.description.ka}
            />
          </label>
        </div>
      </section>

      <section className="hairline border-t pt-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-mono text-[11px] text-muted uppercase tracking-[0.28em]">
            {`${labels.fieldImages}${
              values.images.length + pendingFiles.length > 0
                ? ` \u2014 ${values.images.length + pendingFiles.length}`
                : ""
            }`}
          </h3>
          <label className="btn btn-ghost cursor-pointer">
            <input
              accept="image/*"
              disabled={uploading}
              hidden
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              ref={fileRef}
              type="file"
            />
            {uploading ? labels.uploading : `+ ${labels.uploadImages}`}
          </label>
        </div>

        {values.images.length === 0 && pendingFiles.length === 0 ? (
          <div className="hairline grid place-items-center border border-dashed py-20 text-center font-mono text-[11px] text-muted uppercase tracking-[0.24em]">
            {labels.uploadImages}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {values.images.map((src, i) => (
              <li className="group relative" key={src}>
                <div className="relative aspect-4/5 overflow-hidden bg-paper-deep">
                  <Image
                    alt={`image ${i + 1}`}
                    className="object-cover"
                    fill
                    sizes="220px"
                    src={src}
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
                      onClick={() => moveImage(i, -1)}
                      type="button"
                    >
                      ←
                    </button>
                    <button
                      aria-label="Move down"
                      className="hairline-strong border px-1.5 py-0.5 text-ink disabled:opacity-30"
                      disabled={i === values.images.length - 1}
                      onClick={() => moveImage(i, 1)}
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
            {pendingFiles.map((p) => (
              <li className="group relative" key={p.id}>
                <div className="relative aspect-4/5 overflow-hidden bg-paper-deep">
                  {/* biome-ignore lint/performance/noImgElement: blob previews aren't served by next/image */}
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
                    onClick={() => removePending(p.id)}
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
            checked={values.featured}
            className="mt-1 w-auto"
            onChange={(e) => patch("featured", e.target.checked)}
            type="checkbox"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {labels.fieldFeatured}
          </span>
        </label>
        <label className="flex max-w-sm cursor-pointer items-start gap-3">
          <input
            checked={values.published}
            className="mt-1 w-auto"
            onChange={(e) => patch("published", e.target.checked)}
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
          disabled={pending}
          onClick={() => router.push("/admin")}
          type="button"
        >
          {labels.cancel}
        </button>
        <button
          className="btn btn-primary"
          disabled={pending || uploading}
          type="submit"
        >
          {pending ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}
