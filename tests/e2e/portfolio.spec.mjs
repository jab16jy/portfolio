import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { inventory } from "./routes.mjs";

const { editorial } = inventory();

test.beforeEach(async ({ context, baseURL }) => {
  await context.routeWebSocket("**/*", (socket) => socket.close());
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.origin === baseURL || ["data:", "blob:"].includes(url.protocol)
      ? route.continue()
      : route.abort("blockedbyclient");
  });
});

async function review(page, info) {
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all(
      Array.from(document.images, (img) => img.decode().catch(() => {})),
    );
    await document.fonts.ready;
  });
  await page.screenshot({
    path: info.outputPath("review.png"),
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    scale: "css",
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.map((n) => n.target),
    })),
  ).toEqual([]);
}

async function reveal(page, control, mobile) {
  if (mobile && !(await control.isVisible()))
    await page.locator("button[data-menu-toggle]").click();
  await expect(control).toBeVisible();
  return control;
}

for (const { route, lang } of editorial) {
  test(`revisión ${lang} ${route}`, async ({
    page,
    isMobile,
    baseURL,
  }, info) => {
    expect((await page.goto(route))?.status()).toBe(200);
    const otherLang = lang === "es" ? "en" : "es";
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      new RegExp(`^${lang}(?:-|$)`, "i"),
    );
    await review(page, info);

    const skip = page.locator("a.skip");
    await page.keyboard.press("Tab");
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main");
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();

    const alternate = page.locator("a[data-language-switch]");
    await reveal(page, alternate, isMobile);
    const dest = new URL(await alternate.getAttribute("href"), page.url());
    expect(dest.origin).toBe(baseURL);
    await alternate.click();
    await expect(page.locator("html")).toHaveAttribute(
      "lang",
      new RegExp(`^${otherLang}(?:-|$)`, "i"),
    );
    await reveal(page, alternate, isMobile);
    await alternate.click();
    await expect(page).toHaveURL(new URL(route, baseURL).href);
  });
}

for (const lang of ["es", "en"]) {
  const home = lang === "es" ? "/" : "/en/";

  test(`navegación ${lang}`, async ({ page, isMobile }) => {
    await page.goto(home);
    const nav = page.locator("#primary-nav");
    if (isMobile) {
      const menu = page.locator("button[data-menu-toggle]");
      await expect(menu).toHaveAccessibleName(/\S/);
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await expect(nav).toBeHidden();
      await menu.focus();
      await page.keyboard.press("Enter");
      await expect(menu).toHaveAttribute("aria-expanded", "true");
      await expect(nav).toBeVisible();
      await menu.click();
      await expect(nav).toBeHidden();
      await menu.click();
    }
    const links = nav.getByRole("link");
    await expect(links.first()).toBeVisible();
    const start = page.url();
    let followed = false;
    for (const link of await links.all()) {
      await expect(link).toHaveAccessibleName(/\S/);
    }
    for (const link of await links.all()) {
      const url = new URL(await link.getAttribute("href"), start);
      if (url.href === start || url.origin !== new URL(start).origin) continue;
      if (url.pathname.startsWith("/en/") !== (lang === "en")) continue;
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(url.href);
      followed = true;
      break;
    }
    expect(followed, "ningún destino navegable del mismo idioma").toBe(true);
  });

  test(`tema persistente ${lang}`, async ({ page, isMobile }) => {
    await page.goto(home);
    const html = page.locator("html");
    const toggle = page.locator("[data-theme-toggle]");
    for (const theme of ["dark", "light"]) {
      await reveal(page, toggle, isMobile);
      await toggle.click();
      await expect(html).toHaveAttribute("data-theme", theme);
      await page.reload();
      await expect(html).toHaveAttribute("data-theme", theme);
      if (theme === "dark")
        expect(
          (await new AxeBuilder({ page }).analyze()).violations.map(
            (v) => v.id,
          ),
        ).toEqual([]);
    }
  });

  test(`índice a los tres casos ${lang}`, async ({ page, baseURL }) => {
    for (const slug of ["inventory-tally", "sistema-pos", "techcamp"]) {
      await page.goto(`${home}projects/`);
      const dest = `${home}projects/${slug}/`;
      await page.locator(`main .project-name a[href="${dest}"]`).click();
      await expect(page).toHaveURL(new URL(dest, baseURL).href);
      await expect(page.locator("figure.capture img")).toHaveAccessibleName(
        /\S/,
      );
    }
  });

  test(`contacto y descarga ${lang}`, async ({ page, isMobile }) => {
    await page.goto(home);
    const github = page
      .locator(
        'a[href="https://github.com/jab16jy" i], a[href="https://github.com/jab16jy/" i]',
      )
      .first();
    await expect(github).toHaveAccessibleName(/\S/);
    const email = page.locator('a[href^="mailto:"]').first();
    await expect(email).toHaveAccessibleName(/\S/);
    await expect(email).toHaveAttribute(
      "href",
      /^mailto:[^@\s?]+@[^@\s?]+\.[^@\s?]+(?:\?.*)?$/,
    );

    const filename = `johan-borrero-${lang}.pdf`;
    const pdf = page.locator(`a[href="/cv/${filename}"]`).first();
    await reveal(page, pdf, isMobile);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      pdf.click(),
    ]);
    expect(await download.failure()).toBeNull();
    const bytes = await readFile(await download.path());
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  });

  test(`404 ${lang}`, async ({ page }, info) => {
    expect((await page.goto(`${home}__quality_missing__/`))?.status()).toBe(
      404,
    );
    await expect(page.locator("main#main")).toBeVisible();
    await review(page, info);
  });
}
