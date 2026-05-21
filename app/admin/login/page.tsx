import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getT } from "@/lib/i18n/server";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }
  const { locale, t } = await getT();
  const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-paper">
      <div className="hidden md:flex relative bg-ink text-paper p-12 flex-col justify-between overflow-hidden">
        <div>
          <Link
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/70 hover:text-paper"
          >
            {"\u2190 "} {locale === "ka" ? "უკან" : "Back to site"}
          </Link>
        </div>
        <div>
          <div
            className={`${displayClass} uppercase leading-[0.9] tracking-tight text-paper text-7xl lg:text-8xl`}
          >
            {locale === "ka" ? "სტუდია" : "Studio"}
          </div>
          <p className="mt-6 text-paper/70 max-w-sm">
            {locale === "ka"
              ? "მართე კოლექცია. ატვირთე ახალი ნაკეთობები."
              : "Curate the archive. Upload new pieces. Publish quietly."}
          </p>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-paper/50">
          {"Amiranas \u00b7 Gamofena \u00b7 Admin"}
        </div>
      </div>
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-sm">
          <p className="eyebrow mb-6">/ {locale === "ka" ? "შესვლა" : "Access"}</p>
          <h1
            className={`${displayClass} uppercase leading-none tracking-tight text-5xl md:text-6xl`}
          >
            {t.admin.loginTitle}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {locale === "ka"
              ? "შეიყვანე ადმინისტრატორის პაროლი."
              : "Enter the studio password to continue."}
          </p>
          <div className="mt-10">
            <LoginForm
              labels={{
                password: t.admin.passwordLabel,
                submit: t.admin.loginButton,
                error: t.admin.loginError,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
