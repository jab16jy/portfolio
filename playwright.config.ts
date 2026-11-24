import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:4322";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  reporter: "list",
  forbidOnly: !!process.env.CI,
  use: {
    baseURL,
    locale: "es-ES",
    timezoneId: "UTC",
    colorScheme: "light",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4322",
    env: { ASTRO_TELEMETRY_DISABLED: "1" },
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
