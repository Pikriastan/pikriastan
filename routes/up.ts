import { define } from "@/lib/utils.ts";

export const handler = define.handlers({
  GET() {
    return new Response("ok\n", {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
});
