export function LogoutButton({ label }: { label: string }) {
  return (
    <form action="/logout" class="flex items-center" method="POST">
      <button
        className="font-mono text-[11px] text-ink uppercase tracking-[0.22em] hover:text-ink/70 disabled:opacity-50"
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
