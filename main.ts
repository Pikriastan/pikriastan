import type { State } from "@/lib/utils.ts";
import { App, staticFiles } from "fresh";

export const app = new App<State>().use(staticFiles()).fsRoutes();
