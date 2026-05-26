"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function DeleteProductButton({
  id,
  label,
  confirmLabel,
}: {
  id: string;
  label: string;
  confirmLabel: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  let buttonLabel = label;
  if (confirming) {
    buttonLabel = confirmLabel;
  }
  if (pending) {
    buttonLabel = "\u2026";
  }

  function onClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        setConfirming(false);
        toast.error("Failed to delete.");
      }
    });
  }

  return (
    <button
      className="link-static font-mono text-[11px] text-ink/80 uppercase tracking-[0.22em] decoration-line-strong hover:text-accent-strong disabled:opacity-40"
      disabled={pending}
      onClick={onClick}
      type="button"
    >
      {buttonLabel}
    </button>
  );
}
