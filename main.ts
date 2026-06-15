import type { State } from "@/lib/utils.ts";
import { App, staticFiles } from "fresh";

const FONT_CACHE_CONTROL = "public, max-age=31536000, immutable";

export const app = new App<State>()
  .use(async (ctx) => {
    const response = await ctx.next();

    if (ctx.url.pathname.startsWith("/fonts/")) {
      response.headers.set("Cache-Control", FONT_CACHE_CONTROL);
    }

    return response;
  })
  .use(staticFiles())
  .fsRoutes();
