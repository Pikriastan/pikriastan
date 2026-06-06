import { useFormAction } from "@/hooks/use-form-action.ts";

export function LogoutButton({ label }: { label: string }) {
  const [_, formProps, isPending] = useFormAction("/admin/logout");

  return (
    <form class="flex items-center" {...formProps}>
      <button
        className="font-mono text-[11px] text-ink uppercase tracking-[0.22em] hover:text-ink/70 disabled:opacity-50"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "\u2026" : label}
      </button>
    </form>
  );
}
