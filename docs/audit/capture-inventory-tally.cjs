// From portfolio: node docs/audit/capture-inventory-tally.cjs <path to playwright>
// Requires locally installed Chrome. No sign-in, browser profile or fixture data.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const origin = 'https://proyectoconteoinv-d017a.web.app';
const { chromium } = require(process.argv[2] ? path.resolve(process.argv[2]) : 'playwright');

(async () => {
  const temp = fs.mkdtempSync(path.join(__dirname, '.inventory-browser-'));
  process.env.TEMP = process.env.TMP = process.env.TMPDIR = temp;
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1, locale: 'es-CO', serviceWorkers: 'block' });
    await page.route('**/*', route => {
      const req = route.request();
      return new URL(req.url()).origin === origin && ['GET', 'HEAD'].includes(req.method())
        ? route.continue() : route.abort();
    });
    const response = await page.goto(origin, { waitUntil: 'domcontentloaded' });
    if (response?.status() !== 200) throw Error('Public page unavailable');
    await page.getByRole('heading', { name: 'Entrar', exact: true }).waitFor();
    for (const type of ['email', 'password']) {
      const field = page.locator(`input[type="${type}"]`);
      if (!await field.isVisible() || !await field.evaluate(el => el.value.length === 0)) {
        throw Error('Expected empty public sign-in form');
      }
    }
    await page.evaluate(() => document.fonts.ready.then(() => true));
    const dir = path.join(root, 'public/projects');
    fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: path.join(dir, 'inventory-tally-login.png'), animations: 'disabled' });
    console.log(`${response.status()} ${new URL(page.url()).pathname} — 1280x800`);
  } finally {
    try { await browser?.close(); } finally { fs.rmSync(temp, { recursive: true, force: true }); }
  }
})().catch(err => { console.error(err.message); process.exitCode = 1; });
