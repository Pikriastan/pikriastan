"use client";

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { mutate } from "swr";
import { useActionStatus } from "@/hooks/use-action-status";
import type { BaseActionState } from "@/lib/action";
import { deleteProductAction } from "../products/actions";

export function DeleteProductButton({
  id,
  label,
  confirmLabel,
}: {
  id: string;
  label: string;
  confirmLabel: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const [state, formAction, pending] = useActionState<
    BaseActionState,
    FormData
  >(deleteProductAction, { status: "idle" });

  useActionStatus(state, () => {
    setConfirming(false);
    router.refresh();
    mutate("/api/products");
  });

  let buttonLabel = label;
  if (confirming) {
    buttonLabel = confirmLabel;
  }
  if (pending) {
    buttonLabel = "\u2026";
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!confirming) {
      event.preventDefault();
      setConfirming(true);
    }
  }

  return (
    <form action={formAction} className="contents">
      <input name="id" type="hidden" value={id} />
      <button
        className="link-static border-0 bg-transparent p-0 font-mono text-[11px] text-ink/80 uppercase leading-none tracking-[0.22em] decoration-line-strong hover:text-accent-strong disabled:opacity-40"
        disabled={pending}
        onClick={onClick}
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
