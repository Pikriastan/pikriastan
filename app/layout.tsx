import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Anton, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/server";

const sansUi = Inter({
  variable: "--font-sans-ui",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const monoUi = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  display: "swap",
});

const displayEn = Anton({
  variable: "--font-display-en",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const displayKa = Noto_Sans_Georgian({
  variable: "--font-display-ka",
  subsets: ["georgian"],
  weight: ["400", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Amiranas Gamofena \u2014 Studio",
    template: "%s \u2014 Amiranas Gamofena",
  },
  description:
    "An independent garment studio from Tbilisi. Considered cuts, raw textures, numbered runs.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${sansUi.variable} ${monoUi.variable} ${displayEn.variable} ${displayKa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
