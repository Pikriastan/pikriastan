import { useSignal } from "@preact/signals";
import { useFormAction } from "@/hooks/use-form-action.ts";
import { toast } from "@/lib/toast.ts";

export function DeleteProductButton({
  id,
  label,
  confirmLabel,
}: {
  id: string;
  label: string;
  confirmLabel: string;
}) {
  const confirming = useSignal(false);

  const [_, formProps, isPending] = useFormAction(`/api/products/${id}`, {
    onSuccess: () => globalThis.location.reload(),
    onError: (message) => toast.error(message),
  });

  let buttonLabel = label;
  if (confirming) {
    buttonLabel = confirmLabel;
  }
  if (isPending) {
    buttonLabel = "\u2026";
  }

  function onClick(event: MouseEvent) {
    if (!confirming.value) {
      event.preventDefault();
      confirming.value = true;
    }
  }

  return (
    <form className="contents" {...formProps}>
      <input name="id" type="hidden" value={id} />
      <button
        className="link-static border-0 bg-transparent p-0 font-mono text-[11px] text-ink/80 uppercase leading-none tracking-[0.22em] decoration-line-strong hover:text-accent-strong disabled:opacity-40"
        onClick={onClick}
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
