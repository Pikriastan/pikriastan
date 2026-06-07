import { define } from "@/lib/utils.ts";

export default define.page(function App({ Component, state }) {
  return (
    <html data-theme={state.theme} lang={state.locale}>
      <head>
        <meta charset="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Pikriastan</title>
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/InterVariable.woff2"
          rel="preload"
          type="font/woff2"
        />
        {state.locale === "ka"
          ? (
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
          )
          : (
            <link
              as="font"
              crossOrigin="anonymous"
              href="/fonts/Fraunces-Variable.woff2"
              rel="preload"
              type="font/woff2"
            />
          )}
      </head>
      <body lang={state.locale}>
        <Component />
      </body>
    </html>
  );
});
