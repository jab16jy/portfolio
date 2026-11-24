import { readFileSync } from "node:fs";
import { join } from "node:path";
import { load } from "cheerio";
import { dist, inventory } from "../tests/e2e/routes.mjs";

// Set SITE_ORIGIN if the build uses absolute production URLs for internal links.
const origin = new URL(process.env.SITE_ORIGIN ?? "http://127.0.0.1:4322")
  .origin;
const { files, pages, editorial } = inventory();
const assets = new Set(files);
const errors = [];
const docs = new Map();
const pairs = new Map();

for (const { file } of pages) {
  const $ = load(readFileSync(join(dist, file), "utf8"));
  const anchors = new Set();
  $("[id], a[name]").each((_, el) => {
    for (const attr of ["id", "name"]) {
      if ($(el).attr(attr)) anchors.add($(el).attr(attr));
    }
  });
  docs.set(file, { $, anchors });
}

function target(url) {
  const path = decodeURIComponent(url.pathname).slice(1);
  if (assets.has(path)) return path;
  const index = `${path.replace(/\/?$/, "/")}index.html`.replace(/^\//, "");
  if (assets.has(index)) return index;
  if (!path.endsWith("/") && assets.has(`${path}.html`)) return `${path}.html`;
}

for (const page of pages) {
  const { $, anchors } = docs.get(page.file);
  const fail = (message) => errors.push(`${page.route}: ${message}`);
  const address = new URL(page.route, origin);
  const base = new URL($("base[href]").first().attr("href") ?? "", address);
  if (base.origin !== origin) fail(`base externa: ${base}`);

  $("a[href], area[href], link[href], [src]").each((_, el) => {
    const raw = $(el).attr("href") ?? $(el).attr("src");
    try {
      const url = new URL(raw, base);
      if (url.origin !== origin) return;
      const file = target(url);
      if (!file) return fail(`destino inexistente: ${raw}`);
      const fragment = decodeURIComponent(url.hash.slice(1));
      const ids = docs.get(file)?.anchors;
      if (
        ids &&
        fragment &&
        fragment.toLowerCase() !== "top" &&
        !ids.has(fragment)
      ) {
        fail(`ancla inexistente: ${raw}`);
      }
    } catch {
      fail(`URL inválida: ${raw}`);
    }
  });

  if (!editorial.includes(page)) continue;
  if ($("html").attr("lang")?.toLowerCase().split("-")[0] !== page.lang)
    fail("html[lang] incorrecto");
  if (!anchors.has("main") || $("main#main").length !== 1)
    fail("falta main#main único");
  const alternate = $("a[data-language-switch][href]");
  if (alternate.length !== 1) {
    fail("se esperaba un enlace de idioma");
    continue;
  }
  const url = new URL(alternate.attr("href"), base);
  const other = editorial.find((p) => p.file === target(url));
  if (url.origin !== origin || !other || other.lang === page.lang)
    fail(`idioma alternativo incorrecto: ${url}`);
  else pairs.set(page.route, other.route);
}

for (const [route, alternate] of pairs) {
  if (pairs.get(alternate) !== route)
    errors.push(`${route}: ${alternate} no devuelve al destino original`);
}
if (pairs.get("/") !== "/en/") errors.push("Las portadas no están emparejadas");

const repositories = {
  "inventory-tally": "inventory-tally",
  "sistema-pos": "Sistema_Pos",
  techcamp: "techcamp-v2",
};

for (const [slug, repo] of Object.entries(repositories)) {
  const cases = {};
  for (const lang of ["es", "en"]) {
    const matches = editorial.filter(
      (p) =>
        p.lang === lang &&
        p.route.replace(/(?:\/|\.html)$/, "").endsWith(`/${slug}`),
    );
    if (matches.length !== 1) {
      errors.push(`${lang}: falta ficha única de ${slug}`);
      continue;
    }
    const [page] = matches;
    cases[lang] = page.route;
    const { $ } = docs.get(page.file);
    const links = new Set(
      $("main a[href]")
        .map((_, el) => $(el).attr("href"))
        .get(),
    );
    const md = readFileSync(
      new URL(`../src/content/projects/${lang}/${slug}.md`, import.meta.url),
      "utf8",
    ).replace(/\r\n/g, "\n");
    // These six local Markdown files use a block list of label/url records.
    const frontmatter = /^---\n([\s\S]*?)\n---(?:\n|$)/.exec(md)?.[1];
    const block =
      /^sources:\s*\n((?:[ \t]+[^\n]*(?:\n|$))+)/m.exec(
        frontmatter ?? "",
      )?.[1] ?? "";
    const urls = [
      ...block.matchAll(/^\s*(?:-\s+)?url:\s*["']?([^\s"']+)["']?\s*$/gm),
    ].map((m) => m[1]);
    if (!urls.length || urls.length !== (block.match(/^\s*-/gm) ?? []).length)
      errors.push(`${page.route}: lista sources incompleta`);
    const permalink = new RegExp(
      `^https://github\\.com/jab16jy/${repo}/blob/[0-9a-f]{40}/[^?#]+#L([1-9]\\d*)(?:-L([1-9]\\d*))?$`,
    );
    for (const href of urls) {
      const lines = permalink.exec(href);
      if (!lines || (lines[2] && Number(lines[2]) < Number(lines[1])))
        errors.push(`${page.route}: permalink inválido: ${href}`);
      if (!links.has(href))
        errors.push(`${page.route}: fuente no enlazada: ${href}`);
    }
  }
  if (cases.es && pairs.get(cases.es) !== cases.en)
    errors.push(`${slug}: fichas no emparejadas`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `OK: ${pages.length} documentos; 8 pares ES/EN y fuentes de 6 fichas verificados en dist.`,
  );
}
