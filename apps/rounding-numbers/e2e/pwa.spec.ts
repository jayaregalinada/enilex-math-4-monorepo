import { expect, test } from '@playwright/test';

/**
 * PWA smoke assertions: verifies the manifest link is injected in the page and
 * that the service worker registers successfully against the production preview.
 * These run against the same `vite preview` server as the other e2e specs.
 */
test('page includes a web app manifest link', async ({ page }) => {
  await page.goto('/');

  const manifest = page.locator('link[rel="manifest"]');
  await expect(manifest).toHaveCount(1);

  // Manifest must point to a real file; the plugin emits manifest.webmanifest.
  const href = await manifest.getAttribute('href');
  expect(href).toMatch(/manifest/);
});

test('service worker registers and becomes active', async ({ page }) => {
  await page.goto('/');

  // navigator.serviceWorker.ready resolves when the SW is controlling the page.
  // Give it up to 15 s — the production SW installs on first load.
  const registered = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      return false;
    }
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 15_000)),
    ]);
    return registration != null;
  });

  expect(registered).toBe(true);
});
