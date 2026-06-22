import { page } from "fresh";
import {
  createSession,
  setSessionCookie,
  verifyUserCredentials,
} from "@/lib/auth.ts";
import { getT } from "@/lib/i18n/locales.ts";
import { define } from "@/lib/utils.ts";
import { LoginForm } from "@/routes/admin/(_components)/login-form.tsx";

export default define.page<typeof handler>(function LoginPage({ state, data }) {
  const { t } = getT(state.locale);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="hairline border-b">
        <div className="mx-auto flex max-w-350 items-center justify-between gap-3 px-5 py-5 sm:px-6 md:px-12 md:py-6">
          <a
            className="min-w-0 truncate font-display text-xl lowercase leading-none tracking-tight md:text-2xl"
            href="/"
          >
            Pikriastan
            <span className="ml-2 align-middle font-mono text-[10px] text-muted uppercase tracking-[0.32em]">
              {" / admin"}
            </span>
          </a>
          <a
            className="shrink-0 font-mono text-[10px] text-muted uppercase tracking-[0.28em] hover:text-ink"
            href="/"
          >
            {`\u2190 ${state.locale === "ka" ? "უკან" : "Back"}`}
          </a>
        </div>
      </header>

      <main className="grid flex-1 place-items-center px-5 py-20 sm:px-6 md:px-12">
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-6">
            {`/ ${state.locale === "ka" ? "შესვლა" : "Access"}`}
          </p>
          <h1 className="font-display text-5xl lowercase leading-none tracking-tight md:text-6xl">
            {t.admin.loginTitle}
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            {state.locale === "ka"
              ? "შეიყვანე ადმინისტრატორის მონაცემები."
              : "Enter the studio credentials to continue."}
          </p>
          <div className="mt-10">
            <LoginForm
              error={data.error}
              labels={{
                email: t.admin.emailLabel,
                password: t.admin.passwordLabel,
                submit: t.admin.loginButton,
                error: t.admin.loginError,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
});

export const handler = define.handlers({
  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const user = await verifyUserCredentials({ email, password });
    if (!user) {
      return page(
        { error: "Invalid credentials" },
        {
          status: 422,
        },
      );
    }

    const headers = new Headers({ location: "/admin" });
    setSessionCookie(headers, await createSession(user.id));

    return new Response(null, { headers, status: 303 });
  },
});
