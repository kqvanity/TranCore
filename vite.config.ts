import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "vite-plugin-web-extension";
import pkg from "./package.json";

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: "src/manifest.json",
      watchFilePaths: [],
      zip: {
        name: `${pkg.name}-${pkg.version}`,
        output: "zip",
      },
    }),
  ],
});
