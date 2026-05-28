"use client";

import { createAuthClient } from "better-auth/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton({ label }: { label: string }) {
  const [pending, startTransition] = useTransition();
  const { signOut } = createAuthClient();
  const router = useRouter();

  function logout() {
    startTransition(async () => {
      await signOut();
      router.refresh();
    });
  }

  return (
    <button
      className="font-mono text-[11px] text-ink uppercase tracking-[0.22em] hover:text-ink/70 disabled:opacity-50"
      disabled={pending}
      onClick={logout}
      type="button"
    >
      {pending ? "\u2026" : label}
    </button>
  );
}
