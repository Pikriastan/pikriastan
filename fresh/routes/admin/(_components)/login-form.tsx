interface LoginFormProps {
  labels: {
    email: string;
    password: string;
    submit: string;
    error: string;
  };
}

export function LoginForm({ labels }: LoginFormProps) {
  return (
    <form className="space-y-5" method="post">
      <label className="field">
        <span>{labels.email}</span>
        <input autoComplete="email" name="email" required type="email" />
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
      <button className="btn btn-primary w-full" type="submit">
        {labels.submit}
      </button>
    </form>
  );
}
