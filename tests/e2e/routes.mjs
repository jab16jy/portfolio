import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const dist = fileURLToPath(new URL("../../dist/", import.meta.url));

function walk(relative = "") {
  return readdirSync(join(dist, relative), { withFileTypes: true }).flatMap(
    (entry) => {
      const name = `${relative}${entry.name}`;
      if (entry.isDirectory()) return walk(`${name}/`);
      return entry.isFile() ? [name] : [];
    },
  );
}

// Static output: /x/index.html is served at /x/, /x.html at /x.html.
export function inventory() {
  const files = walk().sort();
  const pages = files
    .filter((file) => file.endsWith(".html"))
    .map((file) => {
      const route =
        `/${file.split("/").map(encodeURIComponent).join("/")}`.replace(
          /\/index\.html$/,
          "/",
        );
      const lang = route.startsWith("/en/") ? "en" : "es";
      return { route, file, lang };
    });
  const editorial = pages.filter(
    ({ route }) => !/\/404(?:\.html|\/)$/.test(route),
  );
  for (const lang of ["es", "en"]) {
    const routes = editorial
      .filter((page) => page.lang === lang)
      .map((page) => page.route);
    if (routes.length !== 8 || !routes.includes(lang === "en" ? "/en/" : "/")) {
      throw new Error(
        `Se esperaban portada y 7 destinos ${lang}; encontrados: ${routes.join(", ")}`,
      );
    }
  }
  return { files, pages, editorial };
}
