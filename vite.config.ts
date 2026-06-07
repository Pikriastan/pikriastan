import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
  plugins: [fresh() as PluginOption, tailwindcss()],
  // resolve: {
  //   alias: {
  //     react: "preact/compat",
  //     "react-dom": "preact/compat",
  //   },
  // },
});
