/**
 * Fisher-Yates shuffle algorithm for deterministic, testable shuffling
 */
export function shuffle<T>(array: T[], seed?: number): T[] {
  const shuffled = [...array];
  const random = seed !== undefined ? seededRandom(seed) : Math.random;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Simple seeded random number generator for reproducible shuffles
 */
function seededRandom(seed: number): () => number {
  let current = seed;
  return () => {
    current = (current * 9301 + 49297) % 233280;
    return current / 233280;
  };
}
