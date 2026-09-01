const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  webServer: { command: 'python -m http.server 8080', port: 8080, reuseExistingServer: true },
  use: { baseURL: 'http://127.0.0.1:8080', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ]
});
