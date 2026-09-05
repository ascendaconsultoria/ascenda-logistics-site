const { defineConfig, devices } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  webServer: { command: 'node node_modules/http-server/bin/http-server . -a 127.0.0.1 -p 8093 -c-1', port: 8093, reuseExistingServer: false },
  use: { baseURL: 'http://127.0.0.1:8093', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ]
});
