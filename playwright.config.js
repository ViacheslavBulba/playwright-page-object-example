const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  expect: {
    timeout: 25000,
  },
  globalTimeout: 480 * 60 * 1000,
  timeout: 480 * 60 * 1000,
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 10 : undefined,
  reporter: 'html',

  use: {

    // // To maximize a browser window
    viewport: null,
    launchOptions: {
      args: ["--start-maximized"],
    },
    headless: false,

    // // To run in headless mode set up
    // // viewport: null, // comment out
    // headless: true,

    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,

    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // name: 'chromium',
      // // use: { ...devices['Desktop Chrome'] },

      name: 'Google Chrome',
      use: { channel: 'chrome' },
    },
  ],

});