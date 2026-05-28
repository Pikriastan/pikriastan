"use client";

import { createAuthClient } from "better-auth/client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { type LoginActionState, login } from "./actions";

interface LoginFormProps {
  labels: {
    email: string;
    password: string;
    submit: string;
    error: string;
  };
}

export function LoginForm({ labels }: LoginFormProps) {
  const router = useRouter();
  const { updateSession } = createAuthClient();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: router is stable ref
  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials.");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      updateSession();
      router.refresh();
    }
  }, [state.status]);

  return (
    <form action={formAction} className="space-y-5">
      <label className="field">
        <span>{labels.email}</span>
        <input
          autoComplete="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          value={email}
        />
      </label>
      <label className="field">
        <span>{labels.password}</span>
        <input
          autoComplete="current-password"
          name="password"
          required
          type="password"
        />
      </label>
      <button
        className="btn btn-primary w-full"
        disabled={isSuccessful}
        type="submit"
      >
        {isSuccessful ? "\u2026" : labels.submit}
      </button>
    </form>
  );
}
