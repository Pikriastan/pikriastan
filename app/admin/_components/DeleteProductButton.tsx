"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeleteProductButton({
  id,
  label,
  confirmLabel,
}: {
  id: string;
  label: string;
  confirmLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick() {
    if (!confirm(confirmLabel)) return;
    startTransition(async () => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/80 hover:text-ink underline underline-offset-4 decoration-line-strong hover:decoration-ink disabled:opacity-40"
    >
      {pending ? "\u2026" : label}
    </button>
  );
}
