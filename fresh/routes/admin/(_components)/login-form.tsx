interface LoginFormProps {
  error: string | undefined;
  labels: {
    email: string;
    password: string;
    submit: string;
    error: string;
  };
}

export function LoginForm({ labels, error }: LoginFormProps) {
  return (
    <form className="space-y-5" method="POST">
      <label className="field">
        <span>{labels.email}</span>
        <input autoComplete="email" name="email" required type="email" />
        {error && <p class="mt-2 text-red-500">{error}</p>}
      </label>
      <label className="field">
        <span>{labels.password}</span>
        <input
          autoComplete="current-password"
          name="password"
          required
          type="password"
        />
        {error && <p class="mt-2 text-red-500">{error}</p>}
      </label>
      <button className="btn btn-primary w-full" type="submit">
        {labels.submit}
      </button>
    </form>
  );
}
