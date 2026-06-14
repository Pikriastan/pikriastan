import { configure, getConsoleSink, getLogger } from "@logtape/logtape";

await configure({
  sinks: {
    console: getConsoleSink(),
  },
  filters: {},
  loggers: [
    { category: ["app"], sinks: ["console"] },
  ],
});

export const logger = getLogger(["app", "server"]);
