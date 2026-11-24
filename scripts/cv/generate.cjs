// From the portfolio root: node scripts/cv/generate.cjs [path to an existing playwright package]
// Uses installed Chrome; CV_CHANNEL=msedge selects Edge instead. No site build needed.
const { readFileSync, mkdirSync, writeFileSync } = require("node:fs");
const path = require("node:path");
const { chromium } = require(
  process.argv[2] ? path.resolve(process.argv[2]) : "playwright",
);
const out = path.resolve(__dirname, "../../public/cv");

async function generate() {
  const html = readFileSync(path.join(__dirname, "resume.html"), "utf8");
  const browser = await chromium.launch({
    channel: process.env.CV_CHANNEL || "chrome",
  });
  const outputs = [];
  try {
    for (const lang of ["es", "en"]) {
      const page = await browser.newPage({ offline: true });
      await page.setContent(html);
      await page.emulateMedia({ media: "print" });
      await page.evaluate(async (lang) => {
        document.documentElement.lang = lang;
        document.querySelectorAll("main[lang]").forEach((el) => {
          if (el.lang !== lang) el.remove();
        });
        const sheet = document.querySelector("main").getBoundingClientRect();
        await document.fonts.ready;
        const walker = document.createTreeWalker(
          document.querySelector("main"),
          NodeFilter.SHOW_TEXT,
        );
        while (walker.nextNode()) {
          if (!walker.currentNode.textContent.trim()) continue;
          const r = document.createRange();
          r.selectNodeContents(walker.currentNode);
          for (const b of r.getClientRects()) {
            if (
              b.left < sheet.left + 30 ||
              b.right > sheet.right - 30 ||
              b.top < sheet.top + 30 ||
              b.bottom > sheet.bottom - 30
            )
              throw Error(`Text outside safe margins: ${r.toString()}`);
          }
        }
      }, lang);
      const pdf = await page.pdf({
        preferCSSPageSize: true,
        printBackground: true,
        tagged: true,
      });
      if (
        (pdf.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length !== 1
      )
        throw Error(`${lang}: expected one PDF page`);
      outputs.push([lang, pdf]);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  mkdirSync(out, { recursive: true });
  for (const [lang, pdf] of outputs) {
    writeFileSync(path.join(out, `johan-borrero-${lang}.pdf`), pdf);
    console.log(`${lang}: 1 page, ${pdf.length} bytes`);
  }
}
generate().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
