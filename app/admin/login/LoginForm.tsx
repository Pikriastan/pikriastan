"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm({
  labels,
}: {
  labels: { password: string; submit: string; error: string };
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (!res.ok) {
          setError(labels.error);
          return;
        }
        router.push("/admin");
        router.refresh();
      } catch {
        setError(labels.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="field">
        <span>{labels.password}</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
      </label>
      {error && (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/90 border-l-2 border-ink pl-3 py-1">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={pending || password.length === 0}
      >
        {pending ? "\u2026" : labels.submit}
      </button>
    </form>
  );
}
