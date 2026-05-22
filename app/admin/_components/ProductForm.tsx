"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export type ProductFormValues = {
  id?: string;
  slug: string;
  name: { en: string; ka: string };
  description: { en: string; ka: string };
  category: { en: string; ka: string };
  price: number;
  currency: string;
  images: string[];
  featured: boolean;
  published: boolean;
};

export interface ProductFormLabels {
  fieldSlug: string;
  fieldSlugHelp: string;
  fieldNameEn: string;
  fieldNameKa: string;
  fieldDescriptionEn: string;
  fieldDescriptionKa: string;
  fieldCategoryEn: string;
  fieldCategoryKa: string;
  fieldPrice: string;
  fieldCurrency: string;
  fieldFeatured: string;
  fieldPublished: string;
  fieldImages: string;
  uploadImages: string;
  uploading: string;
  save: string;
  saving: string;
  cancel: string;
  saveError: string;
  removeImage: string;
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
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function patch<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
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

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Upload failed (${res.status})`);
        }
        const data = (await res.json()) as { url: string };
        uploaded.push(data.url);
      }
      setValues((v) => ({ ...v, images: [...v.images, ...uploaded] }));
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.saveError);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeImage(idx: number) {
    setValues((v) => ({ ...v, images: v.images.filter((_, i) => i !== idx) }));
  }

  function moveImage(idx: number, dir: -1 | 1) {
    setValues((v) => {
      const next = [...v.images];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return v;
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...v, images: next };
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          slug: values.slug,
          name: values.name,
          description: values.description,
          category: values.category,
          price: Number(values.price),
          currency: values.currency || "GEL",
          images: values.images,
          featured: values.featured,
          published: values.published,
        };
        const url =
          mode === "create"
            ? "/api/admin/products"
            : `/api/admin/products/${initial.id}`;
        const method = mode === "create" ? "POST" : "PUT";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(data.error || labels.saveError);
        }
        router.push("/admin");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : labels.saveError);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-12">
      {error && (
        <div className="border-l-2 border-ink pl-4 py-2 bg-paper-deep">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink">
            {error}
          </p>
        </div>
      )}

      <section className="grid grid-cols-12 gap-x-6 gap-y-6">
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldNameEn}</span>
            <input
              type="text"
              value={values.name.en}
              onChange={(e) => patchName("en", e.target.value)}
              required
              placeholder="Long Wool Overcoat"
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldNameKa}</span>
            <input
              type="text"
              value={values.name.ka}
              onChange={(e) => patchName("ka", e.target.value)}
              required
              placeholder="გრძელი მატყლის პალტო"
            />
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldSlug}</span>
            <input
              type="text"
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                patch("slug", slugify(e.target.value));
              }}
              required
              pattern="^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
              placeholder="long-wool-overcoat"
            />
            <span className="text-[10px] tracking-[0.12em] normal-case text-muted">
              {labels.fieldSlugHelp}
            </span>
          </label>
        </div>

        <div className="col-span-6 md:col-span-3">
          <label className="field">
            <span>{labels.fieldPrice}</span>
            <input
              type="number"
              min="0"
              step="1"
              value={values.price}
              onChange={(e) => patch("price", Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div className="col-span-6 md:col-span-3">
          <label className="field">
            <span>{labels.fieldCurrency}</span>
            <select
              value={values.currency}
              onChange={(e) => patch("currency", e.target.value)}
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
              type="text"
              value={values.category.en}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category: { ...v.category, en: e.target.value },
                }))
              }
              placeholder="Outerwear"
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldCategoryKa}</span>
            <input
              type="text"
              value={values.category.ka}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  category: { ...v.category, ka: e.target.value },
                }))
              }
              placeholder="გარესაცმელი"
            />
          </label>
        </div>

        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldDescriptionEn}</span>
            <textarea
              rows={6}
              value={values.description.en}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  description: { ...v.description, en: e.target.value },
                }))
              }
              placeholder="Patterned and cut in Tbilisi. Heavy wool, raw selvedge edges, hand-finished buttonholes."
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-6">
          <label className="field">
            <span>{labels.fieldDescriptionKa}</span>
            <textarea
              rows={6}
              value={values.description.ka}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  description: { ...v.description, ka: e.target.value },
                }))
              }
              placeholder="ნიმუში მოჭრილია თბილისში. მძიმე მატყლი, ნედლი კიდეები, ხელით დასრულებული ღილკილოები."
            />
          </label>
        </div>
      </section>

      <section className="border-t hairline pt-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
            {`${labels.fieldImages}${values.images.length > 0 ? ` \u2014 ${values.images.length}` : ""}`}
          </h3>
          <label className="btn btn-ghost cursor-pointer">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
            {uploading ? labels.uploading : `+ ${labels.uploadImages}`}
          </label>
        </div>

        {values.images.length === 0 ? (
          <div className="border hairline border-dashed py-20 grid place-items-center text-center text-muted font-mono text-[11px] uppercase tracking-[0.24em]">
            {labels.uploadImages}
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {values.images.map((src, i) => (
              <li key={src + i} className="group relative">
                <div className="relative aspect-[4/5] bg-paper-deep overflow-hidden">
                  <Image
                    src={src}
                    alt={`image ${i + 1}`}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 font-mono text-[10px] uppercase tracking-[0.22em] bg-paper/85 px-1 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="px-1.5 py-0.5 border hairline-strong text-ink disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === values.images.length - 1}
                      className="px-1.5 py-0.5 border hairline-strong text-ink disabled:opacity-30"
                      aria-label="Move down"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                  >
                    {labels.removeImage}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t hairline pt-10 flex flex-col gap-4 sm:flex-row sm:gap-10">
        <label className="flex items-start gap-3 cursor-pointer max-w-sm">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => patch("featured", e.target.checked)}
            className="mt-1 w-auto"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {labels.fieldFeatured}
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer max-w-sm">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => patch("published", e.target.checked)}
            className="mt-1 w-auto"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
            {labels.fieldPublished}
          </span>
        </label>
      </section>

      <div className="border-t hairline pt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="btn btn-ghost"
          disabled={pending}
        >
          {labels.cancel}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={pending || uploading}
        >
          {pending ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}
