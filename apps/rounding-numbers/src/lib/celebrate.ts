import confetti from 'canvas-confetti';

/**
 * Fires a short confetti burst for streak milestones. No-ops where the canvas
 * isn't available (tests/SSR) and respects the user's reduced-motion preference.
 */
export function celebrate(): void {
  if (typeof document === 'undefined') {
    return;
  }

  const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  void confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    origin: { y: 0.7 },
  });
}
