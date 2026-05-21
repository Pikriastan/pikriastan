"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function logout() {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink hover:text-ink/70 disabled:opacity-50"
    >
      {pending ? "\u2026" : label}
    </button>
  );
}
