import { Toaster } from "@/islands/toast.tsx";
import { define } from "@/lib/utils.ts";

export default define.page(function App({ Component, state }) {
  return (
    <html data-theme={state.theme} lang={state.locale}>
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pikriastan.ge" />
        <meta property="og:title" content="Pikriastan" />
        <meta
          property="og:description"
          content="An independent garment studio in Tbilisi. Considered cuts, raw textures, and finite series a quiet refusal of trend."
        />
        <meta
          property="og:image"
          content="https://pikriastan.ge/images/og-eng.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <title>Pikriastan</title>
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/InterVariable.woff2"
          rel="preload"
          type="font/woff2"
        />
        {state.locale === "ka" ? (
          <>
            <link
              as="font"
              crossOrigin="anonymous"
              href="/fonts/bpg_banner_supersquare_caps.woff2"
              rel="preload"
              type="font/woff2"
            />
            <link
              as="font"
              crossOrigin="anonymous"
              href="/fonts/bpg_glaho.woff2"
              rel="preload"
              type="font/woff2"
            />
          </>
        ) : (
          <link
            as="font"
            crossOrigin="anonymous"
            href="/fonts/Fraunces-Variable.woff2"
            rel="preload"
            type="font/woff2"
          />
        )}
      </head>
      <body className="overflow-x-clip" lang={state.locale}>
        <Component />
        <Toaster />
      </body>
    </html>
  );
});
