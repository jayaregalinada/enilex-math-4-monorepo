import { expect, type Page, test } from '@playwright/test';

/** Dismiss first-visit onboarding (sound gate + how-to-play) and start an Easy run. */
async function startEasyRun(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Got it' }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: /easy/i }).click();
  await page.locator('.place-card').first().click();
  await expect(page.getByText(/round/i).first()).toBeVisible();
}

test('pause menu restarts the run', async ({ page }) => {
  await startEasyRun(page);

  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('heading', { name: 'Paused' })).toBeVisible();
  await page.getByRole('button', { name: 'Restart' }).click();

  // A fresh run: the pause menu closes and the game screen is interactive again.
  await expect(page.getByRole('heading', { name: 'Paused' })).toBeHidden();
  await expect(page.getByText(/round/i).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
});

test('pause menu quits to home', async ({ page }) => {
  await startEasyRun(page);

  await page.getByRole('button', { name: 'Pause' }).click();
  await page.getByRole('button', { name: 'Quit' }).click();

  await expect(page.getByRole('heading', { name: 'Rounding Numbers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
});

test('reduce-effects setting toggles the FX shell class', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'No' }).click();
  await page.getByRole('button', { name: 'Got it' }).click();

  const shell = page.locator('.app-shell');
  await expect(shell).not.toHaveClass(/app-shell--reduced/);

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Reduce effects' }).click();

  await expect(shell).toHaveClass(/app-shell--reduced/);
});
