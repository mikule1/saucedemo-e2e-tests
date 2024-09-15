// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'UI Tests',
      testMatch: /^(?!.*api-tests).*\.spec\.js$/,
      use: {
        baseURL: 'https://www.saucedemo.com',
      },
    },
    {
      name: 'API Tests',
      testMatch: /api-tests\.spec\.js/,
      use: {
        baseURL: 'https://petstore.swagger.io/v2',
      },
    },
  ],
});