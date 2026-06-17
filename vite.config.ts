import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@netlify/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    netlify({
      blobs: { enabled: true },
      // Netlify static middleware sets .ts files to video/mp2t (MPEG transport
      // stream), which blocks module scripts in the browser. Vite still serves
      // and transforms /src/*; use `pnpm dev:netlify` when you need full Netlify
      // request emulation (blobs, functions, redirects).
      middleware: false,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
