interface ProductFormProps {
  error: string | undefined;
}

export function ProductForm({ error }: ProductFormProps) {
  return (
    <form className="space-y-12">
      {error && (
        <div className="border-ink border-l-2 bg-paper-deep py-2 pl-4">
          <p className="font-mono text-ink text-xs uppercase tracking-[0.18em]">
            {error}
          </p>
        </div>
      )}

      <div className="hairline flex flex-col-reverse gap-3 border-t pt-8 sm:flex-row sm:justify-end">
        <button
          className="btn btn-ghost"
          // disabled={pending}
          // onClick={() => router.push("/admin")}
          type="button"
        >
          {/*{labels.cancel}*/}
        </button>
        <button
          className="btn btn-primary"
          // disabled={pending || uploading}
          type="submit"
        >
          {/*{pending ? labels.saving : labels.save}*/}
        </button>
      </div>
    </form>
  );
}
