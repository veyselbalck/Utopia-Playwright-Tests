require('dotenv').config();

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './app/tests/playwright',
  testMatch: '**/*.spec.js',
  testIgnore: '**/waiting for repair/**',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
