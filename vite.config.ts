import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
  plugins: [fresh() as PluginOption, tailwindcss()],
  // sharp ships native (.node) binaries that must be resolved at runtime from
  // node_modules. If it gets bundled into the server build, its loader can no
  // longer locate those binaries and throws "Could not load the sharp module"
  // in production. Keep it (and its platform packages) external.
  ssr: {
    external: ["sharp"],
  },
});
