import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/**
 * Playwright smoke-test config. Builds nothing itself — it starts the Vite preview
 * server (so it tests the production bundle) and runs the specs in `e2e/`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Tablet portrait viewport on Chromium, to exercise the responsive layout
      // without pulling in a second browser engine just for a smoke test.
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1112 } },
    },
  ],
  webServer: {
    command: `pnpm preview --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
