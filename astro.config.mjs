import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
const site =
  process.env.SITE_ORIGIN ||
  (process.env.CF_PAGES_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`));
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  integrations: site ? [sitemap()] : [],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
