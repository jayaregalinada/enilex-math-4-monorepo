import { expect, test } from '@playwright/test';

/**
 * Full-run smoke test: onboarding → play an Easy run to game over → save a score
 * → see it on the leaderboard. Gameplay is random, so we just keep answering
 * (picking the first option, which is wrong ~3/4 of the time) until the run ends.
 */
test('plays a full run and records a leaderboard entry', async ({ page }) => {
  await page.goto('/');

  // Onboarding card opens on first visit — dismiss it.
  await page.getByRole('button', { name: 'Got it' }).click();

  // Home → Difficulty → Easy → place picker → game.
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await page.getByRole('button', { name: /easy/i }).click();
  await page.locator('.place-card').first().click();

  // The game screen is up: prompt + four answers.
  await expect(page.getByText(/round/i).first()).toBeVisible();

  // At game over the name-entry dialog auto-opens; its Save button is the end signal
  // (the "Game over" heading goes aria-hidden behind the modal, so we can't query it).
  const saveScore = page.getByRole('button', { name: 'Save' });
  // The teaching "Next" button (a primary button, distinct from "Next track").
  const next = page.locator('button.btn--primary', { hasText: 'Next' });

  // Answer until the run ends. Easy reveals a "Next" button between questions.
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await saveScore.isVisible()) {
      break;
    }

    await page.locator('.answer:not([disabled])').first().click();

    // After answering, the correct option is highlighted (or the run just ended).
    await expect(page.locator('.answer--correct').or(saveScore)).toBeVisible();

    if (await saveScore.isVisible()) {
      break;
    }

    await next.click();
  }

  // Save a nickname from the auto-opened dialog.
  const nickname = 'E2E-Player';
  await expect(saveScore).toBeVisible();
  await page.getByRole('textbox', { name: 'Nickname' }).fill(nickname);
  await saveScore.click();

  // From game over, open the leaderboard and find the saved score.
  await page.getByRole('button', { name: 'Leaderboard' }).click();
  await expect(page.getByRole('heading', { name: 'Leaderboard' })).toBeVisible();
  await expect(page.getByText(nickname)).toBeVisible();
});
