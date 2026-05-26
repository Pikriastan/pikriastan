import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="hairline border-b">
        <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-5 md:px-12 md:py-6">
          <Link
            className={`${displayClass} text-xl lowercase leading-none tracking-tight md:text-2xl`}
            href="/"
          >
            {locale === "ka" ? "ამირანას" : "amiranas"}
            <span className="ml-2 align-middle font-mono text-[10px] text-muted uppercase tracking-[0.32em]">
              {" / admin"}
            </span>
          </Link>
          <Link
            className="font-mono text-[10px] text-muted uppercase tracking-[0.28em] hover:text-ink"
            href="/"
          >
            {`\u2190 ${locale === "ka" ? "უკან" : "Back"}`}
          </Link>
        </div>
      </header>

      <main className="grid flex-1 place-items-center px-6 py-20 md:px-12">
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-6">{`/ ${locale === "ka" ? "შესვლა" : "Access"}`}</p>
          <h1
            className={`${displayClass} text-5xl lowercase leading-none tracking-tight md:text-6xl`}
          >
            {t.admin.loginTitle}
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            {locale === "ka"
              ? "შეიყვანე ადმინისტრატორის მონაცემები."
              : "Enter the studio credentials to continue."}
          </p>
          <div className="mt-10">
            <LoginForm
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
}
