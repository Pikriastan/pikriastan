import { configure, getConsoleSink, getLogger } from "@logtape/logtape";

await configure({
  sinks: {
    console: getConsoleSink(),
    meta: getConsoleSink(),
  },
  filters: {},
  loggers: [
    { category: ["logtape", "meta"], sinks: ["meta"], lowestLevel: "warning" },
    { category: ["app", "server"], sinks: ["console"] },
  ],
});

export const logger = getLogger(["app", "server"]);
