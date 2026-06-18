/** A random source in [0, 1). Injectable so tests can shuffle deterministically. */
export type ShuffleRng = () => number;

/**
 * Returns a new array with the items in random order (Fisher–Yates). Does not
 * mutate the input.
 */
export function shuffle<Item>(items: readonly Item[], rng: ShuffleRng = Math.random): Item[] {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = result[i];
    const b = result[j];

    // Guard for noUncheckedIndexedAccess; i and j are always in range here.
    if (a === undefined || b === undefined) {
      continue;
    }

    result[i] = b;
    result[j] = a;
  }

  return result;
}
