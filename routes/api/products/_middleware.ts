import { define } from "@/lib/utils.ts";

export default define.middleware((ctx) => {
  if (!ctx.state.user) {
    return ctx.json({ error: "Unaothorized" }, { status: 401 });
  }

  return ctx.next();
});
