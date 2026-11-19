import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.valtrea.com.br",
  trailingSlash: "ignore",
  i18n: {
    locales: ["pt", "en"],
    defaultLocale: "pt",
    routing: { prefixDefaultLocale: false },
  },
  build: { format: "directory" },
});
