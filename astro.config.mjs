// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://llmleft.com",
  trailingSlash: "always",
  output: "static",
  integrations: [sitemap()],
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});

