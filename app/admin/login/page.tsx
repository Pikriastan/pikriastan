import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getT } from "@/lib/i18n/server";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
	if (await isAuthenticated()) {
		redirect("/admin");
	}
	const { locale, t } = await getT();
	const displayClass = locale === "ka" ? "font-display-ka" : "font-display";

	return (
		<div className="min-h-screen flex flex-col bg-paper">
			<header className="border-b hairline">
				<div className="mx-auto max-w-[1400px] px-6 md:px-12 py-5 md:py-6 flex items-center justify-between">
					<Link
						href="/"
						className={`${displayClass} lowercase text-xl md:text-2xl tracking-tight leading-none`}
					>
						{locale === "ka" ? "ამირანას" : "amiranas"}
						<span className="ml-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted align-middle">
							{" / admin"}
						</span>
					</Link>
					<Link
						href="/"
						className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted hover:text-ink"
					>
						{`\u2190 ${locale === "ka" ? "უკან" : "Back"}`}
					</Link>
				</div>
			</header>

			<main className="flex-1 grid place-items-center px-6 md:px-12 py-20">
				<div className="w-full max-w-sm">
					<p className="eyebrow mb-6">{`/ ${locale === "ka" ? "შესვლა" : "Access"}`}</p>
					<h1
						className={`${displayClass} leading-none tracking-tight text-5xl md:text-6xl lowercase`}
					>
						{t.admin.loginTitle}
					</h1>
					<p className="mt-3 text-[15px] text-muted">
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
			</main>
		</div>
	);
}
