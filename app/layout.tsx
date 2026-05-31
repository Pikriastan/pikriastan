import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { getLocale } from "@/lib/i18n/server";
import { ThemedToaster } from "./_components/themed-toaster";

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

const displayEn = Fraunces({
  variable: "--font-display-en",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

const displayKa = localFont({
  src: "../public/fonts/bpg_banner_supersquare_caps.woff2",
  variable: "--font-display-ka",
  display: "swap",
  weight: "400",
});

const bodyKa = localFont({
  src: "../public/fonts/bpg_glaho.woff2",
  variable: "--font-body-ka",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Amiranas Gamofena \u2014 Atelier",
    template: "%s \u2014 Amiranas Gamofena",
  },
  description:
    "An independent atelier from Tbilisi. Quietly considered garments, soft palettes, numbered runs.",
};

const themeInitScript = `(function(){try{var s=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var t=s==='dark'||s==='light'?s:(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      className={`${sansUi.variable} ${monoUi.variable} ${displayEn.variable} ${displayKa.variable} ${bodyKa.variable} h-full antialiased`}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: theme init must run before paint to avoid FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {children}
        <ThemedToaster />
      </body>
    </html>
  );
}
