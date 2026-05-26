import { getT } from "@/lib/i18n/server";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, t } = await getT();
  return (
    <>
      <Header locale={locale} t={t} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer locale={locale} t={t} />
    </>
  );
}
