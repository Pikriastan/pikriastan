import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { getT } from "@/lib/i18n/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, t } = await getT();
  return (
    <>
      <Header locale={locale} t={t} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer locale={locale} t={t} />
    </>
  );
}
