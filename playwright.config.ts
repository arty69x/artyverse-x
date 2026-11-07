import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45000,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:5174",
    launchOptions: {
      executablePath: "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/dev.mjs",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: false,
    env: {
      ARTYVERSE_API_PORT: "4312",
      ARTYVERSE_WEB_PORT: "5174",
      ARTYVERSE_DATA_DIR: `.test-data/run-${Date.now()}`,
    },
  },
  reporter: [
    ["list"],
    ["json", { outputFile: "tests/evidence/playwright-results.json" }],
  ],
});
